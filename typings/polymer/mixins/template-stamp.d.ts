interface StampedTemplate extends DocumentFragment {
  __noInsertionPoint: boolean;
  nodeList: Node[];
  $: { [key: string]: Node };
  templateInfo?: TemplateInfo;
}

interface Polymer_TemplateStamp {
  /**
 * Clones the provided template content and returns a document fragment
 * containing the cloned dom.
 *
 * The template is parsed (once and memoized) using this library's
 * template parsing features, and provides the following value-added
 * features:
 * * Adds declarative event listeners for `on-event="handler"` attributes
 * * Generates an "id map" for all nodes with id's under `$` on returned
 *   document fragment
 * * Passes template info including `content` back to templates as
 *   `_templateInfo` (a performance optimization to avoid deep template
 *   cloning)
 *
 * Note that the memoized template parsing process is destructive to the
 * template: attributes for bindings and declarative event listeners are
 * removed after being noted in notes, and any nested `<template>.content`
 * is removed and stored in notes as well.
 *
 * @param {!HTMLTemplateElement} template Template to stamp
 * @return {!StampedTemplate} Cloned template content
 */
  _stampTemplate(template: HTMLTemplateElement): StampedTemplate;

  /**
   * Adds an event listener by method name for the event provided.
   *
   * This method generates a handler function that looks up the method
   * name at handling time.
   *
   * @param {Node} node Node to add listener on
   * @param {string} eventName Name of event
   * @param {string} methodName Name of method
   * @param {*=} context Context the method will be called on (defaults
   *   to `node`)
   * @return {Function} Generated handler function
   */
  _addMethodEventListenerToNode(node: Node, eventName: string, methodName: string, context?: any): Function;

  /**
   * Override point for adding custom or simulated event handling.
   *
   * @param {Node} node Node to add event listener to
   * @param {string} eventName Name of event
   * @param {Function} handler Listener function to add
   */
  _addEventListenerToNode(node: Node, eventName: string, handler: Function): void;

  /**
   * Override point for adding custom or simulated event handling.
   *
   * @param {Node} node Node to remove event listener from
   * @param {string} eventName Name of event
   * @param {Function} handler Listener function to remove
   */
  _removeEventListenerFromNode(node: Node, eventName: string, handler: Function): void;
}

interface Polymer_TemplateStampMixin {
  <T>(mixinType: T): Polymer_TemplateStamp & T;

  /**
   * Scans a template to produce template metadata.
   *
   * Template-specific metadata are stored in the object returned, and node-
   * specific metadata are stored in objects in its flattened `nodeInfoList`
   * array.  Only nodes in the template that were parsed as nodes of
   * interest contain an object in `nodeInfoList`.  Each `nodeInfo` object
   * contains an `index` (`childNodes` index in parent) and optionally
   * `parent`, which points to node info of its parent (including its index).
   *
   * The template metadata object returned from this method has the following
   * structure (many fields optional):
   *
   * ```js
   *   {
   *     // Flattened list of node metadata (for nodes that generated metadata)
   *     nodeInfoList: [
   *       {
   *         // `id` attribute for any nodes with id's for generating `$` map
   *         id: {string},
   *         // `on-event="handler"` metadata
   *         events: [
   *           {
   *             name: {string},   // event name
   *             value: {string},  // handler method name
   *           }, ...
   *         ],
   *         // Notes when the template contained a `<slot>` for shady DOM
   *         // optimization purposes
   *         hasInsertionPoint: {boolean},
   *         // For nested `<template>`` nodes, nested template metadata
   *         templateInfo: {object}, // nested template metadata
   *         // Metadata to allow efficient retrieval of instanced node
   *         // corresponding to this metadata
   *         parentInfo: {number},   // reference to parent nodeInfo>
   *         parentIndex: {number},  // index in parent's `childNodes` collection
   *         infoIndex: {number},    // index of this `nodeInfo` in `templateInfo.nodeInfoList`
   *       },
   *       ...
   *     ],
   *     // When true, the template had the `strip-whitespace` attribute
   *     // or was nested in a template with that setting
   *     stripWhitespace: {boolean},
   *     // For nested templates, nested template content is moved into
   *     // a document fragment stored here; this is an optimization to
   *     // avoid the cost of nested template cloning
   *     content: {DocumentFragment}
   *   }
   * ```
   *
   * This method kicks off a recursive treewalk as follows:
   *
   * ```
   *    _parseTemplate <---------------------+
   *      _parseTemplateContent              |
   *        _parseTemplateNode  <------------|--+
   *          _parseTemplateNestedTemplate --+  |
   *          _parseTemplateChildNodes ---------+
   *          _parseTemplateNodeAttributes
   *            _parseTemplateNodeAttribute
   *
   * ```
   *
   * These methods may be overridden to add custom metadata about templates
   * to either `templateInfo` or `nodeInfo`.
   *
   * Note that this method may be destructive to the template, in that
   * e.g. event annotations may be removed after being noted in the
   * template metadata.
   *
   * @param {!HTMLTemplateElement} template Template to parse
   * @param {TemplateInfo=} outerTemplateInfo Template metadata from the outer
   *   template, for parsing nested templates
   * @return {!TemplateInfo} Parsed template metadata
   */
  _parseTemplate(template: HTMLTemplateElement, outerTemplateInfo?: TemplateInfo): TemplateInfo;

