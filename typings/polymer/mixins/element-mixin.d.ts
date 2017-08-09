interface Polymer_ElementMixin extends Polymer_PropertyEffects {
  /**
       * Overrides the default `Polymer.PropertyAccessors` to ensure class
       * metaprogramming related to property accessors and effects has
       * completed (calls `finalize`).
       *
       * It also initializes any property defaults provided via `value` in
       * `properties` metadata.
       *
       * @override
       * @suppress {invalidCasts}
       */
  _initializeProperties(): void;

  /**
   * Provides a default implementation of the standard Custom Elements
   * `connectedCallback`.
   *
   * The default implementation enables the property effects system and
   * flushes any pending properties, and updates shimmed CSS properties
   * when using the ShadyCSS scoping/custom properties polyfill.
   *
   * @suppress {invalidCasts}
   */
  connectedCallback(): void;

  /**
   * Provides a default implementation of the standard Custom Elements
   * `disconnectedCallback`.
   */
  disconnectedCallback(): void;

  /**
   * Implements `PropertyEffects`'s `_readyClients` call. Attaches
   * element dom by calling `_attachDom` with the dom stamped from the
   * element's template via `_stampTemplate`. Note that this allows
   * client dom to be attached to the element prior to any observers
   * running.
   *
   * @override
   */
  _readyClients(): void;

  /**
   * Attaches an element's stamped dom to itself. By default,
   * this method creates a `shadowRoot` and adds the dom to it.
   * However, this method may be overridden to allow an element
   * to put its dom in another location.
   *
   * @throws {Error}
   * @suppress {missingReturn}
   * @param {NodeList} dom to attach to the element.
   * @return {Node} node to which the dom has been attached.
   */
  _attachDom(dom: NodeList): Node;

  /**
   * Provides a default implementation of the standard Custom Elements
   * `attributeChangedCallback`.
   *
   * By default, attributes declared in `properties` metadata are
   * deserialized using their `type` information to properties of the
   * same name.  "Dash-cased" attributes are deserialzed to "camelCase"
   * properties.
   *
   * @param {string} name Name of attribute.
   * @param {?string} old Old value of attribute.
   * @param {?string} value Current value of attribute.
   * @override
   */
  attributeChangedCallback(name: string, old: string | null, value: string | null): void;
}

interface Polymer_ElementMixinStatic extends Polymer_PropertyEffectsMixin {
  <T>(mixinType: T): Polymer_ElementMixin & T;

  /**
   * Standard Custom Elements V1 API.  The default implementation returns
   * a list of dash-cased attributes based on a flattening of all properties
   * declared in `static get properties()` for this element and any
   * superclasses.
   *
   * @return {Array} Observed attribute list
   */
  observedAttributes: any[];

  /**
   * Path matching the url from which the element was imported.
   * This path is used to resolve url's in template style cssText.
   * The `importPath` property is also set on element instances and can be
   * used to create bindings relative to the import path.
   * Defaults to the path matching the url containing a `dom-module` element
   * matching this element's static `is` property.
   * Note, this path should contain a trailing `/`.
   *
   * @return {string} The import path for this element class
   */
  importPath: string;

  /**
   * Returns the template that will be stamped into this element's shadow root.
   *
   * If a `static get is()` getter is defined, the default implementation
   * will return the first `<template>` in a `dom-module` whose `id`
   * matches this element's `is`.
   *
   * Users may override this getter to return an arbitrary template
   * (in which case the `is` getter is unnecessary). The template returned
   * may be either an `HTMLTemplateElement` or a string that will be
   * automatically parsed into a template.
   *
   * Note that when subclassing, if the super class overrode the default
   * implementation and the subclass would like to provide an alternate
   * template via a `dom-module`, it should override this getter and
   * return `Polymer.DomModule.import(this.is, 'template')`.
   *
   * If a subclass would like to modify the super class template, it should
   * clone it rather than modify it in place.  If the getter does expensive
   * work such as cloning/modifying a template, it should memoize the
   * template for maximum performance:
   *
   *   let memoizedTemplate;
   *   class MySubClass extends MySuperClass {
   *     static get template() {
   *       if (!memoizedTemplate) {
   *         memoizedTemplate = super.template.cloneNode(true);
   *         let subContent = document.createElement('div');
   *         subContent.textContent = 'This came from MySubClass';
   *         memoizedTemplate.content.appendChild(subContent);
   *       }
   *       return memoizedTemplate;
   *     }
   *   }
   *
   * @return {HTMLTemplateElement|string} Template to be stamped
   */
  template: HTMLTemplateElement | string;

  /**
   * Called automatically when the first element instance is created to
   * ensure that class finalization work has been completed.
   * May be called by users to eagerly perform class finalization work
   * prior to the creation of the first element instance.
   *
   * Class finalization work generally includes meta-programming such as
   * creating property accessors and any property effect metadata needed for
   * the features used.
   *
   * @public
   */
  finalize(): void;

  /**
   * Overrides `PropertyAccessors` to add map of dynamic functions on
   * template info, for consumption by `PropertyEffects` template binding
   * code. This map determines which method templates should have accessors
   * created for them.
   *
   * @override
   * @suppress {missingProperties} Interfaces in closure do not inherit statics, but classes do
   */
  _parseTemplateContent(template: HTMLTemplateElement, templateInfo: TemplateInfo, nodeInfo: NodeInfo): void;

