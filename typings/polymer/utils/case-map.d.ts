interface Polymer_CaseMapStatic {
  /**
   * Converts "dash-case" identifier (e.g. `foo-bar-baz`) to "camelCase"
   * (e.g. `fooBarBaz`).
   *
   * @memberof Polymer.CaseMap
   * @param {string} dash Dash-case identifier
   * @return {string} Camel-case representation of the identifier
   */
  dashToCamelCase(dash: string): string;

  /**
   * Converts "camelCase" identifier (e.g. `fooBarBaz`) to "dash-case"
   * (e.g. `foo-bar-baz`).
   *
   * @memberof Polymer.CaseMap
   * @param {string} camel Camel-case identifier
   * @return {string} Dash-case representation of the identifier
   */
  camelToDashCase(camel: string): string;
}

interface PolymerStatic {
  /**
   * Module with utilities for converting between "dash-case" and "camelCase"
   * identifiers.
   *
   * @namespace
   * @memberof Polymer
   * @summary Module that provides utilities for converting between "dash-case"
   *   and "camelCase".
   */
  CaseMap: Polymer_CaseMapStatic;
}