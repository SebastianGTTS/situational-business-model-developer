import { Component, OnInit } from '@angular/core';
import { BmPatternProcess } from '../../../../../development-process-registry/bm-process/bm-pattern-process';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { DbId } from '../../../../../database/database-entry';
import { WhiteboardTemplateService } from '../../../whiteboard-meta-artifact/whiteboard-template.service';
import { WhiteboardTemplateEntry } from '../../../whiteboard-meta-artifact/whiteboard-template';
import { ConfigurationFormComponent } from '../../../../../development-process-registry/module-api/configuration-form-component';
import { PredefinedInput } from '../../../../../development-process-registry/module-api/module-method';

export interface CreateWhiteboardPredefinedInput extends PredefinedInput {
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
  bmProcess!: BmPatternProcess;
  formGroup!: UntypedFormGroup;

  whiteboardTemplates?: WhiteboardTemplateEntry[];

  constructor(private whiteboardTemplateService: WhiteboardTemplateService) {}

  ngOnInit(): void {
    void this.loadWhiteboardTemplates();
  }

  async loadWhiteboardTemplates(): Promise<void> {
    this.whiteboardTemplates = await this.whiteboardTemplateService.getList();
  }

  get templateIdControl(): UntypedFormControl {
    return this.formGroup.get('templateId') as UntypedFormControl;
  }
}
