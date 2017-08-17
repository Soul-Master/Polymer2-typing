interface Polymer_Settings {
  useShadow: boolean;
  useNativeCSSProperties: boolean;
  useNativeCustomElements: boolean;
}

interface PolymerStatic {
  /**
   * Globally settable property that is automatically assigned to
   * `Polymer.ElementMixin` instances, useful for binding in templates to
   * make URL's relative to an application's root.  Defaults to the main
   * document URL, but can be overridden by users.  It may be useful to set
   * `Polymer.rootPath` to provide a stable application mount path when
   * using client side routing.
   *
   * @memberof Polymer
   */
  rootPath: string;

  /**
   * Sets the global rootPath property used by `Polymer.ElementMixin` and
   * available via `Polymer.rootPath`.
   *
   * @memberof Polymer
   * @param {string} path The new root path
   */
  setRootPath(path: string): void;

  /**
   * Sets the global, legacy settings.
   *
   * @deprecated
   * @memberof Polymer
   */
  Settings: Polymer_Settings;
}