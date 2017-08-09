interface PolymerInit {
  is: string;
  extends?: string;
  properties?: PolymerElementProperties<any>;
  observers?: string[];
  template?: HTMLTemplateElement | string;
  hostAttributes?: { [key: string]: any };
  listeners?: { [key: string]: string };
}

/**
  * @summary Polymer is a lightweight library built on top of the web
  *   standards-based Web Components API's, and makes it easy to build your
  *   own custom HTML elements.
  */
interface PolymerStatic {
  /**
    * @param {!PolymerInit} info Prototype for the custom element. It must contain
    *   an `is` property to specify the element name. Other properties populate
    *   the element prototype. The `properties`, `observers`, `hostAttributes`,
    *   and `listeners` properties are processed to create element features.
    * @return {!Object} Returns a custom element class for the given provided
    *   prototype `info` object. The name of the element if given by `info.is`.
    */
  (info: PolymerInit): object;

  version: string;
}

interface Window {
  /**
    *   Polymer is a lightweight library built on top of the web
    *   standards-based Web Components API's, and makes it easy to build your
    *   own custom HTML elements.
    */
  Polymer: PolymerStatic;
}

/**
  *   Polymer is a lightweight library built on top of the web
  *   standards-based Web Components API's, and makes it easy to build your
  *   own custom HTML elements.
  */
declare var Polymer: PolymerStatic;