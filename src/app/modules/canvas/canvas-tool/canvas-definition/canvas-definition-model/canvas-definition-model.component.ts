import { Component, QueryList, ViewChildren } from '@angular/core';
import { CanvasDefinition } from '../../../canvas-meta-artifact/canvas-definition';
import { Updatable, UPDATABLE } from '../../../../../shared/updatable';
import { CanvasDefinitionLoaderService } from '../canvas-definition-loader.service';
import { CanvasDefinitionService } from '../../../canvas-meta-artifact/canvas-definition.service';
import {
  CanvasDefinitionCellFormValue,
  CanvasDefinitionRowFormService,
} from '../../form-services/canvas-definition-row-form.service';
import { CanvasDefinitionCell } from '../../../canvas-meta-artifact/canvas-definition-cell';

@Component({
  selector: 'app-canvas-definition-model',
  templateUrl: './canvas-definition-model.component.html',
  styleUrls: ['./canvas-definition-model.component.scss'],
  providers: [
    { provide: UPDATABLE, useExisting: CanvasDefinitionModelComponent },
  ],
})
export class CanvasDefinitionModelComponent implements Updatable {
  @ViewChildren(UPDATABLE) updatable!: QueryList<Updatable>;

  constructor(
    private canvasDefinitionLoaderService: CanvasDefinitionLoaderService,
    private canvasDefinitionRowFormService: CanvasDefinitionRowFormService,
    private canvasDefinitionService: CanvasDefinitionService
  ) {}

  async submitRowForm(value: CanvasDefinitionCellFormValue[][]): Promise<void> {
    if (this.canvasDefinition != null) {
      const rows = this.canvasDefinitionRowFormService.get(value);
      await this.canvasDefinitionService.updateRows(
        this.canvasDefinition._id,
        rows
      );
    }
  }

  toCanvasDefinitionRows(value: {
    rows: CanvasDefinitionCellFormValue[][];
  }): CanvasDefinitionCell[][] {
    if (this.canvasDefinition != null) {
      if (value == null) {
        return this.canvasDefinition.rows;
      }
      return this.canvasDefinitionRowFormService.get(value.rows);
    } else {
      return this.canvasDefinitionRowFormService.get([]);
    }
  }

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

  update(): void {
    for (const updatable of this.updatable) {
      updatable.update();
    }
  }

  get canvasDefinition(): CanvasDefinition | undefined {
    return this.canvasDefinitionLoaderService.canvasDefinition;
  }
}
