interface Polymer_StyleGatherStatic {
  /**
   * Returns CSS text of styles in a space-separated list of `dom-module`s.
   *
   * @memberof Polymer.StyleGather
   * @param {string} moduleIds List of dom-module id's within which to
   * search for css.
   * @return {string} Concatenated CSS content from specified `dom-module`s
   * @this {StyleGather}
   */
  cssFromModules(moduleIds: string): string;

  /**
   * Returns CSS text of styles in a given `dom-module`.  CSS in a `dom-module`
   * can come either from `<style>`s within the first `<template>`, or else
   * from one or more `<link rel="import" type="css">` links outside the
   * template.
   *
   * Any `<styles>` processed are removed from their original location.
   *
   * @memberof Polymer.StyleGather
   * @param {string} moduleId dom-module id to gather styles from
   * @return {string} Concatenated CSS content from specified `dom-module`
   * @this {StyleGather}
   */
  cssFromModule(moduleId: string): string;

  /**
   * Returns CSS text of `<styles>` within a given template.
   *
   * Any `<styles>` processed are removed from their original location.
   *
   * @memberof Polymer.StyleGather
   * @param {HTMLTemplateElement} template Template to gather styles from
   * @param {string} baseURI Base URI to resolve the URL against
   * @return {string} Concatenated CSS content from specified template
   * @this {StyleGather}
   */
  cssFromTemplate(template: HTMLTemplateElement, baseURI: string): string;

  /**
   * Returns CSS text from stylsheets loaded via `<link rel="import" type="css">`
   * links within the specified `dom-module`.
   *
   * @memberof Polymer.StyleGather
   * @param {string} moduleId Id of `dom-module` to gather CSS from
   * @return {string} Concatenated CSS content from links in specified `dom-module`
   * @this {StyleGather}
   */
  cssFromModuleImports(moduleId: string): string;
}

interface PolymerStatic {
  /**
   * Module with utilities for collection CSS text from `<templates>`, external
   * stylesheets, and `dom-module`s.
   *
   * @namespace
   * @memberof Polymer
   * @summary Module with utilities for collection CSS text from various sources.
   */
  StyleGather: Polymer_StyleGatherStatic;
}