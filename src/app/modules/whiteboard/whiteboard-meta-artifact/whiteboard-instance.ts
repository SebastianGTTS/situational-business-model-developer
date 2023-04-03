import { Whiteboard, WhiteboardEntry, WhiteboardInit } from './whiteboard';

export type WhiteboardInstanceInit = WhiteboardInit;

export type WhiteboardInstanceEntry = WhiteboardEntry;

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
