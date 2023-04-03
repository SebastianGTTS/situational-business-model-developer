import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CompanyModel } from '../../../canvas-meta-artifact/company-model';
import { ExpertModelEntry } from '../../../canvas-meta-artifact/expert-model';
import { DbId } from '../../../../../database/database-entry';
import { FormBuilder, Validators } from '@angular/forms';
import { MergeService } from '../../merge/merge.service';
import { Domain } from '../../../../../development-process-registry/knowledge/domain';

@Component({
  selector: 'app-company-model-merge-edit',
  templateUrl: './company-model-merge-edit.component.html',
  styleUrls: ['./company-model-merge-edit.component.scss'],
})
export class CompanyModelMergeEditComponent implements OnChanges {
  @Input() showView = true;
  @Input() companyModel!: CompanyModel;
  @Input() domains?: Domain[];

  selectedExpertModelList?: ExpertModelEntry[];
  selectedExpertModelForm = this.fb.group({
    expertModelId: this.fb.control<DbId | null>(null, Validators.required),
  });
  unselectedExpertModelList: ExpertModelEntry[] = [];

  constructor(private fb: FormBuilder, private mergeService: MergeService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.companyModel) {
      void this.loadExpertModels(this.companyModel._id);
    }
  }

  async selectExpertModel(): Promise<void> {
    const expertModelId = this.selectedExpertModelForm.value.expertModelId;
    if (expertModelId != null) {
      await this.mergeService.selectExpertModel(
        this.companyModel._id,
        expertModelId
      );
      this.selectedExpertModelForm.reset();
    }
  }

  async unselectExpertModel(expertModelId: string): Promise<void> {
    await this.mergeService.unselectExpertModel(
      this.companyModel._id,
      expertModelId
    );
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
      await this.mergeService.getUnselectedExpertModels(
        companyModelId,
        this.domains
      );
  }
}
