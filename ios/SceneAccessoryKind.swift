import UIKit

enum SceneAccessoryKind: String {
  case cameraCapture
  case externalNonInteractive

  var isSupported: Bool {
    switch self {
    case .cameraCapture:
      if #available(iOS 27.1, *) { return true }
      return false
    case .externalNonInteractive:
      if #available(iOS 27.0, *) { return true }
      return false
    }
  }

  var isInteractive: Bool { self == .cameraCapture }

  @available(iOS 27.0, *)
  func makeAccessory(accessoryId: String) -> UISceneAccessory? {
    let userInfo = ["accessoryId": accessoryId, "kind": rawValue]
    switch self {
    case .cameraCapture:
      guard #available(iOS 27.1, *) else { return nil }
      return .cameraCapture(
        sceneConfiguration: configuration(role: .windowCameraCaptureAccessory),
        userInfo: userInfo
      )
    case .externalNonInteractive:
      return .externalNonInteractive(
        sceneConfiguration: configuration(role: .windowExternalDisplayNonInteractive),
        userInfo: userInfo
      )
    }
  }

  private func configuration(role: UISceneSession.Role) -> UISceneConfiguration {
    let configuration = UISceneConfiguration(name: "ExpoSceneAccessory", sessionRole: role)
    configuration.delegateClass = SceneAccessorySceneDelegate.self
    return configuration
  }
}
