interface Polymer_PathStatic {
  /**
   * Returns true if the given string is a structured data path (has dots).
   *
   * Example:
   *
   * ```
   * Polymer.Path.isPath('foo.bar.baz') // true
   * Polymer.Path.isPath('foo')         // false
   * ```
   *
   * @memberof Polymer.Path
   * @param {string} path Path string
   * @return {boolean} True if the string contained one or more dots
   */
  isPath(path: string): boolean;

  /**
   * Returns the root property name for the given path.
   *
   * Example:
   *
   * ```
   * Polymer.Path.root('foo.bar.baz') // 'foo'
   * Polymer.Path.root('foo')         // 'foo'
   * ```
   *
   * @memberof Polymer.Path
   * @param {string} path Path string
   * @return {string} Root property name
   */
  root(path: string): string;

  /**
   * Given `base` is `foo.bar`, `foo` is an ancestor, `foo.bar` is not
   * Returns true if the given path is an ancestor of the base path.
   *
   * Example:
   *
   * ```
   * Polymer.Path.isAncestor('foo.bar', 'foo')         // true
   * Polymer.Path.isAncestor('foo.bar', 'foo.bar')     // false
   * Polymer.Path.isAncestor('foo.bar', 'foo.bar.baz') // false
   * ```
   *
   * @memberof Polymer.Path
   * @param {string} base Path string to test against.
   * @param {string} path Path string to test.
   * @return {boolean} True if `path` is an ancestor of `base`.
   */
  isAncestor(base: string, path: string): boolean;

  /**
   * Given `base` is `foo.bar`, `foo.bar.baz` is an descendant
   *
   * Example:
   *
   * ```
   * Polymer.Path.isDescendant('foo.bar', 'foo.bar.baz') // true
   * Polymer.Path.isDescendant('foo.bar', 'foo.bar')     // false
   * Polymer.Path.isDescendant('foo.bar', 'foo')         // false
   * ```
   *
   * @memberof Polymer.Path
   * @param {string} base Path string to test against.
   * @param {string} path Path string to test.
   * @return {boolean} True if `path` is a descendant of `base`.
   */
  isDescendant(base: string, path: string): boolean;

  /**
   * Replaces a previous base path with a new base path, preserving the
   * remainder of the path.
   *
   * User must ensure `path` has a prefix of `base`.
   *
   * Example:
   *
   * ```
   * Polymer.Path.translate('foo.bar', 'zot' 'foo.bar.baz') // 'zot.baz'
   * ```
   *
   * @memberof Polymer.Path
   * @param {string} base Current base string to remove
   * @param {string} newBase New base string to replace with
   * @param {string} path Path to translate
   * @return {string} Translated string
   */
  translate(base: string, newBase: string, path: string): string;

  /**
   * @param {string} base Path string to test against
   * @param {string} path Path string to test
   * @return {boolean} True if `path` is equal to `base`
   * @this {Path}
   */
  matches(base: string, path: string): boolean;

  /**
   * Converts array-based paths to flattened path.  String-based paths
   * are returned as-is.
   *
   * Example:
   *
   * ```
   * Polymer.Path.normalize(['foo.bar', 0, 'baz'])  // 'foo.bar.0.baz'
   * Polymer.Path.normalize('foo.bar.0.baz')        // 'foo.bar.0.baz'
   * ```
   *
   * @memberof Polymer.Path
   * @param {string | !Array<string|number>} path Input path
   * @return {string} Flattened path
   */
  normalize(path: string | Array<string | number>): string;

  /**
   * Splits a path into an array of property names. Accepts either arrays
   * of path parts or strings.
   *
   * Example:
   *
   * ```
   * Polymer.Path.split(['foo.bar', 0, 'baz'])  // ['foo', 'bar', '0', 'baz']
   * Polymer.Path.split('foo.bar.0.baz')        // ['foo', 'bar', '0', 'baz']
   * ```
   *
   * @memberof Polymer.Path
   * @param {string | !Array<string|number>} path Input path
   * @return {!Array<string>} Array of path parts
   * @this {Path}
   * @suppress {checkTypes}
   */
  split(path: string | Array<string | number>): string[];

  /**
   * Reads a value from a path.  If any sub-property in the path is `undefined`,
   * this method returns `undefined` (will never throw.
   *
   * @memberof Polymer.Path
   * @param {Object} root Object from which to dereference path from
   * @param {string | !Array<string|number>} path Path to read
   * @param {Object=} info If an object is provided to `info`, the normalized
   *  (flattened) path will be set to `info.path`.
   * @return {*} Value at path, or `undefined` if the path could not be
   *  fully dereferenced.
   * @this {Path}
   */
  get(root: object, path: string | Array<string | number>, info?: object): any;

  /**
   * Sets a value to a path.  If any sub-property in the path is `undefined`,
   * this method will no-op.
   *
   * @memberof Polymer.Path
   * @param {Object} root Object from which to dereference path from
   * @param {string | !Array<string|number>} path Path to set
   * @param {*} value Value to set to path
   * @return {string | undefined} The normalized version of the input path
   * @this {Path}
   */
  set(root: object, path: string | Array<string | number>, value: any): string;
}

interface PolymerStatic {
  /**
   * Returns true if the given string is a structured data path (has dots).
   *
   * This function is deprecated.  Use `Polymer.Path.isPath` instead.
   *
   * Example:
   *
   * ```
   * Polymer.Path.isDeep('foo.bar.baz') // true
   * Polymer.Path.isDeep('foo')         // false
   * ```
   *
   * @deprecated
   * @memberof Polymer.Path
   * @param {string} path Path string
   * @return {boolean} True if the string contained one or more dots
   */
  isDeep(path: string): boolean;

  /**
   * Module with utilities for manipulating structured data path strings.
   *
   * @namespace
   * @memberof Polymer
   * @summary Module with utilities for manipulating structured data path strings.
   */
  Path: Polymer_PathStatic;
}