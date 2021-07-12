import { Component, OnDestroy, OnInit } from '@angular/core';
import { ProcessApiService } from '../process-api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CompanyModel } from '../../../canvas-meta-model/company-model';
import { Subscription } from 'rxjs';
import { CompanyModelService } from '../../../canvas-meta-model/company-model.service';
import { Instance } from '../../../canvas-meta-model/instance';
import { CanvasResolveService } from '../../canvas-resolve.service';

@Component({
  selector: 'app-edit-competitors',
  templateUrl: './edit-competitors.component.html',
  styleUrls: ['./edit-competitors.component.css']
})
export class EditCompetitorsComponent implements OnInit, OnDestroy {

  companyModel: CompanyModel;
  instanceId: number;
  competitors: Instance[];

  private routeSubscription: Subscription;

  constructor(
    private canvasResolveService: CanvasResolveService,
    private companyModelService: CompanyModelService,
    public processApiService: ProcessApiService,
    private route: ActivatedRoute,
    private router: Router,
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

  editCompetitor(id: number) {
    this.router.navigate(
      ['canvas', this.companyModel._id, 'instance', this.instanceId, 'competitors', id, 'edit'],
      {queryParams: this.processApiService.queryParams},
    ).then();
  }

  async removeCompetitor(id: number) {
    this.companyModel.removeInstance(id);
    await this.updateCompanyModel();
  }

  finish() {
    this.canvasResolveService.resolveEditCanvas(this.processApiService.stepInfo, this.companyModel._id, this.instanceId);
  }

  private async loadCompanyModel(companyModelId: string) {
    this.companyModel = await this.companyModelService.get(companyModelId);
    this.competitors = this.companyModel.instances.filter((instance) => instance.id !== this.instanceId);
  }

  private async updateCompanyModel() {
    await this.companyModelService.save(this.companyModel);
    await this.loadCompanyModel(this.companyModel._id);
  }

}
