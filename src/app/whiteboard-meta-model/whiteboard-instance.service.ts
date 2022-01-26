import { Injectable } from '@angular/core';
import { DefaultElementService } from '../database/default-element.service';
import {
  WhiteboardInstance,
  WhiteboardInstanceInit,
} from './whiteboard-instance';
import { PouchdbService } from '../database/pouchdb.service';
import { WhiteboardTemplate } from './whiteboard-template';
import { DbId } from '../database/database-entry';
import { WhiteboardCanvas } from './whiteboard';
import { WhiteboardCanvasService } from './whiteboard-canvas.service';

@Injectable()
export class WhiteboardInstanceService extends DefaultElementService<
  WhiteboardInstance,
  WhiteboardInstanceInit
> {
  protected readonly typeName = WhiteboardInstance.typeName;

  protected readonly elementConstructor = WhiteboardInstance;

  constructor(
    pouchdbService: PouchdbService,
    private whiteboardCanvasService: WhiteboardCanvasService
  ) {
    super(pouchdbService);
  }

  async addByTemplate(
    name: string,
    template: WhiteboardTemplate
  ): Promise<WhiteboardInstance> {
    const instance = new WhiteboardInstance(undefined, {
      name,
      whiteboard: await this.whiteboardCanvasService.setReadOnly(
        template.whiteboard
      ),
    });
    await this.save(instance);
    return instance;
  }

  async saveWhiteboardCanvas(
    id: DbId,
    whiteboardCanvas: WhiteboardCanvas
  ): Promise<void> {
    const template = await this.get(id);
    template.whiteboard = whiteboardCanvas;
    await this.save(template);
  }
}
