import { Component, OnInit } from '@angular/core';
import { ProcessApiService } from '../../../development-process-registry/module-api/process-api.service';
import { Instance } from '../../../canvas-meta-model/instance';
import { CompanyModelService } from '../../../canvas-meta-model/company-model.service';
import { CanvasResolveService } from '../../canvas-resolve.service';
import { ConformanceReport } from '../../../canvas-meta-model/conformance-report';
import { CanvasModelConsistencyService } from '../../../canvas-meta-model/canvas-model-consistency.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ExpertModel } from '../../../canvas-meta-model/expert-model';
import { ExpertModelService } from '../../../canvas-meta-model/expert-model.service';
import { InstanceLoaderService } from '../instance-loader.service';
import { RunningMethod } from '../../../development-process-registry/running-process/running-method';
import { RunningProcess } from '../../../development-process-registry/running-process/running-process';
import { CompanyModel } from '../../../canvas-meta-model/company-model';
import { Comment } from '../../../development-process-registry/running-process/comment';
import { RunningProcessService } from '../../../development-process-registry/running-process/running-process.service';

@Component({
  selector: 'app-refine-canvas',
  templateUrl: './refine-canvas.component.html',
  styleUrls: ['./refine-canvas.component.css'],
  providers: [InstanceLoaderService, ProcessApiService],
})
export class RefineCanvasComponent implements OnInit {
  expertModels: ExpertModel[];

  conformanceIsChecked: boolean;
  conformance: ConformanceReport = new ConformanceReport();
  conformanceOptionsForm: FormGroup = this.fb.group({
    showWarnings: true,
    showStrengths: true,
    showHints: true,
    showPatternHints: true,
    showUsedPatterns: false,
  });

  patternInstance: Instance = null;

  constructor(
    private canvasModelConsistencyService: CanvasModelConsistencyService,
    private canvasResolveService: CanvasResolveService,
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

  finish(): void {
    this.canvasResolveService.resolveEditCanvas(
      this.processApiService.stepInfo,
      this.companyModel._id,
      this.instance.id
    );
  }

  uncheckConformance(): void {
    this.conformanceIsChecked = false;
    this.conformance = new ConformanceReport();
  }

  checkConformance(): void {
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

  showPattern(patternInstance: Instance): void {
    this.uncheckConformance();
    this.patternInstance = patternInstance;
  }

  clearPattern(): void {
    this.patternInstance = null;
  }

  async loadExpertModels(): Promise<void> {
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
            this.companyModel.expertModelTraces[expertModel._id]
              .expertFeatureIdMap
        ) &&
        expertModel.getPatterns().length > 0
      ) {
        expertModels.push(expertModel);
      }
    }
    this.expertModels = expertModels;
  }

  async updateCompanyModel(): Promise<void> {
    await this.companyModelService.save(this.companyModel);
  }

  async addComment(comment: Comment): Promise<void> {
    await this.runningProcessService.addComment(
      this.runningProcess._id,
      this.runningMethod.executionId,
      comment
    );
  }

  async updateComment(comment: Comment): Promise<void> {
    await this.runningProcessService.updateComment(
      this.runningProcess._id,
      this.runningMethod.executionId,
      comment
    );
  }

  async removeComment(commentId: string): Promise<void> {
    await this.runningProcessService.removeComment(
      this.runningProcess._id,
      this.runningMethod.executionId,
      commentId
    );
  }

  get companyModel(): CompanyModel {
    return this.instanceLoaderService.companyModel;
  }

  get instance(): Instance {
    return this.instanceLoaderService.instance;
  }

  private get runningProcess(): RunningProcess {
    return this.processApiService.runningProcess;
  }

  get runningMethod(): RunningMethod {
    return this.processApiService.runningMethod;
  }

  isCorrectStep(): boolean {
    return this.processApiService.isCorrectStep();
  }
}
