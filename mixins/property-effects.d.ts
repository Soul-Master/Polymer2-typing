interface BindingPart {

}

interface Polymer_PropertyEffects extends Polymer_PropertyAccessors, Polymer_TemplateStamp {
  PROPERTY_EFFECT_TYPES: Array<keyof Polymer_PropertyEffectType>;

  _initializeProperties(): void;

  /**
   * Overrides `Polymer.PropertyAccessors` implementation to provide a
   * more efficient implementation of initializing properties from
   * the prototype on the instance.
   *
   * @override
   * @param {Object} props Properties to initialize on the prototype
   */
  _initializeProtoProperties(props: Object): void;

  /**
   * Overrides `Polymer.PropertyAccessors` implementation to avoid setting
   * `_setProperty`'s `shouldNotify: true`.
   *
   * @override
   * @param {Object} props Properties to initialize on the instance
   */
  _initializeInstanceProperties(props: Object): void;

  /**
   * Equivalent to static `addPropertyEffect` API but can be called on
   * an instance to add effects at runtime.  See that method for
   * full API docs.
   *
   * @param {string} property Property that should trigger the effect
   * @param {string} type Effect type, from this.PROPERTY_EFFECT_TYPES
   * @param {Object=} effect Effect metadata object
   * @protected
   */
  _addPropertyEffect(property: string, type: string, effect?: Object): void;

  /**
   * Removes the given property effect.
   *
   * @param {string} property Property the effect was associated with
   * @param {string} type Effect type, from this.PROPERTY_EFFECT_TYPES
   * @param {Object=} effect Effect metadata object to remove
   */
  _removePropertyEffect(property: string, type: string, effect?: Object): void;

  /**
   * Returns whether the current prototype/instance has a property effect
   * of a certain type.
   *
   * @param {string} property Property name
   * @param {string=} type Effect type, from this.PROPERTY_EFFECT_TYPES
   * @return {boolean} True if the prototype/instance has an effect of this type
   * @protected
   */
  _hasPropertyEffect(property: string, type?: string): boolean;

  /**
   * Returns whether the current prototype/instance has a "read only"
   * accessor for the given property.
   *
   * @param {string} property Property name
   * @return {boolean} True if the prototype/instance has an effect of this type
   * @protected
   */
  _hasReadOnlyEffect(property: string): boolean;

  /**
   * Returns whether the current prototype/instance has a "notify"
   * property effect for the given property.
   *
   * @param {string} property Property name
   * @return {boolean} True if the prototype/instance has an effect of this type
   * @protected
   */
  _hasNotifyEffect(property: string): boolean;

  /**
   * Returns whether the current prototype/instance has a "reflect to attribute"
   * property effect for the given property.
   *
   * @param {string} property Property name
   * @return {boolean} True if the prototype/instance has an effect of this type
   * @protected
   */
  _hasReflectEffect(property: string): boolean;

  /**
   * Returns whether the current prototype/instance has a "computed"
   * property effect for the given property.
   *
   * @param {string} property Property name
   * @return {boolean} True if the prototype/instance has an effect of this type
   * @protected
   */
  _hasComputedEffect(property: string): boolean;

  /**
   * Sets a pending property or path.  If the root property of the path in
   * question had no accessor, the path is set, otherwise it is enqueued
   * via `_setPendingProperty`.
   *
   * This function isolates relatively expensive functionality necessary
   * for the public API (`set`, `setProperties`, `notifyPath`, and property
   * change listeners via {{...}} bindings), such that it is only done
   * when paths enter the system, and not at every propagation step.  It
   * also sets a `__dataHasPaths` flag on the instance which is used to
   * fast-path slower path-matching code in the property effects host paths.
   *
   * `path` can be a path string or array of path parts as accepted by the
   * public API.
   *
   * @param {string | !Array<number|string>} path Path to set
   * @param {*} value Value to set
   * @param {boolean=} shouldNotify Set to true if this change should
   *  cause a property notification event dispatch
   * @param {boolean=} isPathNotification If the path being set is a path
   *   notification of an already changed value, as opposed to a request
   *   to set and notify the change.  In the latter `false` case, a dirty
   *   check is performed and then the value is set to the path before
   *   enqueuing the pending property change.
   * @return {boolean} Returns true if the property/path was enqueued in
   *   the pending changes bag.
   * @protected
   */
  _setPendingPropertyOrPath(path: string | number | string[], value: any, shouldNotify?: boolean, isPathNotification?: boolean): boolean;

