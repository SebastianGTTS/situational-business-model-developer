import { Whiteboard, WhiteboardEntry, WhiteboardInit } from './whiteboard';
import { Author, AuthorEntry, AuthorInit } from '../../../model/author';
import { Icon, IconEntry, IconInit } from '../../../model/icon';

export interface WhiteboardTemplateInit extends WhiteboardInit {
  author?: AuthorInit;
  description?: string;
  icon?: IconInit;
}

export interface WhiteboardTemplateEntry extends WhiteboardEntry {
  author: AuthorEntry;
  description: string;
  icon: IconEntry;
}

export class WhiteboardTemplate
  extends Whiteboard
  implements WhiteboardTemplateInit
{
  static readonly typeName = 'WhiteboardTemplate';
  static readonly defaultIcon: IconInit = { icon: 'bi-easel2' };

  author: Author;
  description = '';
  icon: Icon;

  constructor(
    entry: WhiteboardTemplateEntry | undefined,
    init: WhiteboardTemplateInit | undefined
  ) {
    super(entry, init, WhiteboardTemplate.typeName);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const element = entry ?? init!;
    this.description = element.description ?? this.description;
    if (entry != null) {
      this.icon = new Icon(entry.icon ?? {}, undefined);
      this.author = new Author(entry.author, undefined);
    } else {
      this.icon = new Icon(
        undefined,
        init?.icon ?? WhiteboardTemplate.defaultIcon
      );
      this.author = new Author(undefined, init?.author ?? {});
    }
  }

  /**
   * Update the icon of this whiteboard template
   *
   * @param icon
   */
  updateIcon(icon: IconInit): void {
    this.icon.update(icon);
  }

  updateAuthor(author: AuthorInit): void {
    this.author.update(author);
  }

  toDb(): WhiteboardTemplateEntry {
    return {
      ...super.toDb(),
      description: this.description,
      icon: this.icon.toDb(),
      author: this.author.toDb(),
    };
  }
}
