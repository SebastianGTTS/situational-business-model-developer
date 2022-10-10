import { Injectable } from '@angular/core';
import { WhiteboardMetaModelModule } from './whiteboard-meta-model.module';
import { DefaultElementService } from '../../../database/default-element.service';
import {
  WhiteboardTemplate,
  WhiteboardTemplateInit,
} from './whiteboard-template';
import { PouchdbService } from '../../../database/pouchdb.service';
import { WhiteboardCanvasService } from './whiteboard-canvas.service';
import { DbId } from '../../../database/database-entry';
import { WhiteboardCanvas } from './whiteboard';

@Injectable({
  providedIn: WhiteboardMetaModelModule,
})
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
    const template = await this.get(id);
    template.whiteboard = whiteboardCanvas;
    await this.save(template);
  }
}
