import { Component, OnDestroy, OnInit } from '@angular/core';
import { RunningProcessService } from '../../../development-process-registry/running-process/running-process.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { CompanyModel } from '../../../canvas-meta-model/company-model';
import { CompanyModelService } from '../../../canvas-meta-model/company-model.service';
import { Instance } from '../../../canvas-meta-model/instance';
import { CanvasResolveService } from '../../canvas-resolve.service';
import { ConformanceReport } from '../../../canvas-meta-model/conformance-report';
import { CanvasModelConsistencyService } from '../../../canvas-meta-model/canvas-model-consistency.service';
import { ProcessApiService } from '../process-api.service';

@Component({
  selector: 'app-edit-canvas',
  templateUrl: './edit-canvas.component.html',
  styleUrls: ['./edit-canvas.component.css']
})
export class EditCanvasComponent implements OnInit, OnDestroy {

  companyModel: CompanyModel;
  instance: Instance;

  conformanceIsChecked: boolean;
  conformance: ConformanceReport;

  private routeSubscription: Subscription;

  constructor(
    private canvasModelConsistencyService: CanvasModelConsistencyService,
    private canvasResolveService: CanvasResolveService,
    private companyModelService: CompanyModelService,
    public processApiService: ProcessApiService,
    private runningProcessService: RunningProcessService,
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

  uncheckConformance() {
    this.conformanceIsChecked = false;
    this.conformance = new ConformanceReport();
  }

  checkConformance() {
    this.conformance = this.canvasModelConsistencyService.checkConformanceOfInstance(
      this.companyModel,
      this.instance.id,
      [],
    );
    this.conformanceIsChecked = true;
  }

  finish() {
    this.canvasResolveService.resolveEditCanvas(this.processApiService.stepInfo, this.companyModel._id, this.instance.id);
  }

  async updateCompanyModel() {
    await this.companyModelService.save(this.companyModel);
    await this.loadInstance(this.companyModel._id, this.instance.id);
  }

  async loadInstance(companyModelId: string, instanceId: number) {
    this.companyModel = await this.companyModelService.get(companyModelId);
    this.instance = this.companyModel.getInstance(instanceId);
    if (this.conformanceIsChecked) {
      this.checkConformance();
    } else {
      this.uncheckConformance();
    }
  }
}
