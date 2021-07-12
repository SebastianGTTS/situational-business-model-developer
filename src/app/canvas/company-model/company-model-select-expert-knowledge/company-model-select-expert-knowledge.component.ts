import { Component, OnDestroy, OnInit } from '@angular/core';
import { CompanyModel } from '../../../canvas-meta-model/company-model';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { CompanyModelService } from '../../../canvas-meta-model/company-model.service';
import { BmProcess } from '../../../development-process-registry/bm-process/bm-process';
import { BmProcessService } from '../../../development-process-registry/bm-process/bm-process.service';
import { MergeService } from '../../merge/merge.service';
import { FormBuilder, Validators } from '@angular/forms';
import { ExpertModel } from '../../../canvas-meta-model/expert-model';

@Component({
  selector: 'app-company-model-select-expert-knowledge',
  templateUrl: './company-model-select-expert-knowledge.component.html',
  styleUrls: ['./company-model-select-expert-knowledge.component.css']
})
export class CompanyModelSelectExpertKnowledgeComponent implements OnInit, OnDestroy {

  companyModel: CompanyModel;
  bmProcess: BmProcess;

  selectedExpertModelForm = this.fb.group({expertModelId: [null, Validators.required]});
  selectedExpertModelList: ExpertModel[];
  unselectedExpertModelList: ExpertModel[];

  private querySubscription: Subscription;
  private routeSubscription: Subscription;

  constructor(
    private bmProcessService: BmProcessService,
    private companyModelService: CompanyModelService,
    private fb: FormBuilder,
    private mergeService: MergeService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
  }

  ngOnInit() {
    this.querySubscription = this.route.queryParamMap.subscribe((paramMap) => {
      this.loadBmProcess(paramMap.get('bmProcessId')).then();
    });
    this.routeSubscription = this.route.paramMap.subscribe((paramMap) => {
      this.loadCompanyModel(paramMap.get('id')).then();
    });
  }

  ngOnDestroy() {
    if (this.querySubscription) {
      this.querySubscription.unsubscribe();
    }
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

  async loadCompanyModel(companyModelId: string) {
    this.companyModel = await this.companyModelService.get(companyModelId);
    await this.loadExpertModels(companyModelId);
  }

  async loadBmProcess(bmProcessId: string) {
    this.bmProcess = await this.bmProcessService.getBmProcess(bmProcessId);
  }

  mergeExpertModel(expertModelId: string): void {
    this.router.navigate(['/merge', this.companyModel._id, expertModelId]).then();
  }

  async selectExpertModel() {
    await this.mergeService.selectExpertModel(this.companyModel._id, this.selectedExpertModelForm.value.expertModelId);
    this.selectedExpertModelForm.reset();
    await this.loadExpertModels(this.companyModel._id);
  }

  async unselectExpertModel(expertModelId: string) {
    await this.mergeService.unselectExpertModel(this.companyModel._id, expertModelId);
    await this.loadExpertModels(this.companyModel._id);
  }

  private async loadExpertModels(companyModelId: string) {
    await this.loadSelectedExpertModels(companyModelId);
    await this.loadUnselectedExpertModels(companyModelId);
  }

  private async loadSelectedExpertModels(companyModelId: string) {
    const result = await this.mergeService.getSelectedExpertModels(companyModelId);
    this.selectedExpertModelList = result.docs;
  }

  private async loadUnselectedExpertModels(companyModelId: string) {
    const result = await this.mergeService.getUnselectedExpertModels(companyModelId);
    if (this.bmProcess.domains.length > 0) {
      this.unselectedExpertModelList = result.docs.filter(
        (model) => model.domains ? model.domains.some((domain) => this.bmProcess.domains.includes(domain)) : false
      );
    } else {
      this.unselectedExpertModelList = result.docs;
    }
  }

}
