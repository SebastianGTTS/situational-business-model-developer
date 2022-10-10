import { Whiteboard, WhiteboardEntry, WhiteboardInit } from './whiteboard';
import { Author, AuthorEntry, AuthorInit } from '../../../model/author';

export interface WhiteboardTemplateInit extends WhiteboardInit {
  author?: AuthorInit;
  description?: string;
}

export interface WhiteboardTemplateEntry extends WhiteboardEntry {
  author: AuthorEntry;
  description: string;
}

export class WhiteboardTemplate
  extends Whiteboard
  implements WhiteboardTemplateInit
{
  static readonly typeName = 'WhiteboardTemplate';

  author: Author;
  description = '';

  constructor(
    entry: WhiteboardTemplateEntry | undefined,
    init: WhiteboardTemplateInit | undefined
  ) {
    super(entry, init, WhiteboardTemplate.typeName);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const element = entry ?? init!;
    this.description = element.description ?? this.description;
    if (entry != null) {
      this.author = new Author(entry.author, undefined);
    } else {
      this.author = new Author(undefined, init?.author ?? {});
    }
  }

  toDb(): WhiteboardTemplateEntry {
    return {
      ...super.toDb(),
      description: this.description,
      author: this.author.toDb(),
    };
  }
}
