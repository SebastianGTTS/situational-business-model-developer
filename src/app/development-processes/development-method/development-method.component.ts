import { Component } from '@angular/core';
import { DevelopmentMethodService } from '../../development-process-registry/development-method/development-method.service';
import { FormArray, FormGroup } from '@angular/forms';
import { ExecutionStepsFormService } from '../shared/execution-steps-form.service';
import { DevelopmentMethodLoaderService } from '../shared/development-method-loader.service';

@Component({
  selector: 'app-development-method',
  templateUrl: './development-method.component.html',
  styleUrls: ['./development-method.component.css'],
  providers: [DevelopmentMethodLoaderService],
})
export class DevelopmentMethodComponent {
  constructor(
    private developmentMethodLoaderService: DevelopmentMethodLoaderService,
    private developmentMethodService: DevelopmentMethodService,
    private executionStepsFormService: ExecutionStepsFormService
  ) {}

  async updateExecutionSteps(form: FormArray) {
    const executionSteps = this.executionStepsFormService.getExecutionSteps(
      form.value
    );
    await this.updateDevelopmentMethodValue({ executionSteps });
  }

  async updateDevelopmentMethod(form: FormGroup) {
    await this.updateDevelopmentMethodValue(form.value);
  }

  async updateDevelopmentMethodValue(value: any) {
    await this.developmentMethodService.update(
      this.developmentMethod._id,
      value
    );
  }

  get developmentMethod() {
    return this.developmentMethodLoaderService.developmentMethod;
  }
}
