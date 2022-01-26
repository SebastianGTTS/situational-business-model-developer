import { Whiteboard, WhiteboardEntry, WhiteboardInit } from './whiteboard';

export interface WhiteboardInstanceInit extends WhiteboardInit {}

export interface WhiteboardInstanceEntry extends WhiteboardEntry {}

export class WhiteboardInstance
  extends Whiteboard
  implements WhiteboardInstanceInit
{
  static readonly typeName = 'WhiteboardInstance';

  constructor(
    entry: WhiteboardInstanceEntry | undefined,
    init: WhiteboardInstanceInit | undefined
  ) {
    super(entry, init, WhiteboardInstance.typeName);
  }

  toDb(): WhiteboardInstanceEntry {
    return super.toDb();
  }
}
