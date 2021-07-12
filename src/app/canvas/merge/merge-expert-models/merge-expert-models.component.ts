import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { FeatureModel } from '../../../canvas-meta-model/feature-model';
import { MergeService } from '../merge.service';
import { ExpertModelService } from '../../../canvas-meta-model/expert-model.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-merge-expert-models',
  templateUrl: './merge-expert-models.component.html',
  styleUrls: ['./merge-expert-models.component.css']
})
export class MergeExpertModelsComponent implements OnInit, OnDestroy {

  companyModelId: string;

  selectedExpertModelList: FeatureModel[];
  selectedExpertModelForm = this.fb.group({expertModelId: [null, Validators.required]});
  unselectedExpertModelList: FeatureModel[];

  private routeSubscription: Subscription;

  constructor(
    private expertModelService: ExpertModelService,
    private fb: FormBuilder,
    private mergeService: MergeService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
  }

  ngOnInit() {
    this.routeSubscription = this.route.paramMap.subscribe((paramMap) => {
      this.companyModelId = paramMap.get('companyModelId');
      this.loadExpertModels(this.companyModelId);
    });
  }

  ngOnDestroy() {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

  async selectExpertModel() {
    await this.mergeService.selectExpertModel(this.companyModelId, this.selectedExpertModelForm.value.expertModelId);
    this.selectedExpertModelForm.reset();
    this.loadExpertModels(this.companyModelId);
  }

  async unselectExpertModel(expertModelId: string) {
    await this.mergeService.unselectExpertModel(this.companyModelId, expertModelId);
    this.loadExpertModels(this.companyModelId);
  }

  viewExpertModel(expertModelId: string): void {
    this.router.navigate(['/expertModels', expertModelId]);
  }

  mergeExpertModel(expertModelId: string): void {
    this.router.navigate(['/merge', this.companyModelId, expertModelId]);
  }

  private loadExpertModels(companyModelId: string) {
    this.loadSelectedExpertModels(companyModelId);
    this.loadUnselectedExpertModels(companyModelId);
  }

  private async loadSelectedExpertModels(companyModelId: string) {
    const result = await this.mergeService.getSelectedExpertModels(companyModelId);
    this.selectedExpertModelList = result.docs;
  }

  private async loadUnselectedExpertModels(companyModelId: string) {
    const result = await this.mergeService.getUnselectedExpertModels(companyModelId);
    this.unselectedExpertModelList = result.docs;
  }

}
