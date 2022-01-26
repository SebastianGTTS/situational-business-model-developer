import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MergeService } from '../merge.service';
import { ExpertModelService } from '../../../canvas-meta-model/expert-model.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ExpertModelEntry } from '../../../canvas-meta-model/expert-model';

@Component({
  selector: 'app-merge-expert-models',
  templateUrl: './merge-expert-models.component.html',
  styleUrls: ['./merge-expert-models.component.css'],
})
export class MergeExpertModelsComponent implements OnInit, OnDestroy {
  companyModelId: string;

  selectedExpertModelList: ExpertModelEntry[];
  selectedExpertModelForm = this.fb.group({
    expertModelId: [null, Validators.required],
  });
  unselectedExpertModelList: ExpertModelEntry[];

  private routeSubscription: Subscription;

  constructor(
    private expertModelService: ExpertModelService,
    private fb: FormBuilder,
    private mergeService: MergeService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.routeSubscription = this.route.paramMap.subscribe((paramMap) => {
      this.companyModelId = paramMap.get('companyModelId');
      void this.loadExpertModels(this.companyModelId);
    });
  }

  ngOnDestroy(): void {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

  async selectExpertModel(): Promise<void> {
    await this.mergeService.selectExpertModel(
      this.companyModelId,
      this.selectedExpertModelForm.value.expertModelId
    );
    this.selectedExpertModelForm.reset();
    await this.loadExpertModels(this.companyModelId);
  }

  async unselectExpertModel(expertModelId: string): Promise<void> {
    await this.mergeService.unselectExpertModel(
      this.companyModelId,
      expertModelId
    );
    await this.loadExpertModels(this.companyModelId);
  }

  async viewExpertModel(expertModelId: string): Promise<void> {
    await this.router.navigate(['/expertModels', expertModelId]);
  }

  async mergeExpertModel(expertModelId: string): Promise<void> {
    void this.router.navigate(['/merge', this.companyModelId, expertModelId]);
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
    this.unselectedExpertModelList =
      await this.mergeService.getUnselectedExpertModels(companyModelId);
  }
}
