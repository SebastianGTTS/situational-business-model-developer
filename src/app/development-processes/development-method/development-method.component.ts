import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { DevelopmentMethodService } from '../../development-process-registry/development-method/development-method.service';
import { FormArray, FormGroup } from '@angular/forms';
import { ExecutionStepsFormService } from '../shared/execution-steps-form.service';
import { DevelopmentMethodLoaderService } from '../shared/development-method-loader.service';
import { DevelopmentMethod } from '../../development-process-registry/development-method/development-method';
import { UPDATABLE, Updatable } from '../../shared/updatable';

@Component({
  selector: 'app-development-method',
  templateUrl: './development-method.component.html',
  styleUrls: ['./development-method.component.css'],
  providers: [
    DevelopmentMethodLoaderService,
    { provide: UPDATABLE, useExisting: DevelopmentMethodComponent },
  ],
})
export class DevelopmentMethodComponent implements OnInit, Updatable {
  correctlyDefined = true;
  inputArtifactsCorrectlyDefined = true;
  executionStepsCorrectlyDefined = true;

  @ViewChildren(UPDATABLE) updatable!: QueryList<Updatable>;

  constructor(
    private developmentMethodLoaderService: DevelopmentMethodLoaderService,
    private developmentMethodService: DevelopmentMethodService,
    private executionStepsFormService: ExecutionStepsFormService
  ) {}

  ngOnInit(): void {
    this.developmentMethodLoaderService.loaded.subscribe(() => {
      if (this.developmentMethod != null) {
        this.correctlyDefined =
          this.developmentMethodService.isCorrectlyDefined(
            this.developmentMethod
          );
        this.inputArtifactsCorrectlyDefined =
          this.developmentMethodService.isInputArtifactsCorrectlyDefined(
            this.developmentMethod
          );
        this.executionStepsCorrectlyDefined =
          this.developmentMethodService.isExecutionStepsCorrectlyDefined(
            this.developmentMethod
          );
      } else {
        this.correctlyDefined = true;
        this.inputArtifactsCorrectlyDefined = true;
        this.executionStepsCorrectlyDefined = true;
      }
    });
  }

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
    if (this.developmentMethod != null) {
      await this.developmentMethodService.update(
        this.developmentMethod._id,
        value
      );
    }
  }

  update(): void {
    for (const updatable of this.updatable) {
      updatable.update();
    }
  }

  get developmentMethod(): DevelopmentMethod | undefined {
    return this.developmentMethodLoaderService.developmentMethod;
  }
}
