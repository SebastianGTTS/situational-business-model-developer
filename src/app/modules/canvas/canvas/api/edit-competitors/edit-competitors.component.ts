import { Component, OnInit } from '@angular/core';
import { ProcessApiService } from '../../../../../development-process-registry/module-api/process-api.service';
import { Router } from '@angular/router';
import { CompanyModelService } from '../../../canvas-meta-model/company-model.service';
import { Instance } from '../../../canvas-meta-model/instance';
import { CanvasResolveService } from '../../canvas-resolve.service';
import { InstanceLoaderService } from '../instance-loader.service';
import { CompanyModel } from '../../../canvas-meta-model/company-model';
import { RunningProcess } from '../../../../../development-process-registry/running-process/running-process';
import { RunningMethod } from '../../../../../development-process-registry/running-process/running-method';
import { Comment } from '../../../../../development-process-registry/running-process/comment';
import { RunningProcessService } from '../../../../../development-process-registry/running-process/running-process.service';

@Component({
  selector: 'app-edit-competitors',
  templateUrl: './edit-competitors.component.html',
  styleUrls: ['./edit-competitors.component.css'],
  providers: [InstanceLoaderService, ProcessApiService],
})
export class EditCompetitorsComponent implements OnInit {
  competitors: Instance[] = [];

  constructor(
    private canvasResolveService: CanvasResolveService,
    private companyModelService: CompanyModelService,
    private instanceLoaderService: InstanceLoaderService,
    private processApiService: ProcessApiService,
    private router: Router,
    private runningProcessService: RunningProcessService
  ) {}

  ngOnInit(): void {
    this.instanceLoaderService.loaded.subscribe(() => {
      if (this.companyModel != null) {
        this.competitors = this.companyModel.instances.filter(
          (instance) => instance.id !== this.instanceId
        );
      } else {
        this.competitors = [];
      }
    });
  }

  async editCompetitor(id: number): Promise<void> {
    if (this.companyModel != null) {
      await this.router.navigate(
        [
          'canvas',
          this.companyModel._id,
          'instance',
          this.instanceId,
          'competitors',
          id,
          'edit',
        ],
        { queryParams: this.processApiService.queryParams }
      );
    }
  }

  async removeCompetitor(id: number): Promise<void> {
    if (this.companyModel != null) {
      this.companyModel.removeInstance(id);
      await this.updateCompanyModel();
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

  finish(): void {
    if (
      this.companyModel != null &&
      this.instanceId != null &&
      this.processApiService.stepInfo != null
    ) {
      this.canvasResolveService.resolveEditCanvas(
        this.processApiService.stepInfo,
        this.companyModel._id,
        this.instanceId
      );
    }
  }

  private async updateCompanyModel(): Promise<void> {
    if (this.companyModel != null) {
      await this.companyModelService.save(this.companyModel);
    }
  }

  get companyModel(): CompanyModel | undefined {
    return this.instanceLoaderService.companyModel;
  }

  get instanceId(): number | undefined {
    return this.instanceLoaderService.instance?.id;
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
