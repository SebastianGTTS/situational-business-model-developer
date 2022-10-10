export interface WhiteboardEditComponent {
  whiteboardChanged(): Promise<boolean>;

  saveWhiteboard(): Promise<void>;
}
