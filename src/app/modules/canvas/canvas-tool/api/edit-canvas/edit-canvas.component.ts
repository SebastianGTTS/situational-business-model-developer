import { Component, OnInit } from '@angular/core';
import { CompanyModelService } from '../../../canvas-meta-artifact/company-model.service';
import { CanvasToolResolveService } from '../../canvas-tool-resolve.service';
import { ConformanceReport } from '../../../canvas-meta-artifact/conformance-report';
import { CanvasModelConsistencyService } from '../../../canvas-meta-artifact/canvas-model-consistency.service';
import { ProcessApiService } from '../../../../../development-process-registry/module-api/process-api.service';
import { InstanceLoaderService } from '../instance-loader.service';
import { RunningMethod } from '../../../../../development-process-registry/running-process/running-method';
import { Instance } from '../../../canvas-meta-artifact/instance';
import { CompanyModel } from '../../../canvas-meta-artifact/company-model';
import { RunningProcess } from '../../../../../development-process-registry/running-process/running-process';
import { Comment } from '../../../../../development-process-registry/running-process/comment';
import { RunningProcessService } from '../../../../../development-process-registry/running-process/running-process.service';
import { ArtifactApiService } from '../../../../../development-process-registry/module-api/artifact-api.service';
import { FeatureInit } from '../../../canvas-meta-artifact/feature';

@Component({
  selector: 'app-edit-canvas',
  templateUrl: './edit-canvas.component.html',
  styleUrls: ['./edit-canvas.component.css'],
  providers: [ArtifactApiService, InstanceLoaderService, ProcessApiService],
})
export class EditCanvasComponent implements OnInit {
  conformanceIsChecked = false;
  conformance: ConformanceReport = new ConformanceReport();

  constructor(
    private canvasModelConsistencyService: CanvasModelConsistencyService,
    private canvasResolveService: CanvasToolResolveService,
    private companyModelService: CompanyModelService,
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

  uncheckConformance(): void {
    this.conformanceIsChecked = false;
    this.conformance = new ConformanceReport();
  }

  checkConformance(): void {
    if (this.companyModel != null && this.instance != null) {
      this.conformance =
        this.canvasModelConsistencyService.checkConformanceOfInstance(
          this.companyModel,
          this.instance.id,
          []
        );
      this.conformanceIsChecked = true;
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

  async finish(): Promise<void> {
    if (this.companyModel == null || this.instance == null) {
      return;
    }
    if (
      this.processApiService.stepInfo != null &&
      this.processApiService.stepInfo.step != null
    ) {
      this.canvasResolveService.resolveEditCanvas(
        this.processApiService.stepInfo,
        this.companyModel._id,
        this.instance.id
      );
    } else if (
      this.runningProcess != null &&
      this.processApiService.artifactVersionId != null
    ) {
      await this.canvasResolveService.resolveEditCanvasManually(
        this.runningProcess._id,
        this.processApiService.artifactVersionId
      );
    }
  }

  get companyModel(): CompanyModel | undefined {
    return this.instanceLoaderService.companyModel;
  }

  get instance(): Instance | undefined {
    return this.instanceLoaderService.instance;
  }

  get runningProcess(): RunningProcess | undefined {
    return this.processApiService.runningProcess;
  }

  get runningMethod(): RunningMethod | undefined {
    return this.processApiService.runningMethod;
  }

  isCorrectStep(): boolean {
    return this.processApiService.isCorrectStep();
  }
}
