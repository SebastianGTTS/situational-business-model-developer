import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ProcessApiService } from '../../../development-process-registry/module-api/process-api.service';
import { RunningMethod } from '../../../development-process-registry/running-process/running-method';
import { WhiteboardTemplate } from '../../../whiteboard-meta-model/whiteboard-template';
import { WhiteboardTemplateService } from '../../../whiteboard-meta-model/whiteboard-template.service';
import { WhiteboardInstanceService } from '../../../whiteboard-meta-model/whiteboard-instance.service';
import { WhiteboardResolveService } from '../../whiteboard-resolve.service';
import { CreateWhiteboardPredefinedInput } from '../select-whiteboard-template-configuration/select-whiteboard-template-configuration.component';

@Component({
  selector: 'app-create-whiteboard-instance',
  templateUrl: './create-whiteboard-instance.component.html',
  styleUrls: ['./create-whiteboard-instance.component.css'],
  providers: [ProcessApiService],
})
export class CreateWhiteboardInstanceComponent implements OnInit {
  whiteboardTemplate?: WhiteboardTemplate;
  form: FormGroup = this.fb.group({
    name: ['', Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    private processApiService: ProcessApiService,
    private whiteboardInstanceService: WhiteboardInstanceService,
    private whiteboardResolveService: WhiteboardResolveService,
    private whiteboardTemplateService: WhiteboardTemplateService
  ) {}

  ngOnInit(): void {
    this.processApiService.loaded.subscribe(() =>
      this.loadWhiteboardTemplate()
    );
  }

  async submit(): Promise<void> {
    if (
      this.processApiService.stepInfo != null &&
      this.whiteboardTemplate != null
    ) {
      const instance = await this.whiteboardInstanceService.addByTemplate(
        this.nameControl.value,
        this.whiteboardTemplate
      );
      this.whiteboardResolveService.resolve(
        this.processApiService.stepInfo,
        instance._id
      );
    }
  }

  private async loadWhiteboardTemplate(): Promise<void> {
    this.whiteboardTemplate = await this.whiteboardTemplateService.get(
      (
        this.runningMethod.currentStep
          .predefinedInput as CreateWhiteboardPredefinedInput
      ).templateId!
    );
  }

  get runningMethod(): RunningMethod {
    return this.processApiService.runningMethod;
  }

  isCorrectStep(): boolean {
    return this.processApiService.isCorrectStep();
  }

  get nameControl(): FormControl {
    return this.form.get('name') as FormControl;
  }
}
