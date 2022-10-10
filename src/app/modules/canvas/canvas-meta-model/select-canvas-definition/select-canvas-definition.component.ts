import { Component, OnInit } from '@angular/core';
import { ConfigurationFormComponent } from '../../../../development-process-registry/module-api/configuration-form-component';
import { FormControl, FormGroup } from '@angular/forms';
import { CanvasDefinitionService } from '../canvas-definition.service';
import { CanvasDefinitionEntry } from '../canvas-definition';

@Component({
  selector: 'app-select-canvas-definition',
  templateUrl: './select-canvas-definition.component.html',
  styleUrls: ['./select-canvas-definition.component.css'],
})
export class SelectCanvasDefinitionComponent
  implements OnInit, ConfigurationFormComponent
{
  formGroup!: FormGroup;

  canvasDefinitions?: CanvasDefinitionEntry[];

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
