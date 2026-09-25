import ExpoModulesCore
import React
import UIKit

/// Invisible view owning one scene accessory registration for as long as it is in a window.
final class SceneAccessoryAnchorView: ExpoView {
  let onAvailabilityChange = EventDispatcher()

  var accessoryId: String?
  var kind: SceneAccessoryKind?
  var isAccessoryEnabled = true {
    didSet {
      if #available(iOS 27.0, *) {
        (registration as? UISceneAccessoryRegistration)?.isEnabled = isAccessoryEnabled
      }
    }
  }

  // Typed as AnyObject so the class compiles for deployment targets below iOS 27.
  private var registration: AnyObject?
  private weak var owner: UIViewController?
  private var lastAvailable: Bool?

  override func didMoveToSuperview() {
    super.didMoveToSuperview()
    registerIfNeeded()
  }

  override func didMoveToWindow() {
    super.didMoveToWindow()
    if window == nil {
      unregister()
    } else {
      registerIfNeeded()
    }
  }

  func registerIfNeeded() {
    guard #available(iOS 27.0, *), window != nil, let accessoryId, let kind, kind.isSupported else {
      return
    }
    let controller = reactViewController()
    if registration != nil, controller === owner {
      return
    }
    unregister()
    guard let controller, let accessory = kind.makeAccessory(accessoryId: accessoryId) else {
      return
    }
    let newRegistration = controller.registerSceneAccessory(accessory)
    newRegistration.isEnabled = isAccessoryEnabled
    registration = newRegistration
    owner = controller
    log.debug("[expo-scene-accessories] Registered \(kind.rawValue) accessory \(accessoryId) on \(type(of: controller)).")
    lastAvailable = nil
    setNeedsUpdateProperties()
  }

  func unregister() {
    guard #available(iOS 27.0, *), let registration = registration as? UISceneAccessoryRegistration else {
      return
    }
    owner?.unregisterSceneAccessory(registration)
    log.debug("[expo-scene-accessories] Unregistered accessory \(accessoryId ?? "?").")
    self.registration = nil
    owner = nil
  }

  // UIKit tracks the `isAvailable` read below and calls this again whenever it changes.
  @available(iOS 26.0, *)
  override func updateProperties() {
    super.updateProperties()
    guard #available(iOS 27.0, *), let registration = registration as? UISceneAccessoryRegistration else {
      return
    }
    let available = registration.isAvailable
    if available != lastAvailable {
      lastAvailable = available
      log.debug("[expo-scene-accessories] Accessory \(accessoryId ?? "?") available: \(available).")
      onAvailabilityChange(["available": available])
    }
  }
}
