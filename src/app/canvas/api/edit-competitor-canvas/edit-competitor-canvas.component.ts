import { Component, OnDestroy, OnInit } from '@angular/core';
import { ProcessApiService } from '../process-api.service';
import { ActivatedRoute } from '@angular/router';
import { CompanyModel } from '../../../canvas-meta-model/company-model';
import { CompanyModelService } from '../../../canvas-meta-model/company-model.service';
import { Instance } from '../../../canvas-meta-model/instance';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-edit-competitor-canvas',
  templateUrl: './edit-competitor-canvas.component.html',
  styleUrls: ['./edit-competitor-canvas.component.css']
})
export class EditCompetitorCanvasComponent implements OnInit, OnDestroy {

  companyModel: CompanyModel;
  instanceId: number;
  competitor: Instance;

  private routeSubscription: Subscription;

  constructor(
    private companyModelService: CompanyModelService,
    public processApiService: ProcessApiService,
    private route: ActivatedRoute,
  ) {
  }

  ngOnInit() {
    this.routeSubscription = this.route.paramMap.subscribe((paramMap) => {
      this.instanceId = +paramMap.get('instanceId');
      this.loadCompetitor(paramMap.get('companyModelId'), +paramMap.get('competitorId')).then();
    });
    this.processApiService.init(this.route);
  }

  ngOnDestroy() {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
    this.processApiService.destroy();
  }

  private async loadCompetitor(companyModelId: string, competitorId: number) {
    this.companyModel = await this.companyModelService.get(companyModelId);
    this.competitor = this.companyModel.getInstance(competitorId);
  }

  async updateCompetitor() {
    await this.companyModelService.save(this.companyModel);
    await this.loadCompetitor(this.companyModel._id, this.competitor.id);
  }

}
