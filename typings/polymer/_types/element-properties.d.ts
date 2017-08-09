type PolymerElementProperties<T> = {
  [P in keyof T]: PolymerElementPropertiesMeta<T[P]>;
}