  /**
   * Applies a value to a non-Polymer element/node's property.
   *
   * The implementation makes a best-effort at binding interop:
   * Some native element properties have side-effects when
   * re-setting the same value (e.g. setting `<input>.value` resets the
   * cursor position), so we do a dirty-check before setting the value.
   * However, for better interop with non-Polymer custom elements that
   * accept objects, we explicitly re-set object changes coming from the
   * Polymer world (which may include deep object changes without the
   * top reference changing), erring on the side of providing more
   * information.
   *
   * Users may override this method to provide alternate approaches.
   *
   * @param {Node} node The node to set a property on
   * @param {string} prop The property to set
   * @param {*} value The value to set
   * @protected
   */
  _setUnmanagedPropertyToNode(node: Node, prop: string, value: any): void;

  /**
   * Overrides the `PropertyAccessors` implementation to introduce special
   * dirty check logic depending on the property & value being set:
   *
   * 1. Any value set to a path (e.g. 'obj.prop': 42 or 'obj.prop': {...})
   *    Stored in `__dataTemp`, dirty checked against `__dataTemp`
   * 2. Object set to simple property (e.g. 'prop': {...})
   *    Stored in `__dataTemp` and `__data`, dirty checked against
   *    `__dataTemp` by default implementation of `_shouldPropertyChange`
   * 3. Primitive value set to simple property (e.g. 'prop': 42)
   *    Stored in `__data`, dirty checked against `__data`
   *
   * The dirty-check is important to prevent cycles due to two-way
   * notification, but paths and objects are only dirty checked against any
   * previous value set during this turn via a "temporary cache" that is
   * cleared when the last `_propertiesChaged` exits. This is so:
   * a. any cached array paths (e.g. 'array.3.prop') may be invalidated
   *    due to array mutations like shift/unshift/splice; this is fine
   *    since path changes are dirty-checked at user entry points like `set`
   * b. dirty-checking for objects only lasts one turn to allow the user
   *    to mutate the object in-place and re-set it with the same identity
   *    and have all sub-properties re-propagated in a subsequent turn.
   *
   * The temp cache is not necessarily sufficient to prevent invalid array
   * paths, since a splice can happen during the same turn (with pathological
   * user code); we could introduce a "fixup" for temporarily cached array
   * paths if needed: https://github.com/Polymer/polymer/issues/4227
   *
   * @param {string} property Name of the property
   * @param {*} value Value to set
   * @param {boolean=} shouldNotify True if property should fire notification
   *   event (applies only for `notify: true` properties)
   * @return {boolean} Returns true if the property changed
   * @override
   */
  _setPendingProperty(property: string, value: any, shouldNotify?: boolean): boolean;

  /**
   * Overrides base implementation to ensure all accessors set `shouldNotify`
   * to true, for per-property notification tracking.
   *
   * @override
   */
  setProperties(props: Object, setReadOnly?: boolean): void;

  /**
   * Overrides `PropertyAccessor`'s default async queuing of
   * `_propertiesChanged`: if `__dataReady` is false (has not yet been
   * manually flushed), the function no-ops; otherwise flushes
   * `_propertiesChanged` synchronously.
   *
   * @override
   */
  _invalidateProperties(): void;

  /**
   * Enqueues the given client on a list of pending clients, whose
   * pending property changes can later be flushed via a call to
   * `_flushClients`.
   *
   * @param {Object} client PropertyEffects client to enqueue
   * @protected
   */
  _enqueueClient(client: Object): void;

