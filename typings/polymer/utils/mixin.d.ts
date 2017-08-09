type Constructor<T> = new (...args: any[]) => T;

interface Polymer_Mixin<T, TBase> {
  (baseClass: TBase): Constructor<T & TBase>;
}

interface PolymerStatic {
  /**
   * Wraps an ES6 class expression mixin such that the mixin is only applied
   * if it has not already been applied its base argument.  Also memoizes mixin
   * applications.
   *
   * @memberof Polymer
   * @template T
   * @param {T} mixin ES6 class expression mixin to wrap
   * @suppress {invalidCasts}
   */
  dedupingMixin<T, TBase>(mixin: Constructor<T>): Polymer_Mixin<T, TBase>; 
}