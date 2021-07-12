import { Component, OnDestroy, OnInit } from '@angular/core';
import { ProcessApiService } from '../process-api.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { CompanyModel } from '../../../canvas-meta-model/company-model';
import { CompanyModelService } from '../../../canvas-meta-model/company-model.service';
import { CanvasResolveService } from '../../canvas-resolve.service';

@Component({
  selector: 'app-edit-model',
  templateUrl: './edit-model.component.html',
  styleUrls: ['./edit-model.component.css']
})
export class EditModelComponent implements OnInit, OnDestroy {

  companyModel: CompanyModel;
  instanceId: number;

  private routeSubscription: Subscription;

  constructor(
    private canvasResolveService: CanvasResolveService,
    private companyModelService: CompanyModelService,
    public processApiService: ProcessApiService,
    private route: ActivatedRoute,
  ) {
  }

  ngOnInit() {
    this.routeSubscription = this.route.paramMap.subscribe((paramMap) => {
      this.instanceId = +paramMap.get('instanceId');
      this.loadCompanyModel(paramMap.get('companyModelId')).then();
    });
    this.processApiService.init(this.route);
  }

  ngOnDestroy() {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
    this.processApiService.destroy();
  }

  finish() {
    this.canvasResolveService.resolveEditCanvas(this.processApiService.stepInfo, this.companyModel._id, this.instanceId);
  }

  async updateCompanyModel() {
    await this.companyModelService.save(this.companyModel);
    await this.loadCompanyModel(this.companyModel._id);
  }

  private async loadCompanyModel(companyModelId: string) {
    this.companyModel = await this.companyModelService.get(companyModelId);
  }

}
