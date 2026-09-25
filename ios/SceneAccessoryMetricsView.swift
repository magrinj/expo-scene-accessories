import ExpoModulesCore
import UIKit

/// Reports the accessory scene's own geometry, not the main window's.
final class SceneAccessoryMetricsView: ExpoView {
  let onMetricsChange = EventDispatcher()

  private var lastPayload: NSDictionary?
  private var observers: [NSObjectProtocol] = []

  override func didMoveToWindow() {
    super.didMoveToWindow()
    observers.forEach(NotificationCenter.default.removeObserver)
    observers = []
    guard let scene = window?.windowScene else {
      return
    }
    // `will…` notifications fire before `activationState` changes, so the state comes from the notification.
    let states: [(Notification.Name, String)] = [
      (UIScene.didActivateNotification, "active"),
      (UIScene.willDeactivateNotification, "inactive"),
      (UIScene.willEnterForegroundNotification, "inactive"),
      (UIScene.didEnterBackgroundNotification, "background"),
    ]
    observers = states.map { name, state in
      NotificationCenter.default.addObserver(forName: name, object: scene, queue: .main) { [weak self] _ in
        MainActor.assumeIsolated { self?.emit(activationState: state) }
      }
    }
    emit()
  }

  override func layoutSubviews() {
    super.layoutSubviews()
    emit()
  }

  override func safeAreaInsetsDidChange() {
    super.safeAreaInsetsDidChange()
    emit()
  }

  private func emit(activationState: String? = nil) {
    guard let window, let scene = window.windowScene else {
      return
    }
    let insets = window.safeAreaInsets
    let payload: [String: Any] = [
      "size": ["width": window.bounds.width, "height": window.bounds.height],
      "safeAreaInsets": ["top": insets.top, "right": insets.right, "bottom": insets.bottom, "left": insets.left],
      "scale": window.traitCollection.displayScale,
      "activationState": activationState ?? Self.activationState(scene.activationState),
    ]
    let dictionary = payload as NSDictionary
    if dictionary == lastPayload {
      return
    }
    lastPayload = dictionary
    onMetricsChange(payload)
  }

  private static func activationState(_ state: UIScene.ActivationState) -> String {
    switch state {
    case .foregroundActive: return "active"
    case .foregroundInactive: return "inactive"
    default: return "background"
    }
  }
}
