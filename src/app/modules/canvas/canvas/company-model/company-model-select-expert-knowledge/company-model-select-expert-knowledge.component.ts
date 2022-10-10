import { Component, OnDestroy, OnInit } from '@angular/core';
import { CompanyModel } from '../../../canvas-meta-model/company-model';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { CompanyModelService } from '../../../canvas-meta-model/company-model.service';
import { BmProcess } from '../../../../../development-process-registry/bm-process/bm-process';
import { BmProcessService } from '../../../../../development-process-registry/bm-process/bm-process.service';
import { MergeService } from '../../merge/merge.service';
import { FormBuilder, Validators } from '@angular/forms';
import { ExpertModelEntry } from '../../../canvas-meta-model/expert-model';
import { RunningProcessService } from '../../../../../development-process-registry/running-process/running-process.service';
import { Domain } from '../../../../../development-process-registry/knowledge/domain';
import { RunningProcess } from '../../../../../development-process-registry/running-process/running-process';

@Component({
  selector: 'app-company-model-select-expert-knowledge',
  templateUrl: './company-model-select-expert-knowledge.component.html',
  styleUrls: ['./company-model-select-expert-knowledge.component.css'],
})
export class CompanyModelSelectExpertKnowledgeComponent
  implements OnInit, OnDestroy
{
  companyModel?: CompanyModel;
  bmProcess?: BmProcess;
  runningProcess?: RunningProcess;

  selectedExpertModelForm = this.fb.group({
    expertModelId: [null, Validators.required],
  });
  selectedExpertModelList?: ExpertModelEntry[];
  unselectedExpertModelList: ExpertModelEntry[] = [];

  private querySubscription?: Subscription;
  private routeSubscription?: Subscription;

  constructor(
    private bmProcessService: BmProcessService,
    private companyModelService: CompanyModelService,
    private fb: FormBuilder,
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
    this.routeSubscription = this.route.paramMap.subscribe((paramMap) => {
      const companyModelId = paramMap.get('id');
      if (companyModelId != null) {
        void this.loadCompanyModel(companyModelId);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.querySubscription != null) {
      this.querySubscription.unsubscribe();
    }
    if (this.routeSubscription != null) {
      this.routeSubscription.unsubscribe();
    }
  }

  async loadCompanyModel(companyModelId: string): Promise<void> {
    this.companyModel = await this.companyModelService.get(companyModelId);
    await this.loadExpertModels(companyModelId);
  }

  async loadBmProcess(bmProcessId: string): Promise<void> {
    this.bmProcess = await this.bmProcessService.get(bmProcessId);
  }

  async loadRunningProcess(runningProcessId: string): Promise<void> {
    this.runningProcess = await this.runningProcessService.get(
      runningProcessId
    );
  }

  async mergeExpertModel(expertModelId: string): Promise<void> {
    if (this.companyModel != null) {
      await this.router.navigate(
        ['/merge', this.companyModel._id, expertModelId],
        {
          queryParams: {
            bmProcessId: this.bmProcess?._id,
            runningProcessId: this.runningProcess?._id,
          },
        }
      );
    }
  }

  async selectExpertModel(): Promise<void> {
    if (this.companyModel != null) {
      await this.mergeService.selectExpertModel(
        this.companyModel._id,
        this.selectedExpertModelForm.value.expertModelId
      );
      this.selectedExpertModelForm.reset();
      await this.loadExpertModels(this.companyModel._id);
    }
  }

  async unselectExpertModel(expertModelId: string): Promise<void> {
    if (this.companyModel != null) {
      await this.mergeService.unselectExpertModel(
        this.companyModel._id,
        expertModelId
      );
      await this.loadExpertModels(this.companyModel._id);
    }
  }

  private async loadExpertModels(companyModelId: string): Promise<void> {
    await this.loadSelectedExpertModels(companyModelId);
    await this.loadUnselectedExpertModels(companyModelId);
  }

  private async loadSelectedExpertModels(
    companyModelId: string
  ): Promise<void> {
    this.selectedExpertModelList =
      await this.mergeService.getSelectedExpertModels(companyModelId);
  }

  private async loadUnselectedExpertModels(
    companyModelId: string
  ): Promise<void> {
    const result = await this.mergeService.getUnselectedExpertModels(
      companyModelId
    );
    if (this.domains.length > 0) {
      this.unselectedExpertModelList = result.filter((model) =>
        model.domains
          ? model.domains.some((domain) =>
              this.domains.some((d) => d._id === domain._id)
            )
          : false
      );
    } else {
      this.unselectedExpertModelList = result;
    }
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
}
