export interface WhiteboardEditComponent {
  deactivate: boolean;

  whiteboardChanged(): Promise<boolean>;

  saveWhiteboard(): Promise<void>;
}
