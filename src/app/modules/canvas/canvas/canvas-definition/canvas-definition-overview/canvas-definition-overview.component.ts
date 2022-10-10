import { Component, Input } from '@angular/core';
import { CanvasDefinitionCell } from '../../../canvas-meta-model/canvas-definition-cell';

@Component({
  selector: 'app-canvas-definition-overview',
  templateUrl: './canvas-definition-overview.component.html',
  styleUrls: ['./canvas-definition-overview.component.css'],
})
export class CanvasDefinitionOverviewComponent {
  @Input() canvasDefinitionCells!: CanvasDefinitionCell[][];
}
