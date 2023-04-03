import { Component, OnInit } from '@angular/core';
import { ConfigurationFormComponent } from '../../../../development-process-registry/module-api/configuration-form-component';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { WhiteboardTemplateEntry } from '../whiteboard-template';
import { WhiteboardTemplateService } from '../whiteboard-template.service';

@Component({
  selector: 'app-select-whiteboard-template',
  templateUrl: './select-whiteboard-template.component.html',
  styleUrls: ['./select-whiteboard-template.component.scss'],
})
export class SelectWhiteboardTemplateComponent
  implements OnInit, ConfigurationFormComponent
{
  formGroup!: UntypedFormGroup;

  whiteboardTemplates?: WhiteboardTemplateEntry[];

  constructor(private whiteboardTemplateService: WhiteboardTemplateService) {}

  ngOnInit(): void {
    void this.loadWhiteboardTemplates();
  }

  async loadWhiteboardTemplates(): Promise<void> {
    this.whiteboardTemplates = await this.whiteboardTemplateService.getList();
  }

  get templateControl(): UntypedFormControl {
    return this.formGroup.get('templateId') as UntypedFormControl;
  }
}