  /**
   * Flushes any clients previously enqueued via `_enqueueClient`, causing
   * their `_flushProperties` method to run.
   *
   * @protected
   */
  _flushClients(): void;

  /**
   * Perform any initial setup on client dom. Called before the first
   * `_flushProperties` call on client dom and before any element
   * observers are called.
   *
   * @protected
   */
  _readyClients(): void;

  /**
   * Sets a bag of property changes to this instance, and
   * synchronously processes all effects of the properties as a batch.
   *
   * Property names must be simple properties, not paths.  Batched
   * path propagation is not supported.
   *
   * @param {Object} props Bag of one or more key-value pairs whose key is
   *   a property and value is the new value to set for that property.
   * @param {boolean=} setReadOnly When true, any private values set in
   *   `props` will be set. By default, `setProperties` will not set
   *   `readOnly: true` root properties.
   * @public
   */
  setProperties(props: Object, setReadOnly?: boolean): void;

  /**
   * Overrides `PropertyAccessors` so that property accessor
   * side effects are not enabled until after client dom is fully ready.
   * Also calls `_flushClients` callback to ensure client dom is enabled
   * that was not enabled as a result of flushing properties.
   *
   * @override
   */
  ready(): void;

  /**
   * Implements `PropertyAccessors`'s properties changed callback.
   *
   * Runs each class of effects for the batch of changed properties in
   * a specific order (compute, propagate, reflect, observe, notify).
   *
   * @override
   */
  _propertiesChanged(currentProps: any /* jsdoc error */, changedProps: any /* jsdoc error */, oldProps: any /* jsdoc error */): void;

  /**
   * Called to propagate any property changes to stamped template nodes
   * managed by this element.
   *
   * @param {Object} changedProps Bag of changed properties
   * @param {Object} oldProps Bag of previous values for changed properties
   * @param {boolean} hasPaths True with `props` contains one or more paths
   * @protected
   */
  _propagatePropertyChanges(changedProps: Object, oldProps: Object, hasPaths: boolean): void;

  /**
   * Aliases one data path as another, such that path notifications from one
   * are routed to the other.
   *
   * @param {string | !Array<string|number>} to Target path to link.
   * @param {string | !Array<string|number>} from Source path to link.
   * @public
   */
  linkPaths(to: string | string | number[], from: string | string | number[]): void;

  /**
   * Removes a data path alias previously established with `_linkPaths`.
   *
   * Note, the path to unlink should be the target (`to`) used when
   * linking the paths.
   *
   * @param {string | !Array<string|number>} path Target path to unlink.
   * @public
   */
  unlinkPaths(path: string | string | number[]): void;

  /**
   * Notify that an array has changed.
   *
   * Example:
   *
   *     this.items = [ {name: 'Jim'}, {name: 'Todd'}, {name: 'Bill'} ];
   *     ...
   *     this.items.splice(1, 1, {name: 'Sam'});
   *     this.items.push({name: 'Bob'});
   *     this.notifySplices('items', [
   *       { index: 1, removed: [{name: 'Todd'}], addedCount: 1, obect: this.items, type: 'splice' },
   *       { index: 3, removed: [], addedCount: 1, object: this.items, type: 'splice'}
   *     ]);
   *
   * @param {string} path Path that should be notified.
   * @param {Array} splices Array of splice records indicating ordered
   *   changes that occurred to the array. Each record should have the
   *   following fields:
   *    * index: index at which the change occurred
   *    * removed: array of items that were removed from this index
   *    * addedCount: number of new items added at this index
   *    * object: a reference to the array in question
   *    * type: the string literal 'splice'
   *
   *   Note that splice records _must_ be normalized such that they are
   *   reported in index order (raw results from `Object.observe` are not
   *   ordered and must be normalized/merged before notifying).
   * @public
  */
  notifySplices(path: string, splices: any[]): void;

