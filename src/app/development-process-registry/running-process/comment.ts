import { DatabaseModelPart } from '../../database/database-model-part';
import { v4 as uuidv4 } from 'uuid';
import { DatabaseEntry, DatabaseInit } from '../../database/database-entry';

export interface CommentInit extends DatabaseInit {
  id?: string;
  time?: number;
  userName: string;
  title: string;
  comment: string;
}

export interface CommentEntry extends DatabaseEntry {
  id: string;
  time: number;
  userName: string;
  title: string;
  comment: string;
}

export class Comment implements CommentInit, DatabaseModelPart {
  id: string;
  time: number;
  userName: string;
  title: string;
  comment: string;

  constructor(entry: CommentEntry | undefined, init: CommentInit | undefined) {
    const element = entry ?? init;
    this.id = element.id ?? uuidv4();
    this.time = element.time ?? Date.now();
    this.userName = element.userName;
    this.title = element.title;
    this.comment = element.comment;
  }

  update(comment: Partial<Comment>): void {
    Object.assign(this, comment);
  }

  toDb(): CommentEntry {
    return {
      id: this.id,
      time: this.time,
      userName: this.userName,
      title: this.title,
      comment: this.comment,
    };
  }
}
