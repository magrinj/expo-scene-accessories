import ExpoModulesCore

@ExpoModule("ExpoSceneAccessories")
public final class ExpoSceneAccessoriesModule: Module {
  @JS
  func isSupported(kind: String) -> Bool {
    SceneAccessoryKind(rawValue: kind)?.isSupported ?? false
  }

  public func definition() -> ModuleDefinition {
    View(SceneAccessoryAnchorView.self) {
      Events("onAvailabilityChange")

      Prop("accessoryId") { (view: SceneAccessoryAnchorView, accessoryId: String) in
        view.accessoryId = accessoryId
      }
      Prop("kind") { (view: SceneAccessoryAnchorView, kind: String) in
        view.kind = SceneAccessoryKind(rawValue: kind)
      }
      Prop("enabled") { (view: SceneAccessoryAnchorView, enabled: Bool) in
        view.isAccessoryEnabled = enabled
      }
      OnViewDidUpdateProps { (view: SceneAccessoryAnchorView) in
        view.registerIfNeeded()
      }
    }

    View(SceneAccessoryMetricsView.self) {
      Events("onMetricsChange")
    }
  }
}
