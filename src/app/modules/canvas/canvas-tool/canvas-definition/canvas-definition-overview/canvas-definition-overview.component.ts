import { Component } from '@angular/core';
import { CanvasDefinition } from '../../../canvas-meta-artifact/canvas-definition';
import { CanvasDefinitionLoaderService } from '../canvas-definition-loader.service';

@Component({
  selector: 'app-canvas-definition-overview',
  templateUrl: './canvas-definition-overview.component.html',
  styleUrls: ['./canvas-definition-overview.component.scss'],
})
export class CanvasDefinitionOverviewComponent {
  constructor(
    private canvasDefinitionLoaderService: CanvasDefinitionLoaderService
  ) {}

  get canvasDefinition(): CanvasDefinition | undefined {
    return this.canvasDefinitionLoaderService.canvasDefinition;
  }
}
