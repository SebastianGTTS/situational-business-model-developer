import { Component } from '@angular/core';
import { DevelopmentMethodService } from '../../development-process-registry/development-method/development-method.service';
import { FormArray, FormGroup } from '@angular/forms';
import { ExecutionStepsFormService } from '../shared/execution-steps-form.service';
import { DevelopmentMethodLoaderService } from '../shared/development-method-loader.service';
import { DevelopmentMethod } from '../../development-process-registry/development-method/development-method';

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

  async updateExecutionSteps(form: FormArray): Promise<void> {
    const executionSteps = this.executionStepsFormService.getExecutionSteps(
      form.value
    );
    await this.updateDevelopmentMethodValue({ executionSteps });
  }

  async updateDevelopmentMethod(form: FormGroup): Promise<void> {
    await this.updateDevelopmentMethodValue(form.value);
  }

  async updateDevelopmentMethodValue(
    value: Partial<DevelopmentMethod>
  ): Promise<void> {
    await this.developmentMethodService.update(
      this.developmentMethod._id,
      value
    );
  }

  get developmentMethod(): DevelopmentMethod {
    return this.developmentMethodLoaderService.developmentMethod;
  }
}
