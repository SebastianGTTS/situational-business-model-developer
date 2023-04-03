import { Component, OnInit } from '@angular/core';
import { FormBuilder, UntypedFormControl, Validators } from '@angular/forms';
import { ProcessApiService } from '../../../../../development-process-registry/module-api/process-api.service';
import { RunningMethod } from '../../../../../development-process-registry/running-process/running-method';
import { WhiteboardTemplate } from '../../../whiteboard-meta-artifact/whiteboard-template';
import { WhiteboardTemplateService } from '../../../whiteboard-meta-artifact/whiteboard-template.service';
import { WhiteboardInstanceService } from '../../../whiteboard-meta-artifact/whiteboard-instance.service';
import { WhiteboardToolResolveService } from '../../whiteboard-tool-resolve.service';
import { CreateWhiteboardPredefinedInput } from '../select-whiteboard-template-configuration/select-whiteboard-template-configuration.component';
import { MethodExecutionStep } from '../../../../../development-process-registry/development-method/method-execution-step';

@Component({
  selector: 'app-create-whiteboard-instance',
  templateUrl: './create-whiteboard-instance.component.html',
  styleUrls: ['./create-whiteboard-instance.component.css'],
  providers: [ProcessApiService],
})
export class CreateWhiteboardInstanceComponent implements OnInit {
  whiteboardTemplate?: WhiteboardTemplate;
  form = this.fb.nonNullable.group({
    name: ['', Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    private processApiService: ProcessApiService,
    private whiteboardInstanceService: WhiteboardInstanceService,
    private whiteboardResolveService: WhiteboardToolResolveService,
    private whiteboardTemplateService: WhiteboardTemplateService
  ) {}

  ngOnInit(): void {
    this.processApiService.loaded.subscribe(async () => {
      await this.loadWhiteboardTemplate();
      if (this.nameControl.value === '') {
        this.setDefaultName();
      }
    });
  }

  setDefaultName(): void {
    if (this.whiteboardTemplate != null) {
      this.nameControl.setValue(this.whiteboardTemplate.name);
    }
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
    if (this.runningMethod != null) {
      this.whiteboardTemplate = await this.whiteboardTemplateService.get(
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        (
          (this.runningMethod.currentStep as MethodExecutionStep)
            .predefinedInput as CreateWhiteboardPredefinedInput
        ).templateId!
      );
    }
  }

  get runningMethod(): RunningMethod | undefined {
    return this.processApiService.runningMethod;
  }

  isCorrectStep(): boolean {
    return this.processApiService.isCorrectStep();
  }

  get nameControl(): UntypedFormControl {
    return this.form.get('name') as UntypedFormControl;
  }
}
