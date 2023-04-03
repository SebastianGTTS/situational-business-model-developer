import { Component } from '@angular/core';
import { CanvasDefinition } from '../../../canvas-meta-artifact/canvas-definition';
import { CanvasDefinitionLoaderService } from '../canvas-definition-loader.service';

@Component({
  selector: 'app-canvas-definition',
  templateUrl: './canvas-definition.component.html',
  styleUrls: ['./canvas-definition.component.css'],
  providers: [CanvasDefinitionLoaderService],
})
export class CanvasDefinitionComponent {
  constructor(
    private canvasDefinitionLoaderService: CanvasDefinitionLoaderService
  ) {}

  get canvasDefinition(): CanvasDefinition | undefined {
    return this.canvasDefinitionLoaderService.canvasDefinition;
  }
}
