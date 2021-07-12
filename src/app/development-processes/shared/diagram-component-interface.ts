export interface DiagramComponentInterface {

  diagramChanged(): Promise<boolean>;

  saveDiagram(): Promise<void>;

}
