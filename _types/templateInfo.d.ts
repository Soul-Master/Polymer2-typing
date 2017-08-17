interface TemplateInfo {
  nodeInfoList: NodeInfo[];
  nodeList: Node[];
  stripWhitespace: boolean;
  hasInsertionPoint?: boolean;
  hostProps: Object;
  propertyEffects: Object;
  nextTemplateInfo?: TemplateInfo;
  previousTemplateInfo?: TemplateInfo;
  childNodes: Node[];
  wasPreBound: boolean;
}