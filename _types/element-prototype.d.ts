// Custom element class
interface PolymerElementPrototype<T> {
  new(): T;

  is?: string;
  extends?: string;
  properties?: PolymerElementProperties<T>;
  observers?: string[];
  template?: HTMLTemplateElement | string;
}