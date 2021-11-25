import { Component } from '@angular/core';
import { ProcessApiService } from '../process-api.service';
import { CompanyModelService } from '../../../canvas-meta-model/company-model.service';
import { CanvasResolveService } from '../../canvas-resolve.service';
import { InstanceLoaderService } from '../instance-loader.service';
import { RunningProcess } from '../../../development-process-registry/running-process/running-process';
import { RunningMethod } from '../../../development-process-registry/running-process/running-method';
import { CompanyModel } from '../../../canvas-meta-model/company-model';
import { Comment } from '../../../development-process-registry/running-process/comment';
import { RunningProcessService } from '../../../development-process-registry/running-process/running-process.service';

@Component({
  selector: 'app-edit-model',
  templateUrl: './edit-model.component.html',
  styleUrls: ['./edit-model.component.css'],
  providers: [InstanceLoaderService, ProcessApiService],
})
export class EditModelComponent {
  constructor(
    private canvasResolveService: CanvasResolveService,
    private instanceLoaderService: InstanceLoaderService,
    private companyModelService: CompanyModelService,
    private processApiService: ProcessApiService,
    private runningProcessService: RunningProcessService
  ) {}

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
      this.instanceLoaderService.instance.id
    );
  }

  async updateCompanyModel(): Promise<void> {
    await this.companyModelService.save(this.companyModel);
  }

  get companyModel(): CompanyModel {
    return this.instanceLoaderService.companyModel;
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
