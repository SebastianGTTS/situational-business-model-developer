import { Injectable } from '@angular/core';
import { PouchdbService } from '../../database/pouchdb.service';
import { Domain } from '../../development-process-registry/knowledge/domain';
import { CanvasDefinition } from '../../modules/canvas/canvas-meta-artifact/canvas-definition';
import { ExpertModel } from '../../modules/canvas/canvas-meta-artifact/expert-model';

@Injectable()
export class ModelRepositoryDashboardService {
  readonly numberElements: { [name: string]: number } = {};

  constructor(private pouchdbService: PouchdbService) {
    this.load();
  }

  private load(): void {
    void this.loadElement(Domain.typeName);
    void this.loadElement(CanvasDefinition.typeName);
    void this.loadElement(ExpertModel.typeName);
  }

  private async loadElement(name: string): Promise<void> {
    this.numberElements[name] = (
      await this.pouchdbService.find(name, {
        fields: [],
        selector: {},
      })
    ).length;
  }
}
