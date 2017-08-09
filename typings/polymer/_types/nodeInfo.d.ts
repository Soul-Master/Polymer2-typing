interface NodeInfo {
  id: string;
  events: { name: string; value: string }[];
  hasInsertionPoint: boolean;
  templateInfo: TemplateInfo;
  parentInfo: NodeInfo;
  parentIndex: number;
  infoIndex: number;
  bindings: Binding[];
}