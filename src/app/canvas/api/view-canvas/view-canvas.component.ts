import { Component, OnDestroy, OnInit } from '@angular/core';
import { ProcessApiService } from '../process-api.service';
import { CompanyModel } from '../../../canvas-meta-model/company-model';
import { Instance } from '../../../canvas-meta-model/instance';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { CompanyModelService } from '../../../canvas-meta-model/company-model.service';
import { CanvasResolveService } from '../../canvas-resolve.service';

@Component({
  selector: 'app-view-canvas',
  templateUrl: './view-canvas.component.html',
  styleUrls: ['./view-canvas.component.css']
})
export class ViewCanvasComponent implements OnInit, OnDestroy {

  companyModel: CompanyModel;
  instance: Instance;

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
      this.loadInstance(paramMap.get('companyModelId'), +paramMap.get('instanceId')).then();
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
    this.canvasResolveService.resolveEditCanvas(this.processApiService.stepInfo, this.companyModel._id, this.instance.id);
  }

  async loadInstance(companyModelId: string, instanceId: number) {
    this.companyModel = await this.companyModelService.get(companyModelId);
    this.instance = this.companyModel.getInstance(instanceId);
  }

}
