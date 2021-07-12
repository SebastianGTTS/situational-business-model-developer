import { Component, OnDestroy, OnInit } from '@angular/core';
import { ExpertModel } from '../../../canvas-meta-model/expert-model';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ExpertModelService } from '../../../canvas-meta-model/expert-model.service';

@Component({
  selector: 'app-expert-model-edit',
  templateUrl: './expert-model-edit.component.html',
  styleUrls: ['./expert-model-edit.component.css']
})
export class ExpertModelEditComponent implements OnInit, OnDestroy {

  expertModel: ExpertModel;

  private routeSubscription: Subscription;

  constructor(
    private expertModelService: ExpertModelService,
    private route: ActivatedRoute,
  ) {
  }

  ngOnInit() {
    this.routeSubscription = this.route.paramMap.subscribe((paramMap) => {
      this.loadExpertModel(paramMap.get('id'));
    });
  }

  ngOnDestroy() {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

  async updateExpertModel() {
    await this.expertModelService.save(this.expertModel);
    this.loadExpertModel(this.expertModel._id);
  }

  async loadExpertModel(expertModelId: string) {
    this.expertModel = await this.expertModelService.get(expertModelId);
  }

}
