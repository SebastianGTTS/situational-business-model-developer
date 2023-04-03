import { Component, QueryList, ViewChildren } from '@angular/core';
import { Updatable, UPDATABLE } from '../../../../../shared/updatable';
import { IconInit } from '../../../../../model/icon';
import { CanvasDefinitionLoaderService } from '../canvas-definition-loader.service';
import { CanvasDefinitionService } from '../../../canvas-meta-artifact/canvas-definition.service';
import { CanvasDefinition } from '../../../canvas-meta-artifact/canvas-definition';

@Component({
  selector: 'app-canvas-definition-general',
  templateUrl: './canvas-definition-general.component.html',
  styleUrls: ['./canvas-definition-general.component.scss'],
  providers: [
    { provide: UPDATABLE, useExisting: CanvasDefinitionGeneralComponent },
  ],
})
export class CanvasDefinitionGeneralComponent implements Updatable {
  @ViewChildren(UPDATABLE) updatable!: QueryList<Updatable>;

  constructor(
    private canvasDefinitionLoaderService: CanvasDefinitionLoaderService,
    private canvasDefinitionService: CanvasDefinitionService
  ) {}

  async updateCanvasDefinition(
    value: Partial<CanvasDefinition>
  ): Promise<void> {
    if (this.canvasDefinition != null) {
      await this.canvasDefinitionService.update(
        this.canvasDefinition._id,
        value
      );
    }
  }

  async updateIcon(icon: IconInit): Promise<void> {
    if (this.canvasDefinition != null) {
      await this.canvasDefinitionService.updateIcon(
        this.canvasDefinition._id,
        icon
      );
    }
  }

  update(): void {
    for (const updatable of this.updatable) {
      updatable.update();
    }
  }

  get canvasDefinition(): CanvasDefinition | undefined {
    return this.canvasDefinitionLoaderService.canvasDefinition;
  }
}
