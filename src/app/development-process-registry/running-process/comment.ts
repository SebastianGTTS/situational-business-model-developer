import { PouchdbModelPart } from '../../database/pouchdb-model-part';
import { v4 as uuidv4 } from 'uuid';

export class Comment implements PouchdbModelPart {

  id: string;
  time: number;
  userName: string;
  title: string;
  comment: string;

  constructor(comment: Partial<Comment>) {
    Object.assign(this, comment);
    if (this.id == null) {
      this.id = uuidv4();
    }
    if (this.time == null) {
      this.time = Date.now();
    }
  }

  update(comment: Partial<Comment>) {
    Object.assign(this, comment);
  }

  toPouchDb(): any {
    return {
      id: this.id,
      time: this.time,
      userName: this.userName,
      title: this.title,
      comment: this.comment,
    };
  }

}
