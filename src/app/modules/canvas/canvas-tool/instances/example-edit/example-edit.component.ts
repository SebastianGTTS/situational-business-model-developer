import { Component, OnDestroy, OnInit } from '@angular/core';
import { InstanceLoaderService } from '../../expert-model/instance-loader.service';
import { Instance } from '../../../canvas-meta-artifact/instance';
import { ExpertModel } from '../../../canvas-meta-artifact/expert-model';
import { ConformanceReport } from '../../../canvas-meta-artifact/conformance-report';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { CanvasModelConsistencyService } from '../../../canvas-meta-artifact/canvas-model-consistency.service';
import { Subscription } from 'rxjs';
import { InstanceService } from '../instance.service';
import { ExpertModelService } from '../../../canvas-meta-artifact/expert-model.service';
import { FeatureInit } from '../../../canvas-meta-artifact/feature';

@Component({
  selector: 'app-example-edit',
  templateUrl: './example-edit.component.html',
  styleUrls: ['./example-edit.component.scss'],
})
export class ExampleEditComponent implements OnInit, OnDestroy {
  // Conformance Checking
  conformanceIsChecked = false;
  conformance: ConformanceReport = new ConformanceReport();
  conformanceOptionsForm = this.fb.nonNullable.group({
    showWarnings: true,
    showStrengths: true,
    showHints: false,
    showPatternHints: false,
    showUsedPatterns: false,
  });

  // Compare / Heatmap
  selectOtherInstanceForm = this.fb.group<{
    instance: FormControl<Instance | null>;
  }>({
    instance: this.fb.control(null, Validators.required),
  });
  compareInstance?: Instance;
  percentages?: { [id: string]: number };

  // Show pattern
  selectPatternForm = this.fb.group<{
    pattern: FormControl<Instance | null>;
  }>({
    pattern: this.fb.control(null, Validators.required),
  });
  patternInstance?: Instance;

  private loadedSubscription?: Subscription;

  constructor(
    private canvasModelConsistencyService: CanvasModelConsistencyService,
    private expertModelService: ExpertModelService,
    private fb: FormBuilder,
    private instanceLoaderService: InstanceLoaderService,
    private instanceService: InstanceService
  ) {}

  ngOnInit(): void {
    this.loadedSubscription = this.instanceLoaderService.loaded.subscribe(
      () => {
        if (this.conformanceIsChecked) {
          this.checkConformance();
        }
      }
    );
  }

  ngOnDestroy(): void {
    this.loadedSubscription?.unsubscribe();
  }

  async addDecision(featureId: string): Promise<void> {
    if (this.expertModel != null && this.instance != null) {
      await this.expertModelService.addDecisionToInstance(
        this.expertModel._id,
        this.instance.id,
        featureId
      );
    }
  }

  async addFeature(parentId: string, featureInit: FeatureInit): Promise<void> {
    if (this.expertModel != null && this.instance != null) {
      await this.expertModelService.addFeatureToInstance(
        this.expertModel._id,
        this.instance.id,
        parentId,
        featureInit
      );
    }
  }

  async removeDecision(featureId: string): Promise<void> {
    if (this.expertModel != null && this.instance != null) {
      await this.expertModelService.removeDecisionFromInstance(
        this.expertModel._id,
        this.instance.id,
        featureId
      );
    }
  }

  /**
   * Uncheck the conformance.
   */
  uncheckConformance(): void {
    this.conformanceIsChecked = false;
    this.conformance = new ConformanceReport();
  }

  /**
   * Check the conformance.
   */
  checkConformance(): void {
    if (this.expertModel != null && this.instance != null) {
      this.clearCompare();
      this.clearPattern();
      this.conformance =
        this.canvasModelConsistencyService.checkConformanceOfInstance(
          this.expertModel,
          this.instance.id,
          this.expertModel.getPatterns()
        );
      this.conformanceIsChecked = true;
    }
  }

  /**
   * Compare this instance with another instance and generate a heatmap
   */
  compare(): void {
    if (this.expertModel != null && this.instance != null) {
      this.uncheckConformance();
      this.clearPattern();
      this.compareInstance =
        this.selectOtherInstanceForm.value.instance ?? undefined;
      if (this.compareInstance == null) {
        throw new Error('Compare instance does not exist');
      }
      this.percentages = this.instanceService.compareInstances(
        this.expertModel,
        this.instance,
        this.compareInstance
      );
      this.selectOtherInstanceForm.get('instance')?.disable();
    }
  }

  /**
   * Clear comparison and remove heatmap
   */
  clearCompare(): void {
    this.compareInstance = undefined;
    this.percentages = undefined;
    this.selectOtherInstanceForm.get('instance')?.enable();
  }

  /**
   * Show pattern in business model canvas
   */
  showPattern(): void {
    this.uncheckConformance();
    this.clearCompare();
    this.patternInstance = this.selectPatternForm.value.pattern ?? undefined;
    this.selectPatternForm.get('pattern')?.disable();
  }

  /**
   * Do not show pattern in business model canvas any longer
   */
  clearPattern(): void {
    this.patternInstance = undefined;
    this.selectPatternForm.get('pattern')?.enable();
  }

  get selectedPattern(): Instance | undefined {
    return this.selectPatternForm.value.pattern ?? undefined;
  }

  get instance(): Instance | undefined {
    return this.instanceLoaderService.instance;
  }

  get expertModel(): ExpertModel | undefined {
    return this.instanceLoaderService.expertModel;
  }
}
