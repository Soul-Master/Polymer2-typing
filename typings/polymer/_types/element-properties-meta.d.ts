interface Func<T> {
  (): T;
}

interface PolymerElementPropertiesMeta<T> {
  value: T | Func<T>;
  type?: Function;
  readOnly?: boolean;
  computed?: string;
  reflectToAttribute?: boolean;
  notify?: boolean;
  observer?: string;
}