  /**
   * Convenience method for reading a value from a path.
   *
   * Note, if any part in the path is undefined, this method returns
   * `undefined` (this method does not throw when dereferencing undefined
   * paths).
   *
   * @param {(string|!Array<(string|number)>)} path Path to the value
   *   to read.  The path may be specified as a string (e.g. `foo.bar.baz`)
   *   or an array of path parts (e.g. `['foo.bar', 'baz']`).  Note that
   *   bracketed expressions are not supported; string-based path parts
   *   *must* be separated by dots.  Note that when dereferencing array
   *   indices, the index may be used as a dotted part directly
   *   (e.g. `users.12.name` or `['users', 12, 'name']`).
   * @param {Object=} root Root object from which the path is evaluated.
   * @return {*} Value at the path, or `undefined` if any part of the path
   *   is undefined.
   * @public
   */
  get(path: string | string | number[], root?: Object): any;

  /**
   * Convenience method for setting a value to a path and notifying any
   * elements bound to the same path.
   *
   * Note, if any part in the path except for the last is undefined,
   * this method does nothing (this method does not throw when
   * dereferencing undefined paths).
   *
   * @param {(string|!Array<(string|number)>)} path Path to the value
   *   to write.  The path may be specified as a string (e.g. `'foo.bar.baz'`)
   *   or an array of path parts (e.g. `['foo.bar', 'baz']`).  Note that
   *   bracketed expressions are not supported; string-based path parts
   *   *must* be separated by dots.  Note that when dereferencing array
   *   indices, the index may be used as a dotted part directly
   *   (e.g. `'users.12.name'` or `['users', 12, 'name']`).
   * @param {*} value Value to set at the specified path.
   * @param {Object=} root Root object from which the path is evaluated.
   *   When specified, no notification will occur.
   * @public
  */
  set(path: string | string | number[], value: any, root?: Object): void;

  /**
   * Adds items onto the end of the array at the path specified.
   *
   * The arguments after `path` and return value match that of
   * `Array.prototype.push`.
   *
   * This method notifies other paths to the same array that a
   * splice occurred to the array.
   *
   * @param {string} path Path to array.
   * @param {...*} items Items to push onto array
   * @return {number} New length of the array.
   * @public
   */
  push(path: string, ...items: any[]): number;

  /**
   * Removes an item from the end of array at the path specified.
   *
   * The arguments after `path` and return value match that of
   * `Array.prototype.pop`.
   *
   * This method notifies other paths to the same array that a
   * splice occurred to the array.
   *
   * @param {string} path Path to array.
   * @return {*} Item that was removed.
   * @public
   */
  pop(path: string): any;

  /**
   * Starting from the start index specified, removes 0 or more items
   * from the array and inserts 0 or more new items in their place.
   *
   * The arguments after `path` and return value match that of
   * `Array.prototype.splice`.
   *
   * This method notifies other paths to the same array that a
   * splice occurred to the array.
   *
   * @param {string} path Path to array.
   * @param {number} start Index from which to start removing/inserting.
   * @param {number} deleteCount Number of items to remove.
   * @param {...*} items Items to insert into array.
   * @return {Array} Array of removed items.
   * @public
   */
  splice(path: string, start: number, deleteCount: number, ...items: any[]): any[];

  /**
   * Removes an item from the beginning of array at the path specified.
   *
   * The arguments after `path` and return value match that of
   * `Array.prototype.pop`.
   *
   * This method notifies other paths to the same array that a
   * splice occurred to the array.
   *
   * @param {string} path Path to array.
   * @return {*} Item that was removed.
   * @public
   */
  shift(path: string): any;

  /**
   * Adds items onto the beginning of the array at the path specified.
   *
   * The arguments after `path` and return value match that of
   * `Array.prototype.push`.
   *
   * This method notifies other paths to the same array that a
   * splice occurred to the array.
   *
   * @param {string} path Path to array.
   * @param {...*} items Items to insert info array
   * @return {number} New length of the array.
   * @public
   */
  unshift(path: string, ...items: any[]): number;

  /**
   * Notify that a path has changed.
   *
   * Example:
   *
   *     this.item.user.name = 'Bob';
   *     this.notifyPath('item.user.name');
   *
   * @param {string} path Path that should be notified.
   * @param {*=} value Value at the path (optional).
   * @public
  */
  notifyPath(path: string, value?: any): void;

