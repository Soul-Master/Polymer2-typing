/**
  * @summary Custom element base class that provides the core API for Polymer's
  *   key meta-programming features including template stamping, data-binding,
  *   attribute deserialization, and property change observation
  */
interface Polymer_Element extends HTMLElement, Polymer_ElementMixin {
  new(): Polymer_Element;
}

interface PolymerStatic {
  /**
   * Base class that provides the core API for Polymer's meta-programming
   * features including template stamping, data-binding, attribute deserialization,
   * and property change observation.
   *
   * @customElement
   * @polymer
   * @memberof Polymer
   * @constructor
   * @implements {Polymer_ElementMixin}
   * @extends HTMLElement
   * @appliesMixin Polymer.ElementMixin
   * @summary Custom element base class that provides the core API for Polymer's
   *   key meta-programming features including template stamping, data-binding,
   *   attribute deserialization, and property change observation
   */
  Element: Polymer_Element;
}