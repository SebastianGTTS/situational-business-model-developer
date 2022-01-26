import { Component, OnInit } from '@angular/core';
import { BmProcess } from '../../../development-process-registry/bm-process/bm-process';
import { FormControl, FormGroup } from '@angular/forms';
import { DbId } from '../../../database/database-entry';
import { WhiteboardTemplateService } from '../../../whiteboard-meta-model/whiteboard-template.service';
import { WhiteboardTemplateEntry } from '../../../whiteboard-meta-model/whiteboard-template';
import { ConfigurationFormComponent } from '../../../development-process-registry/module-api/configuration-form-component';

export interface CreateWhiteboardPredefinedInput {
  templateId: DbId | undefined;
}

@Component({
  selector: 'app-select-whiteboard-template-configuration',
  templateUrl: './select-whiteboard-template-configuration.component.html',
  styleUrls: ['./select-whiteboard-template-configuration.component.css'],
})
export class SelectWhiteboardTemplateConfigurationComponent
  implements OnInit, ConfigurationFormComponent
{
  bmProcess!: BmProcess;
  formGroup!: FormGroup;

  whiteboardTemplates?: WhiteboardTemplateEntry[];

  constructor(private whiteboardTemplateService: WhiteboardTemplateService) {}

  ngOnInit(): void {
    void this.loadWhiteboardTemplates();
  }

  async loadWhiteboardTemplates(): Promise<void> {
    this.whiteboardTemplates = await this.whiteboardTemplateService.getList();
  }

  get templateIdControl(): FormControl {
    return this.formGroup.get('templateId') as FormControl;
  }
}