  /**
   * Equivalent to static `createReadOnlyProperty` API but can be called on
   * an instance to add effects at runtime.  See that method for
   * full API docs.
   *
   * @param {string} property Property name
   * @param {boolean=} protectedSetter Creates a custom protected setter
   *   when `true`.
   * @protected
   */
  _createReadOnlyProperty(property: string, protectedSetter?: boolean): void;

  /**
   * Equivalent to static `createPropertyObserver` API but can be called on
   * an instance to add effects at runtime.  See that method for
   * full API docs.
   *
   * @param {string} property Property name
   * @param {string} methodName Name of observer method to call
   * @param {boolean=} dynamicFn Whether the method name should be included as
   *   a dependency to the effect.
   * @protected
   */
  _createPropertyObserver(property: string, methodName: string, dynamicFn?: boolean): void;

  /**
   * Equivalent to static `createMethodObserver` API but can be called on
   * an instance to add effects at runtime.  See that method for
   * full API docs.
   *
   * @param {string} expression Method expression
   * @param {boolean|Object=} dynamicFn Boolean or object map indicating
   *   whether method names should be included as a dependency to the effect.
   * @protected
   */
  _createMethodObserver(expression: string, dynamicFn?: boolean | Object): void;

  /**
   * Equivalent to static `createNotifyingProperty` API but can be called on
   * an instance to add effects at runtime.  See that method for
   * full API docs.
   *
   * @param {string} property Property name
   * @protected
   */
  _createNotifyingProperty(property: string): void;

  /**
   * Equivalent to static `createReflectedProperty` API but can be called on
   * an instance to add effects at runtime.  See that method for
   * full API docs.
   *
   * @param {string} property Property name
   * @protected
   */
  _createReflectedProperty(property: string): void;

  /**
   * Equivalent to static `createComputedProperty` API but can be called on
   * an instance to add effects at runtime.  See that method for
   * full API docs.
   *
   * @param {string} property Name of computed property to set
   * @param {string} expression Method expression
   * @param {boolean|Object=} dynamicFn Boolean or object map indicating
   *   whether method names should be included as a dependency to the effect.
   * @protected
   */
  _createComputedProperty(property: string, expression: string, dynamicFn?: boolean | Object): void;

  /**
   * Equivalent to static `bindTemplate` API but can be called on
   * an instance to add effects at runtime.  See that method for
   * full API docs.
   *
   * This method may be called on the prototype (for prototypical template
   * binding, to avoid creating accessors every instance) once per prototype,
   * and will be called with `runtimeBinding: true` by `_stampTemplate` to
   * create and link an instance of the template metadata associated with a
   * particular stamping.
   *
   * @param {HTMLTemplateElement} template Template containing binding
   *   bindings
   * @param {boolean=} instanceBinding When false (default), performs
   *   "prototypical" binding of the template and overwrites any previously
   *   bound template for the class. When true (as passed from
   *   `_stampTemplate`), the template info is instanced and linked into
   *   the list of bound templates.
   * @return {!TemplateInfo} Template metadata object; for `runtimeBinding`,
   *   this is an instance of the prototypical template info
   * @protected
   */
  _bindTemplate(template: HTMLTemplateElement, instanceBinding?: boolean): TemplateInfo;

  /**
   * Stamps the provided template and performs instance-time setup for
   * Polymer template features, including data bindings, declarative event
   * listeners, and the `this.$` map of `id`'s to nodes.  A document fragment
   * is returned containing the stamped DOM, ready for insertion into the
   * DOM.
   *
   * This method may be called more than once; however note that due to
   * `shadycss` polyfill limitations, only styles from templates prepared
   * using `ShadyCSS.prepareTemplate` will be correctly polyfilled (scoped
   * to the shadow root and support CSS custom properties), and note that
   * `ShadyCSS.prepareTemplate` may only be called once per element. As such,
   * any styles required by in runtime-stamped templates must be included
   * in the main element template.
   *
   * @param {!HTMLTemplateElement} template Template to stamp
   * @return {!StampedTemplate} Cloned template content
   * @override
   * @protected
   */
  _stampTemplate(template: HTMLTemplateElement): StampedTemplate;

