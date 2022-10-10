import { Component, OnInit } from '@angular/core';
import { Instance } from '../../../canvas-meta-model/instance';
import { CompanyModelService } from '../../../canvas-meta-model/company-model.service';
import { ProcessApiService } from '../../../../../development-process-registry/module-api/process-api.service';
import { CanvasResolveService } from '../../canvas-resolve.service';
import { InstanceService } from '../../instances/instance.service';
import { InstanceLoaderService } from '../instance-loader.service';
import { CompanyModel } from '../../../canvas-meta-model/company-model';
import { RunningProcess } from '../../../../../development-process-registry/running-process/running-process';
import { RunningMethod } from '../../../../../development-process-registry/running-process/running-method';
import { Comment } from '../../../../../development-process-registry/running-process/comment';
import { RunningProcessService } from '../../../../../development-process-registry/running-process/running-process.service';

@Component({
  selector: 'app-compare',
  templateUrl: './compare.component.html',
  styleUrls: ['./compare.component.css'],
  providers: [InstanceLoaderService, ProcessApiService],
})
export class CompareComponent implements OnInit {
  competitors: Instance[] = [];

  private expertModelId?: string;
  compareInstance?: Instance;
  percentages?: { [id: string]: number };

  constructor(
    private canvasResolveService: CanvasResolveService,
    private companyModelService: CompanyModelService,
    private instanceLoaderService: InstanceLoaderService,
    private instanceService: InstanceService,
    private processApiService: ProcessApiService,
    private runningProcessService: RunningProcessService
  ) {}

  ngOnInit(): void {
    this.instanceLoaderService.loaded.subscribe(() => {
      if (this.companyModel != null && this.instance != null) {
        this.competitors = this.companyModel.instances.filter(
          (instance) => instance.id !== this.instance?.id
        );
        if (this.compareInstance) {
          this.compare(this.compareInstance, this.expertModelId);
        }
      }
    });
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

  compare(instance: Instance, modelId?: string): void {
    if (this.companyModel != null && this.instance != null) {
      if (modelId !== this.companyModel._id) {
        this.expertModelId = modelId;
      } else {
        this.expertModelId = undefined;
      }
      this.compareInstance = this.expertModelId
        ? this.instanceService.convertExpertInstance(
            this.companyModel,
            this.expertModelId,
            instance
          )
        : instance;
      this.percentages = this.instanceService.compareInstances(
        this.companyModel,
        this.instance,
        this.compareInstance
      );
    }
  }

  clearCompare(): void {
    this.expertModelId = undefined;
    this.compareInstance = undefined;
    this.percentages = undefined;
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

  async updateCompanyModel(): Promise<void> {
    if (this.companyModel != null) {
      await this.companyModelService.save(this.companyModel);
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
