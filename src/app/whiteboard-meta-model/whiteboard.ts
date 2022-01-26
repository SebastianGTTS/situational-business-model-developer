import { DatabaseModel } from '../database/database-model';
import {
  DatabaseRootEntry,
  DatabaseRootInit,
  DbType,
} from '../database/database-entry';

export type WhiteboardCanvas = string;

export interface WhiteboardInit extends DatabaseRootInit {
  name: string;
  whiteboard: WhiteboardCanvas;
}

export interface WhiteboardEntry extends DatabaseRootEntry {
  name: string;
  whiteboard: WhiteboardCanvas;
}

export class Whiteboard extends DatabaseModel implements WhiteboardInit {
  name: string;
  whiteboard: WhiteboardCanvas;

  constructor(
    entry: WhiteboardEntry | undefined,
    init: WhiteboardInit | undefined,
    type: DbType
  ) {
    super(entry, init, type);
    const element = entry ?? init!;
    this.name = element.name;
    this.whiteboard = element.whiteboard;
  }

  toDb(): WhiteboardEntry {
    return {
      ...super.toDb(),
      name: this.name,
      whiteboard: this.whiteboard,
    };
  }
}