  /**
   * Removes and unbinds the nodes previously contained in the provided
   * DocumentFragment returned from `_stampTemplate`.
   *
   * @param {!StampedTemplate} dom DocumentFragment previously returned
   *   from `_stampTemplate` associated with the nodes to be removed
   * @protected
   */
  _removeBoundDom(dom: StampedTemplate): void;
}

interface Polymer_PropertyEffectsMixin extends Polymer_PropertyAccessorsMixin, Polymer_TemplateStampMixin {
  <T>(mixinType: T): Polymer_PropertyEffects & T;

  /**
   * Ensures an accessor exists for the specified property, and adds
   * to a list of "property effects" that will run when the accessor for
   * the specified property is set.  Effects are grouped by "type", which
   * roughly corresponds to a phase in effect processing.  The effect
   * metadata should be in the following form:
   *
   *   {
   *     fn: effectFunction, // Reference to function to call to perform effect
   *     info: { ... }       // Effect metadata passed to function
   *     trigger: {          // Optional triggering metadata; if not provided
   *       name: string      // the property is treated as a wildcard
   *       structured: boolean
   *       wildcard: boolean
   *     }
   *   }
   *
   * Effects are called from `_propertiesChanged` in the following order by
   * type:
   *
   * 1. COMPUTE
   * 2. PROPAGATE
   * 3. REFLECT
   * 4. OBSERVE
   * 5. NOTIFY
   *
   * Effect functions are called with the following signature:
   *
   *   effectFunction(inst, path, props, oldProps, info, hasPaths)
   *
   * @param {string} property Property that should trigger the effect
   * @param {string} type Effect type, from this.PROPERTY_EFFECT_TYPES
   * @param {Object=} effect Effect metadata object
   * @protected
   */
  _addPropertyEffect(property: string, type: string, effect?: Object): void;

  /**
   * Creates a single-property observer for the given property.
   *
   * @param {string} property Property name
   * @param {string} methodName Name of observer method to call
   * @param {boolean=} dynamicFn Whether the method name should be included as
   *   a dependency to the effect.
   * @protected
   */
  createPropertyObserver(property: string, methodName: string, dynamicFn?: boolean): void;

  /**
   * Creates a multi-property "method observer" based on the provided
   * expression, which should be a string in the form of a normal Javascript
   * function signature: `'methodName(arg1, [..., argn])'`.  Each argument
   * should correspond to a property or path in the context of this
   * prototype (or instance), or may be a literal string or number.
   *
   * @param {string} expression Method expression
   * @param {boolean|Object=} dynamicFn Boolean or object map indicating
   *   whether method names should be included as a dependency to the effect.
   * @protected
   */
  createMethodObserver(expression: string, dynamicFn?: boolean | Object): void;

  /**
   * Causes the setter for the given property to dispatch `<property>-changed`
   * events to notify of changes to the property.
   *
   * @param {string} property Property name
   * @protected
   */
  createNotifyingProperty(property: string): void;

  /**
   * Creates a read-only accessor for the given property.
   *
   * To set the property, use the protected `_setProperty` API.
   * To create a custom protected setter (e.g. `_setMyProp()` for
   * property `myProp`), pass `true` for `protectedSetter`.
   *
   * Note, if the property will have other property effects, this method
   * should be called first, before adding other effects.
   *
   * @param {string} property Property name
   * @param {boolean=} protectedSetter Creates a custom protected setter
   *   when `true`.
   * @protected
   */
  createReadOnlyProperty(property: string, protectedSetter?: boolean): void;

  /**
   * Causes the setter for the given property to reflect the property value
   * to a (dash-cased) attribute of the same name.
   *
   * @param {string} property Property name
   * @protected
   */
  createReflectedProperty(property: string): void;