  /**
   * When using the ShadyCSS scoping and custom property shim, causes all
   * shimmed styles in this element (and its subtree) to be updated
   * based on current custom property values.
   *
   * The optional parameter overrides inline custom property styles with an
   * object of properties where the keys are CSS properties, and the values
   * are strings.
   *
   * Example: `this.updateStyles({'--color': 'blue'})`
   *
   * These properties are retained unless a value of `null` is set.
   *
   * @param {Object=} properties Bag of custom property key/values to
   *   apply to this element.
   * @suppress {invalidCasts}
   */
  updateStyles(properties?: Object): void;

  /**
   * Rewrites a given URL relative to a base URL. The base URL defaults to
   * the original location of the document containing the `dom-module` for
   * this element. This method will return the same URL before and after
   * bundling.
   *
   * @param {string} url URL to resolve.
   * @param {string=} base Optional base URL to resolve against, defaults
   * to the element's `importPath`
   * @return {string} Rewritten URL relative to base
   */
  resolveUrl(url: string, base?: string): string;


}

interface PolymerTelemetry {
  /**
   * Total number of Polymer element instances created.
   * @type {number}
   */
  instanceCount: number;

  /**
   * Array of Polymer element classes that have been finalized.
   * @type {Array<Polymer.Element>}
   */
  registrations: Polymer_Element[];

  /**
   * @param {!PolymerElementConstructor} prototype Element prototype to log
   * @this {this}
   * @private
   */
  _regLog<T extends Polymer_Element>(prototype: Constructor<T>): void;

  /**
   * Registers a class prototype for telemetry purposes.
   * @param {HTMLElement} prototype Element prototype to register
   * @this {this}
   * @protected
   */
  register<T extends Polymer_Element>(prototype: Constructor<T>): void;

  /**
   * Logs all elements registered with an `is` to the console.
   * @public
   * @this {this}
   */
  dumpRegistrations(): void;
}

interface PolymerStatic {
  /**
   * Element class mixin that provides the core API for Polymer's meta-programming
   * features including template stamping, data-binding, attribute deserialization,
   * and property change observation.
   *
   * Subclassers may provide the following static getters to return metadata
   * used to configure Polymer's features for the class:
   *
   * - `static get is()`: When the template is provided via a `dom-module`,
   *   users should return the `dom-module` id from a static `is` getter.  If
   *   no template is needed or the template is provided directly via the
   *   `template` getter, there is no need to define `is` for the element.
   *
   * - `static get template()`: Users may provide the template directly (as
   *   opposed to via `dom-module`) by implementing a static `template` getter.
   *   The getter may return an `HTMLTemplateElement` or a string, which will
   *   automatically be parsed into a template.
   *
   * - `static get properties()`: Should return an object describing
   *   property-related metadata used by Polymer features (key: property name
   *   value: object containing property metadata). Valid keys in per-property
   *   metadata include:
   *   - `type` (String|Number|Object|Array|...): Used by
   *     `attributeChangedCallback` to determine how string-based attributes
   *     are deserialized to JavaScript property values.
   *   - `notify` (boolean): Causes a change in the property to fire a
   *     non-bubbling event called `<property>-changed`. Elements that have
   *     enabled two-way binding to the property use this event to observe changes.
   *   - `readOnly` (boolean): Creates a getter for the property, but no setter.
   *     To set a read-only property, use the private setter method
   *     `_setProperty(property, value)`.
   *   - `observer` (string): Observer method name that will be called when
   *     the property changes. The arguments of the method are
   *     `(value, previousValue)`.
   *   - `computed` (string): String describing method and dependent properties
   *     for computing the value of this property (e.g. `'computeFoo(bar, zot)'`).
   *     Computed properties are read-only by default and can only be changed
   *     via the return value of the computing method.
   *
   * - `static get observers()`: Array of strings describing multi-property
   *   observer methods and their dependent properties (e.g.
   *   `'observeABC(a, b, c)'`).
   *
   * The base class provides default implementations for the following standard
   * custom element lifecycle callbacks; users may override these, but should
   * call the super method to ensure
   * - `constructor`: Run when the element is created or upgraded
   * - `connectedCallback`: Run each time the element is connected to the
   *   document
   * - `disconnectedCallback`: Run each time the element is disconnected from
   *   the document
   * - `attributeChangedCallback`: Run each time an attribute in
   *   `observedAttributes` is set or removed (note: this element's default
   *   `observedAttributes` implementation will automatically return an array
   *   of dash-cased attributes based on `properties`)
   *
   * @mixinFunction
   * @polymer
   * @appliesMixin Polymer.PropertyEffects
   * @memberof Polymer
   * @property rootPath {string} Set to the value of `Polymer.rootPath`,
   *   which defaults to the main document path
   * @property importPath {string} Set to the value of the class's static
   *   `importPath` property, which defaults to the path of this element's
   *   `dom-module` (when `is` is used), but can be overridden for other
   *   import strategies.
   * @summary Element class mixin that provides the core API for Polymer's
   * meta-programming features.
   */
  ElementMixin: Polymer_ElementMixinStatic;

/**
 * Provides basic tracking of element definitions (registrations) and
 * instance counts.
 *
 * @namespace
 * @summary Provides basic tracking of element definitions (registrations) and
 * instance counts.
 */
  telemetry: PolymerTelemetry;

  /**
   * When using the ShadyCSS scoping and custom property shim, causes all
   * shimmed `styles` (via `custom-style`) in the document (and its subtree)
   * to be updated based on current custom property values.
   *
   * The optional parameter overrides inline custom property styles with an
   * object of properties where the keys are CSS properties, and the values
   * are strings.
   *
   * Example: `Polymer.updateStyles({'--color': 'blue'})`
   *
   * These properties are retained unless a value of `null` is set.
   *
   * @param {Object=} props Bag of custom property key/values to
   *   apply to the document.
   */
  updateStyles(props?: Object): void;
}