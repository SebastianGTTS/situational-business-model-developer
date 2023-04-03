import { Component, OnDestroy, OnInit } from '@angular/core';
import { DevelopmentMethodLoaderService } from '../../shared/development-method-loader.service';
import { DevelopmentMethod } from '../../../development-process-registry/development-method/development-method';
import { DevelopmentMethodService } from '../../../development-process-registry/development-method/development-method.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-development-method-overview',
  templateUrl: './development-method-overview.component.html',
  styleUrls: ['./development-method-overview.component.css'],
})
export class DevelopmentMethodOverviewComponent implements OnInit, OnDestroy {
  inputArtifactsCorrectlyDefined = true;
  outputArtifactsCorrectlyDefined = true;
  stakeholdersCorrectlyDefined = true;
  toolsCorrectlyDefined = true;
  executionStepsCorrectlyDefined = true;

  private loadedSubscription?: Subscription;

  constructor(
    private developmentMethodLoaderService: DevelopmentMethodLoaderService,
    private developmentMethodService: DevelopmentMethodService
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

  get developmentMethod(): DevelopmentMethod | undefined {
    return this.developmentMethodLoaderService.developmentMethod;
  }
}