  /**
   * Creates a computed property whose value is set to the result of the
   * method described by the given `expression` each time one or more
   * arguments to the method changes.  The expression should be a string
   * in the form of a normal Javascript function signature:
   * `'methodName(arg1, [..., argn])'`
   *
   * @param {string} property Name of computed property to set
   * @param {string} expression Method expression
   * @param {boolean|Object=} dynamicFn Boolean or object map indicating whether
   *   method names should be included as a dependency to the effect.
   * @protected
   */
  createComputedProperty(property: string, expression: string, dynamicFn?: boolean | Object): void;

  /**
   * Parses the provided template to ensure binding effects are created
   * for them, and then ensures property accessors are created for any
   * dependent properties in the template.  Binding effects for bound
   * templates are stored in a linked list on the instance so that
   * templates can be efficiently stamped and unstamped.
   *
   * @param {HTMLTemplateElement} template Template containing binding
   *   bindings
   * @return {Object} Template metadata object
   * @protected
   */
  bindTemplate(template: HTMLTemplateElement): Object;

  /**
   * Adds a property effect to the given template metadata, which is run
   * at the "propagate" stage of `_propertiesChanged` when the template
   * has been bound to the element via `_bindTemplate`.
   *
   * The `effect` object should match the format in `_addPropertyEffect`.
   *
   * @param {Object} templateInfo Template metadata to add effect to
   * @param {string} prop Property that should trigger the effect
   * @param {Object=} effect Effect metadata object
   * @protected
   */
  _addTemplatePropertyEffect(templateInfo: Object, prop: string, effect?: Object): void;

  /**
   * Overrides default `TemplateStamp` implementation to add support for
   * parsing bindings from `TextNode`'s' `textContent`.  A `bindings`
   * array is added to `nodeInfo` and populated with binding metadata
   * with information capturing the binding target, and a `parts` array
   * with one or more metadata objects capturing the source(s) of the
   * binding.
   *
   * @override
   * @param {Node} node Node to parse
   * @param {TemplateInfo} templateInfo Template metadata for current template
   * @param {NodeInfo} nodeInfo Node metadata for current template node
   * @return {boolean} `true` if the visited node added node-specific
   *   metadata to `nodeInfo`
   * @protected
   * @suppress {missingProperties} Interfaces in closure do not inherit statics, but classes do
   */
  _parseTemplateNode(node: Node, templateInfo: TemplateInfo, nodeInfo: NodeInfo): boolean;

  /**
   * Overrides default `TemplateStamp` implementation to add support for
   * parsing bindings from attributes.  A `bindings`
   * array is added to `nodeInfo` and populated with binding metadata
   * with information capturing the binding target, and a `parts` array
   * with one or more metadata objects capturing the source(s) of the
   * binding.
   *
   * @override
   * @param {Element} node Node to parse
   * @param {TemplateInfo} templateInfo Template metadata for current template
   * @param {NodeInfo} nodeInfo Node metadata for current template node
   * @return {boolean} `true` if the visited node added node-specific
   *   metadata to `nodeInfo`
   * @protected
   * @suppress {missingProperties} Interfaces in closure do not inherit statics, but classes do
   */
  _parseTemplateNodeAttribute(node: Element, templateInfo: TemplateInfo, nodeInfo: NodeInfo, name: any, value: any): boolean;

  /**
   * Overrides default `TemplateStamp` implementation to add support for
   * binding the properties that a nested template depends on to the template
   * as `_host_<property>`.
   *
   * @override
   * @param {Node} node Node to parse
   * @param {TemplateInfo} templateInfo Template metadata for current template
   * @param {NodeInfo} nodeInfo Node metadata for current template node
   * @return {boolean} `true` if the visited node added node-specific
   *   metadata to `nodeInfo`
   * @protected
   * @suppress {missingProperties} Interfaces in closure do not inherit statics, but classes do
   */
  _parseTemplateNestedTemplate(node: Node, templateInfo: TemplateInfo, nodeInfo: NodeInfo): boolean;

