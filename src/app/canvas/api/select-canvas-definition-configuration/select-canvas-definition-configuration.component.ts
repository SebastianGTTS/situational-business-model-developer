import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ConfigurationFormComponent } from '../../../development-process-registry/module-api/configuration-form-component';
import { CanvasDefinitionEntry } from '../../../canvas-meta-model/canvas-definition';
import { CanvasDefinitionService } from '../../../canvas-meta-model/canvas-definition.service';

@Component({
  selector: 'app-select-canvas-definition-configuration',
  templateUrl: './select-canvas-definition-configuration.component.html',
  styleUrls: ['./select-canvas-definition-configuration.component.css'],
})
export class SelectCanvasDefinitionConfigurationComponent
  implements OnInit, ConfigurationFormComponent
{
  formGroup: FormGroup;

  canvasDefinitions: CanvasDefinitionEntry[] = null;

  constructor(private canvasDefinitionService: CanvasDefinitionService) {}

  ngOnInit(): void {
    void this.loadCanvasDefinitions();
  }

  async loadCanvasDefinitions(): Promise<void> {
    this.canvasDefinitions = await this.canvasDefinitionService.getList();
  }

  get definitionControl(): FormControl {
    return this.formGroup.get('definitionId') as FormControl;
  }
}
