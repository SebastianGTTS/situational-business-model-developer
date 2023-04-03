import { Injectable } from '@angular/core';
import { DefaultElementService } from '../../../database/default-element.service';
import {
  WhiteboardTemplate,
  WhiteboardTemplateInit,
} from './whiteboard-template';
import { PouchdbService } from '../../../database/pouchdb.service';
import { WhiteboardCanvasService } from './whiteboard-canvas.service';
import { DbId } from '../../../database/database-entry';
import { WhiteboardCanvas } from './whiteboard';
import { IconInit } from '../../../model/icon';
import { AuthorInit } from '../../../model/author';

@Injectable()
export class WhiteboardTemplateService extends DefaultElementService<
  WhiteboardTemplate,
  WhiteboardTemplateInit
> {
  protected readonly typeName = WhiteboardTemplate.typeName;

  protected readonly elementConstructor = WhiteboardTemplate;

  constructor(
    pouchdbService: PouchdbService,
    private whiteboardCanvasService: WhiteboardCanvasService
  ) {
    super(pouchdbService);
  }

  getWhiteboardTemplateInitialization(name: string): WhiteboardTemplateInit {
    return {
      name,
      whiteboard: this.whiteboardCanvasService.getEmptyWhiteboardCanvas(),
    };
  }

  async saveWhiteboardCanvas(
    id: DbId,
    whiteboardCanvas: WhiteboardCanvas
  ): Promise<void> {
    try {
      const template = await this.getWrite(id);
      template.whiteboard = whiteboardCanvas;
      await this.save(template);
    } finally {
      this.freeWrite(id);
    }
  }

  async updateInformation(
    id: string,
    name: string,
    description: string
  ): Promise<void> {
    try {
      const template = await this.getWrite(id);
      template.name = name;
      template.description = description;
      await this.save(template);
    } finally {
      this.freeWrite(id);
    }
  }

  /**
   * Update the icon of a whiteboard template
   *
   * @param id
   * @param icon
   */
  async updateIcon(id: string, icon: IconInit): Promise<void> {
    try {
      const template = await this.getWrite(id);
      template.updateIcon(icon);
      await this.save(template);
    } finally {
      this.freeWrite(id);
    }
  }

  async updateAuthor(id: string, author: AuthorInit): Promise<void> {
    try {
      const template = await this.getWrite(id);
      template.updateAuthor(author);
      await this.save(template);
    } finally {
      this.freeWrite(id);
    }
  }
}
