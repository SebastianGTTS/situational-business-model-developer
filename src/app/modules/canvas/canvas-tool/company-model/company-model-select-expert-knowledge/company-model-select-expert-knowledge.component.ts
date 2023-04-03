import { Component, OnDestroy, OnInit } from '@angular/core';
import { CompanyModel } from '../../../canvas-meta-artifact/company-model';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { CompanyModelService } from '../../../canvas-meta-artifact/company-model.service';
import { BmProcess } from '../../../../../development-process-registry/bm-process/bm-process';
import { BmProcessService } from '../../../../../development-process-registry/bm-process/bm-process.service';
import { MergeService } from '../../merge/merge.service';
import { UntypedFormBuilder } from '@angular/forms';
import { RunningProcessService } from '../../../../../development-process-registry/running-process/running-process.service';
import { Domain } from '../../../../../development-process-registry/knowledge/domain';
import { RunningProcess } from '../../../../../development-process-registry/running-process/running-process';
import { CompanyModelLoaderService } from '../company-model-loader.service';

@Component({
  selector: 'app-company-model-select-expert-knowledge',
  templateUrl: './company-model-select-expert-knowledge.component.html',
  styleUrls: ['./company-model-select-expert-knowledge.component.css'],
  providers: [CompanyModelLoaderService],
})
export class CompanyModelSelectExpertKnowledgeComponent
  implements OnInit, OnDestroy
{
  bmProcess?: BmProcess;
  runningProcess?: RunningProcess;

  private querySubscription?: Subscription;

  constructor(
    private bmProcessService: BmProcessService,
    private companyModelLoaderService: CompanyModelLoaderService,
    private companyModelService: CompanyModelService,
    private fb: UntypedFormBuilder,
    private mergeService: MergeService,
    private route: ActivatedRoute,
    private router: Router,
    private runningProcessService: RunningProcessService
  ) {}

  ngOnInit(): void {
    this.querySubscription = this.route.queryParamMap.subscribe((paramMap) => {
      const bmProcessId = paramMap.get('bmProcessId');
      if (bmProcessId != null) {
        void this.loadBmProcess(bmProcessId);
      } else {
        this.bmProcess = undefined;
      }
      const runningProcessId = paramMap.get('runningProcessId');
      if (runningProcessId != null) {
        void this.loadRunningProcess(runningProcessId);
      } else {
        this.runningProcess = undefined;
      }
    });
  }

  ngOnDestroy(): void {
    this.querySubscription?.unsubscribe();
  }

  async loadBmProcess(bmProcessId: string): Promise<void> {
    this.bmProcess = await this.bmProcessService.get(bmProcessId);
  }

  async loadRunningProcess(runningProcessId: string): Promise<void> {
    this.runningProcess = await this.runningProcessService.get(
      runningProcessId
    );
  }

  get domains(): Domain[] {
    if (this.bmProcess != null) {
      return this.bmProcess.domains;
    } else if (this.runningProcess != null) {
      return this.runningProcess.domains;
    } else {
      return [];
    }
  }

  get companyModel(): CompanyModel | undefined {
    return this.companyModelLoaderService.companyModel;
  }
}
