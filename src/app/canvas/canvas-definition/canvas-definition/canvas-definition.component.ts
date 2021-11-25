import { Component, OnDestroy } from '@angular/core';
import { CanvasDefinition } from '../../../canvas-meta-model/canvas-definition';
import { Subscription } from 'rxjs';
import { CanvasDefinitionService } from '../../../canvas-meta-model/canvas-definition.service';
import {
  CanvasDefinitionCellFormValue,
  CanvasDefinitionRowFormService,
} from '../../form-services/canvas-definition-row-form.service';
import { CanvasDefinitionCell } from '../../../canvas-meta-model/canvas-definition-cell';
import { CanvasDefinitionLoaderService } from '../canvas-definition-loader.service';

@Component({
  selector: 'app-canvas-definition',
  templateUrl: './canvas-definition.component.html',
  styleUrls: ['./canvas-definition.component.css'],
  providers: [CanvasDefinitionLoaderService],
})
export class CanvasDefinitionComponent implements OnDestroy {
  canvas: CanvasDefinitionCell[][] = [];

  private formSubscription: Subscription;

  constructor(
    private canvasDefinitionLoaderService: CanvasDefinitionLoaderService,
    private canvasDefinitionRowFormService: CanvasDefinitionRowFormService,
    private canvasDefinitionService: CanvasDefinitionService
  ) {}

  ngOnDestroy(): void {
    if (this.formSubscription) {
      this.formSubscription.unsubscribe();
    }
  }

  async submitRowForm(value: CanvasDefinitionCellFormValue[][]): Promise<void> {
    const rows = this.canvasDefinitionRowFormService.get(value);
    await this.canvasDefinitionService.updateRows(
      this.canvasDefinition._id,
      rows
    );
  }

  toCanvasDefinitionRows(value: {
    rows: CanvasDefinitionCellFormValue[][];
  }): CanvasDefinitionCell[][] {
    if (value == null) {
      return this.canvasDefinition.rows;
    }
    return this.canvasDefinitionRowFormService.get(value.rows);
  }

  async update(value: Partial<CanvasDefinition>): Promise<void> {
    await this.canvasDefinitionService.update(this.canvasDefinition._id, value);
  }

  get canvasDefinition(): CanvasDefinition {
    return this.canvasDefinitionLoaderService.canvasDefinition;
  }
}
