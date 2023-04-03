import { Component, Input } from '@angular/core';
import { CanvasDefinitionCell } from '../../../canvas-meta-artifact/canvas-definition-cell';

@Component({
  selector: 'app-canvas-definition-model-overview',
  templateUrl: './canvas-definition-model-overview.component.html',
  styleUrls: ['./canvas-definition-model-overview.component.css'],
})
export class CanvasDefinitionModelOverviewComponent {
  @Input() canvasDefinitionCells!: CanvasDefinitionCell[][];
}
