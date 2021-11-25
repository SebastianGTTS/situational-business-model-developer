import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CompanyModelService } from '../../../canvas-meta-model/company-model.service';
import { ExpertModel } from '../../../canvas-meta-model/expert-model';
import { FormBuilder, Validators } from '@angular/forms';
import { MergeService } from '../../merge/merge.service';
import { CompanyModelLoaderService } from '../company-model-loader.service';
import { CompanyModel } from '../../../canvas-meta-model/company-model';

@Component({
  selector: 'app-company-model',
  templateUrl: './company-model.component.html',
  styleUrls: ['./company-model.component.css'],
  providers: [CompanyModelLoaderService],
})
export class CompanyModelComponent implements OnInit {
  selectedExpertModelList: ExpertModel[];
  selectedExpertModelForm = this.fb.group({
    expertModelId: [null, Validators.required],
  });
  unselectedExpertModelList: ExpertModel[];

  constructor(
    private companyModelLoaderService: CompanyModelLoaderService,
    private companyModelService: CompanyModelService,
    private fb: FormBuilder,
    private mergeService: MergeService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.companyModelLoaderService.loaded.subscribe(() =>
      this.loadExpertModels(this.companyModel._id)
    );
  }

  async update(description: any) {
    await this.companyModelService.update(this.companyModel._id, description);
  }

  async updateAuthor(authorInfo: any) {
    await this.companyModelService.updateAuthor(
      this.companyModel._id,
      authorInfo
    );
  }

  async selectExpertModel() {
    await this.mergeService.selectExpertModel(
      this.companyModel._id,
      this.selectedExpertModelForm.value.expertModelId
    );
    this.selectedExpertModelForm.reset();
  }

  async unselectExpertModel(expertModelId: string) {
    await this.mergeService.unselectExpertModel(
      this.companyModel._id,
      expertModelId
    );
  }

  async mergeExpertModel(expertModelId: string): Promise<void> {
    await this.router.navigate([
      '/merge',
      this.companyModel._id,
      expertModelId,
    ]);
  }

  async viewExpertModel(expertModelId: string): Promise<void> {
    await this.router.navigate(['/expertModels', expertModelId]);
  }

  /**
   * Load selected and unselected expert models
   *
   * @param companyModelId the id of the company model
   */
  private async loadExpertModels(companyModelId: string): Promise<void> {
    await this.loadSelectedExpertModels(companyModelId);
    await this.loadUnselectedExpertModels(companyModelId);
  }

  /**
   * Load all selected expert models
   *
   * @param companyModelId the id of the company model
   */
  private async loadSelectedExpertModels(
    companyModelId: string
  ): Promise<void> {
    this.selectedExpertModelList =
      await this.mergeService.getSelectedExpertModels(companyModelId);
  }

  /**
   * Load all unselected expert models
   *
   * @param companyModelId the id of the company model
   */
  private async loadUnselectedExpertModels(
    companyModelId: string
  ): Promise<void> {
    this.unselectedExpertModelList =
      await this.mergeService.getUnselectedExpertModels(companyModelId);
  }

  get companyModel(): CompanyModel {
    return this.companyModelLoaderService.companyModel;
  }
}
