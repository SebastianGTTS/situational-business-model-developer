import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ConfigurationFormComponent } from '../../../development-process-registry/module-api/configuration-form-component';
import { CanvasDefinition } from '../../../canvas-meta-model/canvas-definition';
import { CanvasDefinitionService } from '../../../canvas-meta-model/canvas-definition.service';

@Component({
  selector: 'app-select-canvas-definition-configuration',
  templateUrl: './select-canvas-definition-configuration.component.html',
  styleUrls: ['./select-canvas-definition-configuration.component.css']
})
export class SelectCanvasDefinitionConfigurationComponent implements OnInit, ConfigurationFormComponent {

  formGroup: FormGroup;

  canvasDefinitions: CanvasDefinition[] = null;

  constructor(
    private canvasDefinitionService: CanvasDefinitionService,
  ) {
  }

  ngOnInit() {
    this.loadCanvasDefinitions().then();
  }

  async loadCanvasDefinitions() {
    this.canvasDefinitions = (await this.canvasDefinitionService.getList()).docs;
  }

  get definitionControl() {
    return this.formGroup.get('definitionId');
  }

}