  _parseTemplateContent(template: HTMLTemplateElement, templateInfo: TemplateInfo, nodeInfo: NodeInfo): void;

  /**
   * Parses template node and adds template and node metadata based on
   * the current node, and its `childNodes` and `attributes`.
   *
   * This method may be overridden to add custom node or template specific
   * metadata based on this node.
   *
   * @param {Node} node Node to parse
   * @param {!TemplateInfo} templateInfo Template metadata for current template
   * @param {!NodeInfo} nodeInfo Node metadata for current template.
   * @return {boolean} `true` if the visited node added node-specific
   *   metadata to `nodeInfo`
   */
  _parseTemplateNode(node: Node, templateInfo: TemplateInfo, nodeInfo: NodeInfo): boolean;

  /**
   * Parses template child nodes for the given root node.
   *
   * This method also wraps whitelisted legacy template extensions
   * (`is="dom-if"` and `is="dom-repeat"`) with their equivalent element
   * wrappers, collapses text nodes, and strips whitespace from the template
   * if the `templateInfo.stripWhitespace` setting was provided.
   *
   * @param {Node} root Root node whose `childNodes` will be parsed
   * @param {!TemplateInfo} templateInfo Template metadata for current template
   * @param {!NodeInfo} nodeInfo Node metadata for current template.
   */
  _parseTemplateChildNodes(root: Node, templateInfo: TemplateInfo, nodeInfo: NodeInfo): void;

  /**
   * Parses template content for the given nested `<template>`.
   *
   * Nested template info is stored as `templateInfo` in the current node's
   * `nodeInfo`. `template.content` is removed and stored in `templateInfo`.
   * It will then be the responsibility of the host to set it back to the
   * template and for users stamping nested templates to use the
   * `_contentForTemplate` method to retrieve the content for this template
   * (an optimization to avoid the cost of cloning nested template content).
   *
   * @param {HTMLTemplateElement} node Node to parse (a <template>)
   * @param {TemplateInfo} outerTemplateInfo Template metadata for current template
   *   that includes the template `node`
   * @param {!NodeInfo} nodeInfo Node metadata for current template.
   * @return {boolean} `true` if the visited node added node-specific
   *   metadata to `nodeInfo`
   */
  _parseTemplateNestedTemplate(node: HTMLTemplateElement, outerTemplateInfo: TemplateInfo, nodeInfo: NodeInfo): boolean;

  /**
   * Parses template node attributes and adds node metadata to `nodeInfo`
   * for nodes of interest.
   *
   * @param {Element} node Node to parse
   * @param {TemplateInfo} templateInfo Template metadata for current template
   * @param {NodeInfo} nodeInfo Node metadata for current template.
   * @return {boolean} `true` if the visited node added node-specific
   *   metadata to `nodeInfo`
   */
  _parseTemplateNodeAttributes(node: Element, templateInfo: TemplateInfo, nodeInfo: NodeInfo): boolean;

  /**
   * Parses a single template node attribute and adds node metadata to
   * `nodeInfo` for attributes of interest.
   *
   * This implementation adds metadata for `on-event="handler"` attributes
   * and `id` attributes.
   *
   * @param {Element} node Node to parse
   * @param {!TemplateInfo} templateInfo Template metadata for current template
   * @param {!NodeInfo} nodeInfo Node metadata for current template.
   * @param {string} name Attribute name
   * @param {string} value Attribute value
   * @return {boolean} `true` if the visited node added node-specific
   *   metadata to `nodeInfo`
   */
  _parseTemplateNodeAttributes(node: Element, templateInfo: TemplateInfo, nodeInfo: NodeInfo): boolean;

  /**
   * Returns the `content` document fragment for a given template.
   *
   * For nested templates, Polymer performs an optimization to cache nested
   * template content to avoid the cost of cloning deeply nested templates.
   * This method retrieves the cached content for a given template.
   *
   * @param {HTMLTemplateElement} template Template to retrieve `content` for
   * @return {DocumentFragment} Content fragment
   */
  _contentForTemplate(template: HTMLTemplateElement): DocumentFragment;
}

interface PolymerStatic {
  /**
   * Element mixin that provides basic template parsing and stamping, including
   * the following template-related features for stamped templates:
   *
   * - Declarative event listeners (`on-eventname="listener"`)
   * - Map of node id's to stamped node instances (`this.$.id`)
   * - Nested template content caching/removal and re-installation (performance
   *   optimization)
   *
   * @mixinFunction
   * @polymer
   * @memberof Polymer
   * @summary Element class mixin that provides basic template parsing and stamping
   */
  TemplateStamp: Polymer_TemplateStampMixin;
}