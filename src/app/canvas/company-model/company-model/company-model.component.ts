import { Component, OnDestroy, OnInit } from '@angular/core';
import { CompanyModel } from '../../../canvas-meta-model/company-model';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { CompanyModelService } from '../../../canvas-meta-model/company-model.service';
import { ExpertModel } from '../../../canvas-meta-model/expert-model';
import { FormBuilder, Validators } from '@angular/forms';
import { MergeService } from '../../merge/merge.service';

@Component({
  selector: 'app-company-model',
  templateUrl: './company-model.component.html',
  styleUrls: ['./company-model.component.css']
})
export class CompanyModelComponent implements OnInit, OnDestroy {

  companyModel: CompanyModel;
  selectedExpertModelList: ExpertModel[];
  selectedExpertModelForm = this.fb.group({expertModelId: [null, Validators.required]});
  unselectedExpertModelList: ExpertModel[];

  private routeSubscription: Subscription;

  constructor(
    private companyModelService: CompanyModelService,
    private fb: FormBuilder,
    private mergeService: MergeService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
  }

  ngOnInit() {
    this.routeSubscription = this.route.paramMap.subscribe((paramMap) => {
      this.loadCompanyModel(paramMap.get('id')).then();
    });
  }

  ngOnDestroy() {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

  update(description: any) {
    this.companyModel.update(description);
    this.updateCompanyModel().then();
  }

  updateAuthor(authorInfo: any) {
    this.companyModel.updateAuthor(authorInfo);
    this.updateCompanyModel().then();
  }

  async updateCompanyModel() {
    await this.companyModelService.save(this.companyModel);
    this.loadCompanyModel(this.companyModel._id).then();
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

  mergeExpertModel(expertModelId: string): void {
    this.router.navigate(['/merge', this.companyModel._id, expertModelId]).then();
  }

  viewExpertModel(expertModelId: string): void {
    this.router.navigate(['/expertModels', expertModelId]).then();
  }

  async loadCompanyModel(companyModelId: string) {
    this.companyModel = await this.companyModelService.get(companyModelId);
    await this.loadExpertModels(companyModelId);
  }

  /**
   * Load selected and unselected expert models
   *
   * @param companyModelId the id of the company model
   */
  private async loadExpertModels(companyModelId: string) {
    await this.loadSelectedExpertModels(companyModelId);
    await this.loadUnselectedExpertModels(companyModelId);
  }

  /**
   * Load all selected expert models
   *
   * @param companyModelId the id of the company model
   */
  private async loadSelectedExpertModels(companyModelId: string) {
    const result = await this.mergeService.getSelectedExpertModels(companyModelId);
    this.selectedExpertModelList = result.docs;
  }

  /**
   * Load all unselected expert models
   *
   * @param companyModelId the id of the company model
   */
  private async loadUnselectedExpertModels(companyModelId: string) {
    const result = await this.mergeService.getUnselectedExpertModels(companyModelId);
    this.unselectedExpertModelList = result.docs;
  }

}
