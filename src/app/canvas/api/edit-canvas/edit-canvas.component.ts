import { Component, OnInit } from '@angular/core';
import { CompanyModelService } from '../../../canvas-meta-model/company-model.service';
import { CanvasResolveService } from '../../canvas-resolve.service';
import { ConformanceReport } from '../../../canvas-meta-model/conformance-report';
import { CanvasModelConsistencyService } from '../../../canvas-meta-model/canvas-model-consistency.service';
import { ProcessApiService } from '../process-api.service';
import { InstanceLoaderService } from '../instance-loader.service';
import { RunningMethod } from '../../../development-process-registry/running-process/running-method';
import { Instance } from '../../../canvas-meta-model/instance';
import { CompanyModel } from '../../../canvas-meta-model/company-model';
import { RunningProcess } from '../../../development-process-registry/running-process/running-process';
import { Comment } from '../../../development-process-registry/running-process/comment';
import { RunningProcessService } from '../../../development-process-registry/running-process/running-process.service';

@Component({
  selector: 'app-edit-canvas',
  templateUrl: './edit-canvas.component.html',
  styleUrls: ['./edit-canvas.component.css'],
  providers: [InstanceLoaderService, ProcessApiService],
})
export class EditCanvasComponent implements OnInit {
  conformanceIsChecked: boolean;
  conformance: ConformanceReport;

  constructor(
    private canvasModelConsistencyService: CanvasModelConsistencyService,
    private canvasResolveService: CanvasResolveService,
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

  uncheckConformance(): void {
    this.conformanceIsChecked = false;
    this.conformance = new ConformanceReport();
  }

  checkConformance(): void {
    this.conformance =
      this.canvasModelConsistencyService.checkConformanceOfInstance(
        this.companyModel,
        this.instance.id,
        []
      );
    this.conformanceIsChecked = true;
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

  finish(): void {
    this.canvasResolveService.resolveEditCanvas(
      this.processApiService.stepInfo,
      this.companyModel._id,
      this.instance.id
    );
  }

  async updateCompanyModel(): Promise<void> {
    await this.companyModelService.save(this.companyModel);
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
