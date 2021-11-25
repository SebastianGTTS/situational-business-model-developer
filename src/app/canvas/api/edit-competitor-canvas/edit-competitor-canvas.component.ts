import { Component, OnDestroy, OnInit } from '@angular/core';
import { ProcessApiService } from '../process-api.service';
import { ActivatedRoute } from '@angular/router';
import { CompanyModelService } from '../../../canvas-meta-model/company-model.service';
import { Instance } from '../../../canvas-meta-model/instance';
import { Subscription } from 'rxjs';
import { InstanceLoaderService } from '../instance-loader.service';
import { CompanyModel } from '../../../canvas-meta-model/company-model';
import { RunningProcess } from '../../../development-process-registry/running-process/running-process';
import { RunningMethod } from '../../../development-process-registry/running-process/running-method';
import { Comment } from '../../../development-process-registry/running-process/comment';
import { RunningProcessService } from '../../../development-process-registry/running-process/running-process.service';

@Component({
  selector: 'app-edit-competitor-canvas',
  templateUrl: './edit-competitor-canvas.component.html',
  styleUrls: ['./edit-competitor-canvas.component.css'],
  providers: [InstanceLoaderService, ProcessApiService],
})
export class EditCompetitorCanvasComponent implements OnInit, OnDestroy {
  private competitorId: number;
  competitor: Instance;

  private routeSubscription: Subscription;

  constructor(
    private companyModelService: CompanyModelService,
    private instanceLoaderService: InstanceLoaderService,
    private processApiService: ProcessApiService,
    private route: ActivatedRoute,
    private runningProcessService: RunningProcessService
  ) {}

  ngOnInit(): void {
    this.routeSubscription = this.route.paramMap.subscribe((paramMap) => {
      const newCompetitorId = +paramMap.get('competitorId');
      if (this.competitorId !== newCompetitorId) {
        this.competitorId = newCompetitorId;
        if (this.companyModel != null) {
          this.competitor = this.companyModel.getInstance(this.competitorId);
        }
      }
    });
    this.instanceLoaderService.loaded.subscribe(() => {
      this.competitor = this.companyModel.getInstance(this.competitorId);
    });
  }

  ngOnDestroy(): void {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

  async updateCompetitor(): Promise<void> {
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

  get instanceId(): number {
    return this.instanceLoaderService.instance.id;
  }

  private get runningProcess(): RunningProcess {
    return this.processApiService.runningProcess;
  }

  get runningMethod(): RunningMethod {
    return this.processApiService.runningMethod;
  }

  get queryParams(): {
    step: number;
    runningProcessId: string;
    executionId: string;
  } {
    return this.processApiService.queryParams;
  }

  isCorrectStep(): boolean {
    return this.processApiService.isCorrectStep();
  }
}
