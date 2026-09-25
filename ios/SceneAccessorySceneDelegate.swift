import Expo
import ExpoModulesCore
import React
import UIKit

/// Delegate UIKit instantiates for every accessory scene. Mounts a second React Native surface on the
/// app's existing React Native host (same JS runtime) that renders the matching accessory's children.
@objc(ExpoSceneAccessorySceneDelegate)
final class SceneAccessorySceneDelegate: UIResponder, UIWindowSceneDelegate {
  var window: UIWindow?
  private var reloadObserver: NSObjectProtocol?

  func scene(
    _ scene: UIScene,
    willConnectTo session: UISceneSession,
    options connectionOptions: UIScene.ConnectionOptions
  ) {
    guard #available(iOS 27.0, *), let windowScene = scene as? UIWindowScene else {
      return
    }
    guard
      let userInfo = connectionOptions.sceneAccessoryUserInfo as? [String: String],
      let accessoryId = userInfo["accessoryId"],
      let kind = SceneAccessoryKind(rawValue: userInfo["kind"] ?? "")
    else {
      log.warn("[expo-scene-accessories] Accessory scene connected without accessory userInfo.")
      return
    }
    guard let factory = (UIApplication.shared.delegate as? ExpoReactNativeFactoryProvider)?.reactNativeFactory else {
      log.warn("[expo-scene-accessories] Unable to access the application's React Native factory. Expo SDK 58+ is required.")
      return
    }

    let rootView = Self.makeRootView(factory: factory, accessoryId: accessoryId)
    let controller = UIViewController()
    controller.view = rootView

    let window = UIWindow(windowScene: windowScene)
    window.rootViewController = controller
    window.isUserInteractionEnabled = kind.isInteractive
    window.isHidden = false
    self.window = window

    // On a JS reload the host restarts every surface it still holds, before the new bundle has
    // registered `ExpoSceneAccessoryRoot`. Releasing ours first keeps it out of that restart; UIKit
    // disconnects the scene once the reloaded tree no longer declares the accessory.
    reloadObserver = NotificationCenter.default.addObserver(
      forName: .RCTTriggerReloadCommand,
      object: nil,
      queue: nil
    ) { [weak self] _ in
      // Must run before the host continues its reload, hence synchronously.
      if Thread.isMainThread {
        MainActor.assumeIsolated { self?.tearDownSurface() }
      } else {
        DispatchQueue.main.sync { self?.tearDownSurface() }
      }
    }
    log.info("[expo-scene-accessories] Accessory scene connected (\(kind.rawValue), \(accessoryId)).")
  }

  func sceneDidDisconnect(_ scene: UIScene) {
    tearDownSurface()
    window?.isHidden = true
    window = nil
    reloadObserver.map(NotificationCenter.default.removeObserver)
    reloadObserver = nil
    log.info("[expo-scene-accessories] Accessory scene disconnected.")
  }

  /// `rootViewFactory.view` runs the ReactDelegate handlers, which are meant for the app's main root
  /// view: expo-dev-launcher returns its launcher UI and expo-updates may return a deferred view.
  /// `recreateRootView` skips them and adds a surface to the already running host.
  private static func makeRootView(factory: RCTReactNativeFactory, accessoryId: String) -> UIView {
    let moduleName = "ExpoSceneAccessoryRoot"
    let initialProperties = ["accessoryId": accessoryId]
    if let factory = factory as? ExpoReactNativeFactory {
      return factory.recreateRootView(
        withBundleURL: nil,
        moduleName: moduleName,
        initialProps: initialProperties,
        launchOptions: nil
      )
    }
    return factory.rootViewFactory.view(withModuleName: moduleName, initialProperties: initialProperties)
  }

  private func tearDownSurface() {
    if let surface = (window?.rootViewController?.view as? RCTSurfaceHostingView)?.surface {
      Self.retire(surface)
    }
    window?.rootViewController = nil
  }

  /// Stops the surface and unregisters it from its presenter, which is what its `dealloc` does anyway.
  /// A JS reload makes the host queue a restart of every surface it knows, holding them strongly; an
  /// unregistered surface ignores that restart instead of running `ExpoSceneAccessoryRoot` again and
  /// then being deallocated while running (which Fabric asserts on).
  /// A surface that isn't running yet may be mid-start: `start()` checks its status, then starts on a
  /// background queue. Unregistering in between would crash, so give that start time to land first.
  // ponytail: fixed 0.1s window; a reload's queued restart waits for the new bundle, which takes longer.
  private static func retire(_ surface: RCTSurfaceProtocol) {
    if surface.stage.contains(.surfaceDidRun) {
      stopAndUnregister(surface)
    } else {
      DispatchQueue.main.asyncAfter(deadline: .now() + 0.1) {
        stopAndUnregister(surface)
      }
    }
  }

  // ObjC runtime call because RCTSurfacePresenter's header is C++.
  private static func stopAndUnregister(_ surface: RCTSurfaceProtocol) {
    surface.stop()
    guard let object = surface as? NSObject,
      let presenter = object.value(forKey: "surfacePresenter") as? NSObject
    else {
      return
    }
    let unregister = NSSelectorFromString("unregisterSurface:")
    if presenter.responds(to: unregister) {
      presenter.perform(unregister, with: object)
    }
  }
}
