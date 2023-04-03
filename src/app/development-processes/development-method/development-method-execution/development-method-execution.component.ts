import {
  Component,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { DevelopmentMethodLoaderService } from '../../shared/development-method-loader.service';
import { DevelopmentMethodService } from '../../../development-process-registry/development-method/development-method.service';
import { DevelopmentMethod } from '../../../development-process-registry/development-method/development-method';
import { UntypedFormArray } from '@angular/forms';
import { ExecutionStepsFormService } from '../../shared/execution-steps-form.service';
import { Updatable, UPDATABLE } from '../../../shared/updatable';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-development-method-execution',
  templateUrl: './development-method-execution.component.html',
  styleUrls: ['./development-method-execution.component.css'],
  providers: [
    { provide: UPDATABLE, useExisting: DevelopmentMethodExecutionComponent },
  ],
})
export class DevelopmentMethodExecutionComponent
  implements OnInit, OnDestroy, Updatable
{
  inputArtifactsCorrectlyDefined = true;
  outputArtifactsCorrectlyDefined = true;
  stakeholdersCorrectlyDefined = true;
  toolsCorrectlyDefined = true;
  executionStepsCorrectlyDefined = true;

  private loadedSubscription?: Subscription;

  @ViewChildren(UPDATABLE) updatable!: QueryList<Updatable>;

  constructor(
    private developmentMethodLoaderService: DevelopmentMethodLoaderService,
    private developmentMethodService: DevelopmentMethodService,
    private executionStepsFormService: ExecutionStepsFormService
  ) {}

  ngOnInit(): void {
    this.loadedSubscription =
      this.developmentMethodLoaderService.loaded.subscribe(() => {
        if (this.developmentMethod != null) {
          this.inputArtifactsCorrectlyDefined =
            this.developmentMethod.inputArtifacts.isComplete() &&
            this.developmentMethodService.isInputArtifactsCorrectlyDefined(
              this.developmentMethod
            );
          this.outputArtifactsCorrectlyDefined =
            this.developmentMethod.outputArtifacts.isComplete();
          this.stakeholdersCorrectlyDefined =
            this.developmentMethod.stakeholders.isComplete();
          this.toolsCorrectlyDefined =
            this.developmentMethod.tools.isComplete();
          this.executionStepsCorrectlyDefined =
            this.developmentMethodService.isExecutionStepsCorrectlyDefined(
              this.developmentMethod
            );
        } else {
          this.inputArtifactsCorrectlyDefined = true;
          this.outputArtifactsCorrectlyDefined = true;
          this.stakeholdersCorrectlyDefined = true;
          this.toolsCorrectlyDefined = true;
          this.executionStepsCorrectlyDefined = true;
        }
      });
  }

  ngOnDestroy(): void {
    this.loadedSubscription?.unsubscribe();
  }

  async updateExecutionSteps(form: UntypedFormArray): Promise<void> {
    const executionSteps = this.executionStepsFormService.getExecutionSteps(
      form.value
    );
    await this.updateDevelopmentMethodValue({ executionSteps });
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
