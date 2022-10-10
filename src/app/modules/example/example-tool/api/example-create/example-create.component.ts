import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ProcessApiService } from '../../../../../development-process-registry/module-api/process-api.service';
import { ActivatedRoute } from '@angular/router';
import { RunningMethod } from '../../../../../development-process-registry/running-process/running-method';
import { ExampleToolResolveService } from '../../example-tool-resolve.service';
import { ExampleService } from '../../../example-artifact/example.service';

@Component({
  selector: 'app-example-create',
  templateUrl: './example-create.component.html',
  styleUrls: ['./example-create.component.css'],
  providers: [ProcessApiService],
})
export class ExampleCreateComponent {
  form: FormGroup = this.fb.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    private exampleToolResolveService: ExampleToolResolveService,
    private exampleService: ExampleService,
    private processApiService: ProcessApiService,
    private route: ActivatedRoute
  ) {}

  async submit(): Promise<void> {
    const artifactId = this.route.snapshot.paramMap.get('id');
    if (artifactId != null) {
      if (this.processApiService.runningProcess != null) {
        const example = await this.exampleService.add({
          name: this.form.value.name,
          description: this.form.value.description,
        });
        await this.exampleToolResolveService.resolveCreateManually(
          this.processApiService.runningProcess._id,
          example._id,
          artifactId
        );
      }
    } else {
      if (this.processApiService.stepInfo != null) {
        const example = await this.exampleService.add({
          name: this.form.value.name,
          description: this.form.value.description,
        });
        await this.exampleToolResolveService.resolve(
          this.processApiService.stepInfo,
          example._id
        );
      }
    }
  }

  get runningMethod(): RunningMethod | undefined {
    return this.processApiService.runningMethod;
  }

  isCorrectStep(): boolean {
    return this.processApiService.isCorrectStep();
  }

  get nameControl(): FormControl {
    return this.form.get('name') as FormControl;
  }

  get descriptionControl(): FormControl {
    return this.form.get('description') as FormControl;
  }

  isManually(): boolean {
    return this.processApiService.stepInfo?.step == null;
  }
}
