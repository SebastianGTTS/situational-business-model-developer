import { Component, OnInit } from '@angular/core';
import { ProcessApiService } from '../../../../../development-process-registry/module-api/process-api.service';
import { Instance } from '../../../canvas-meta-artifact/instance';
import { CompanyModelService } from '../../../canvas-meta-artifact/company-model.service';
import { CanvasToolResolveService } from '../../canvas-tool-resolve.service';
import { ConformanceReport } from '../../../canvas-meta-artifact/conformance-report';
import { CanvasModelConsistencyService } from '../../../canvas-meta-artifact/canvas-model-consistency.service';
import { FormBuilder } from '@angular/forms';
import { ExpertModel } from '../../../canvas-meta-artifact/expert-model';
import { ExpertModelService } from '../../../canvas-meta-artifact/expert-model.service';
import { InstanceLoaderService } from '../instance-loader.service';
import { RunningMethod } from '../../../../../development-process-registry/running-process/running-method';
import { RunningProcess } from '../../../../../development-process-registry/running-process/running-process';
import { CompanyModel } from '../../../canvas-meta-artifact/company-model';
import { Comment } from '../../../../../development-process-registry/running-process/comment';
import { RunningProcessService } from '../../../../../development-process-registry/running-process/running-process.service';
import { FeatureInit } from '../../../canvas-meta-artifact/feature';

@Component({
  selector: 'app-refine-canvas',
  templateUrl: './refine-canvas.component.html',
  styleUrls: ['./refine-canvas.component.css'],
  providers: [InstanceLoaderService, ProcessApiService],
})
export class RefineCanvasComponent implements OnInit {
  expertModels: ExpertModel[] = [];

  conformanceIsChecked = false;
  conformance: ConformanceReport = new ConformanceReport();
  conformanceOptionsForm = this.fb.nonNullable.group({
    showWarnings: true,
    showStrengths: true,
    showHints: true,
    showPatternHints: true,
    showUsedPatterns: false,
  });

  patternInstance?: Instance;

  constructor(
    private canvasModelConsistencyService: CanvasModelConsistencyService,
    private canvasResolveService: CanvasToolResolveService,
    private companyModelService: CompanyModelService,
    private expertModelService: ExpertModelService,
    private fb: FormBuilder,
    private instanceLoaderService: InstanceLoaderService,
    private processApiService: ProcessApiService,
    private runningProcessService: RunningProcessService
  ) {}

  ngOnInit(): void {
    this.instanceLoaderService.loaded.subscribe(() => {
      if (this.conformanceIsChecked) {
        this.checkConformance();
      } else {
        this.uncheckConformance();
      }
      void this.loadExpertModels();
    });
  }

  async addDecision(featureId: string): Promise<void> {
    if (this.companyModel != null && this.instance != null) {
      await this.companyModelService.addDecisionToInstance(
        this.companyModel._id,
        this.instance.id,
        featureId
      );
    }
  }

  async addFeature(parentId: string, featureInit: FeatureInit): Promise<void> {
    if (this.companyModel != null && this.instance != null) {
      await this.companyModelService.addFeatureToInstance(
        this.companyModel._id,
        this.instance.id,
        parentId,
        featureInit
      );
    }
  }

  async removeDecision(featureId: string): Promise<void> {
    if (this.companyModel != null && this.instance != null) {
      await this.companyModelService.removeDecisionFromInstance(
        this.companyModel._id,
        this.instance.id,
        featureId
      );
    }
  }

  finish(): void {
    if (
      this.companyModel != null &&
      this.instance != null &&
      this.processApiService.stepInfo != null
    ) {
      this.canvasResolveService.resolveEditCanvas(
        this.processApiService.stepInfo,
        this.companyModel._id,
        this.instance.id
      );
    }
  }

  uncheckConformance(): void {
    this.conformanceIsChecked = false;
    this.conformance = new ConformanceReport();
  }

  checkConformance(): void {
    if (this.companyModel != null && this.instance != null) {
      this.clearPattern();
      this.conformance =
        this.canvasModelConsistencyService.checkConformanceOfInstance(
          this.companyModel,
          this.instance.id,
          this.expertModels
            .map((expertModel) => expertModel.getPatterns())
            .reduce((prev, curr) => {
              prev.push(...curr);
              return prev;
            }, [])
        );
      this.conformanceIsChecked = true;
    }
  }

  showPattern(patternInstance: Instance): void {
    this.uncheckConformance();
    this.patternInstance = patternInstance;
  }

  clearPattern(): void {
    this.patternInstance = undefined;
  }

  async loadExpertModels(): Promise<void> {
    if (this.companyModel != null) {
      const expertModels: ExpertModel[] = [];
      for (const expertModelId of this.companyModel.expertModelIds) {
        const expertModel = await this.expertModelService.get(expertModelId);
        const featureIds = expertModel
          .getFeatureList()
          .map((feature) => feature.id);
        if (
          featureIds.every(
            (id) =>
              id in
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              this.companyModel!.expertModelTraces[expertModel._id]
                .expertFeatureIdMap
          ) &&
          expertModel.getPatterns().length > 0
        ) {
          expertModels.push(expertModel);
        }
      }
      this.expertModels = expertModels;
    }
  }

  async updateCompanyModel(): Promise<void> {
    if (this.companyModel != null) {
      await this.companyModelService.save(this.companyModel);
    }
  }

  async addComment(comment: Comment): Promise<void> {
    if (this.runningProcess != null && this.runningMethod != null) {
      await this.runningProcessService.addComment(
        this.runningProcess._id,
        this.runningMethod.executionId,
        comment
      );
    }
  }

  async updateComment(comment: Comment): Promise<void> {
    if (this.runningProcess != null && this.runningMethod != null) {
      await this.runningProcessService.updateComment(
        this.runningProcess._id,
        this.runningMethod.executionId,
        comment
      );
    }
  }

  async removeComment(commentId: string): Promise<void> {
    if (this.runningProcess != null && this.runningMethod != null) {
      await this.runningProcessService.removeComment(
        this.runningProcess._id,
        this.runningMethod.executionId,
        commentId
      );
    }
  }

  get companyModel(): CompanyModel | undefined {
    return this.instanceLoaderService.companyModel;
  }

  get instance(): Instance | undefined {
    return this.instanceLoaderService.instance;
  }

  private get runningProcess(): RunningProcess | undefined {
    return this.processApiService.runningProcess;
  }

  get runningMethod(): RunningMethod | undefined {
    return this.processApiService.runningMethod;
  }

  isCorrectStep(): boolean {
    return this.processApiService.isCorrectStep();
  }
}