  /**
   * Called to parse text in a template (either attribute values or
   * textContent) into binding metadata.
   *
   * Any overrides of this method should return an array of binding part
   * metadata  representing one or more bindings found in the provided text
   * and any "literal" text in between.  Any non-literal parts will be passed
   * to `_evaluateBinding` when any dependencies change.  The only required
   * fields of each "part" in the returned array are as follows:
   *
   * - `dependencies` - Array containing trigger metadata for each property
   *   that should trigger the binding to update
   * - `literal` - String containing text if the part represents a literal;
   *   in this case no `dependencies` are needed
   *
   * Additional metadata for use by `_evaluateBinding` may be provided in
   * each part object as needed.
   *
   * The default implementation handles the following types of bindings
   * (one or more may be intermixed with literal strings):
   * - Property binding: `[[prop]]`
   * - Path binding: `[[object.prop]]`
   * - Negated property or path bindings: `[[!prop]]` or `[[!object.prop]]`
   * - Two-way property or path bindings (supports negation):
   *   `{{prop}}`, `{{object.prop}}`, `{{!prop}}` or `{{!object.prop}}`
   * - Inline computed method (supports negation):
   *   `[[compute(a, 'literal', b)]]`, `[[!compute(a, 'literal', b)]]`
   *
   * @param {string} text Text to parse from attribute or textContent
   * @param {Object} templateInfo Current template metadata
   * @return {Array<!BindingPart>} Array of binding part metadata
   * @protected
   */
  _parseBindings(text: string, templateInfo: Object): BindingPart[];

  /**
   * Called to evaluate a previously parsed binding part based on a set of
   * one or more changed dependencies.
   *
   * @param {this} inst Element that should be used as scope for
   *   binding dependencies
   * @param {BindingPart} part Binding part metadata
   * @param {string} path Property/path that triggered this effect
   * @param {Object} props Bag of current property changes
   * @param {Object} oldProps Bag of previous values for changed properties
   * @param {boolean} hasPaths True with `props` contains one or more paths
   * @return {*} Value the binding part evaluated to
   * @protected
   */
  _evaluateBinding(inst: this, part: BindingPart, path: string, props: Object, oldProps: Object, hasPaths: boolean): any;
}

declare enum Polymer_PropertyEffectType {
  COMPUTE = '__computeEffects',
  REFLECT = '__reflectEffects',
  NOTIFY = '__notifyEffects',
  PROPAGATE = '__propagateEffects',
  OBSERVE = '__observeEffects',
  READ_ONLY = '__readOnly'
}

interface PolymerStatic {
  /**
  * Element class mixin that provides meta-programming for Polymer's template
  * binding and data observation (collectively, "property effects") system.
  *
  * This mixin uses provides the following key static methods for adding
  * property effects to an element class:
  * - `addPropertyEffect`
  * - `createPropertyObserver`
  * - `createMethodObserver`
  * - `createNotifyingProperty`
  * - `createReadOnlyProperty`
  * - `createReflectedProperty`
  * - `createComputedProperty`
  * - `bindTemplate`
  *
  * Each method creates one or more property accessors, along with metadata
  * used by this mixin's implementation of `_propertiesChanged` to perform
  * the property effects.
  *
  * Underscored versions of the above methods also exist on the element
  * prototype for adding property effects on instances at runtime.
  *
  * Note that this mixin overrides several `PropertyAccessors` methods, in
  * many cases to maintain guarantees provided by the Polymer 1.x features;
  * notably it changes property accessors to be synchronous by default
  * whereas the default when using `PropertyAccessors` standalone is to be
  * async by default.
  *
  * @mixinFunction
  * @polymer
  * @appliesMixin Polymer.TemplateStamp
  * @appliesMixin Polymer.PropertyAccessors
  * @memberof Polymer
  * @summary Element class mixin that provides meta-programming for Polymer's
  * template binding and data observation system.
  */
  PropertyEffects: Polymer_PropertyEffectsMixin;
}