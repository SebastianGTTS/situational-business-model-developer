import { Component, OnDestroy, OnInit } from '@angular/core';
import { CompanyModelLoaderService } from '../company-model-loader.service';
import { CompanyModel } from '../../../canvas-meta-artifact/company-model';
import { ExpertModelEntry } from '../../../canvas-meta-artifact/expert-model';
import { MergeService } from '../../merge/merge.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-company-model-overview',
  templateUrl: './company-model-overview.component.html',
  styleUrls: ['./company-model-overview.component.scss'],
})
export class CompanyModelOverviewComponent implements OnInit, OnDestroy {
  selectedExpertModelList: ExpertModelEntry[] = [];

  private subscription?: Subscription;

  constructor(
    private companyModelLoaderService: CompanyModelLoaderService,
    private mergeService: MergeService
  ) {}

  ngOnInit(): void {
    this.subscription = this.companyModelLoaderService.loaded.subscribe(() =>
      this.loadSelectedExpertModels()
    );
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  /**
   * Load all selected expert models
   */
  private async loadSelectedExpertModels(): Promise<void> {
    if (this.companyModel != null) {
      this.selectedExpertModelList =
        await this.mergeService.getSelectedExpertModels(this.companyModel._id);
    } else {
      this.selectedExpertModelList = [];
    }
  }

  get companyModel(): CompanyModel | undefined {
    return this.companyModelLoaderService.companyModel;
  }
}
