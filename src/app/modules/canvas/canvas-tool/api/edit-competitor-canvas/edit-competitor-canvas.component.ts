import { Component, OnDestroy, OnInit } from '@angular/core';
import { ProcessApiService } from '../../../../../development-process-registry/module-api/process-api.service';
import { ActivatedRoute } from '@angular/router';
import { CompanyModelService } from '../../../canvas-meta-artifact/company-model.service';
import { Instance } from '../../../canvas-meta-artifact/instance';
import { Subscription } from 'rxjs';
import { InstanceLoaderService } from '../instance-loader.service';
import { CompanyModel } from '../../../canvas-meta-artifact/company-model';
import { RunningProcess } from '../../../../../development-process-registry/running-process/running-process';
import { RunningMethod } from '../../../../../development-process-registry/running-process/running-method';
import { Comment } from '../../../../../development-process-registry/running-process/comment';
import { RunningProcessService } from '../../../../../development-process-registry/running-process/running-process.service';
import { ApiQueryParams } from '../../../../../development-process-registry/module-api/api-query-params';
import { FeatureInit } from '../../../canvas-meta-artifact/feature';

@Component({
  selector: 'app-edit-competitor-canvas',
  templateUrl: './edit-competitor-canvas.component.html',
  styleUrls: ['./edit-competitor-canvas.component.css'],
  providers: [InstanceLoaderService, ProcessApiService],
})
export class EditCompetitorCanvasComponent implements OnInit, OnDestroy {
  private competitorId?: number;
  competitor?: Instance;

  private routeSubscription?: Subscription;

  constructor(
    private companyModelService: CompanyModelService,
    private instanceLoaderService: InstanceLoaderService,
    private processApiService: ProcessApiService,
    private route: ActivatedRoute,
    private runningProcessService: RunningProcessService
  ) {}

  ngOnInit(): void {
    this.routeSubscription = this.route.paramMap.subscribe((paramMap) => {
      const competitorId = paramMap.get('competitorId');
      const newCompetitorId = competitorId ? +competitorId : undefined;
      if (this.competitorId !== newCompetitorId) {
        this.competitorId = newCompetitorId;
        if (this.companyModel != null) {
          this.competitor = this.companyModel.getInstance(this.competitorId);
        }
      }
    });
    this.instanceLoaderService.loaded.subscribe(() => {
      if (this.companyModel != null) {
        this.competitor = this.companyModel.getInstance(this.competitorId);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.routeSubscription != null) {
      this.routeSubscription.unsubscribe();
    }
  }

  async addDecision(featureId: string): Promise<void> {
    if (this.companyModel != null && this.competitorId != null) {
      await this.companyModelService.addDecisionToInstance(
        this.companyModel._id,
        this.competitorId,
        featureId
      );
    }
  }

  async addFeature(parentId: string, featureInit: FeatureInit): Promise<void> {
    if (this.companyModel != null && this.competitorId != null) {
      await this.companyModelService.addFeatureToInstance(
        this.companyModel._id,
        this.competitorId,
        parentId,
        featureInit
      );
    }
  }

  async removeDecision(featureId: string): Promise<void> {
    if (this.companyModel != null && this.competitorId != null) {
      await this.companyModelService.removeDecisionFromInstance(
        this.companyModel._id,
        this.competitorId,
        featureId
      );
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

  get instanceId(): number | undefined {
    return this.instanceLoaderService.instance?.id;
  }

  private get runningProcess(): RunningProcess | undefined {
    return this.processApiService.runningProcess;
  }

  get runningMethod(): RunningMethod | undefined {
    return this.processApiService.runningMethod;
  }

  get queryParams(): ApiQueryParams {
    return this.processApiService.queryParams;
  }

  isCorrectStep(): boolean {
    return this.processApiService.isCorrectStep();
  }
}
