import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CompanyModel } from '../../../canvas-meta-model/company-model';
import { Instance } from '../../../canvas-meta-model/instance';
import { CompanyModelService } from '../../../canvas-meta-model/company-model.service';
import { RunningProcessService } from '../../../development-process-registry/running-process/running-process.service';
import { ActivatedRoute } from '@angular/router';
import { ProcessApiService } from '../process-api.service';
import { CanvasResolveService } from '../../canvas-resolve.service';
import { InstanceService } from '../../instances/instance.service';

@Component({
  selector: 'app-compare',
  templateUrl: './compare.component.html',
  styleUrls: ['./compare.component.css']
})
export class CompareComponent implements OnInit, OnDestroy {

  companyModel: CompanyModel;
  instance: Instance;
  competitors: Instance[];

  expertModelId: string = null;
  compareInstance: Instance = null;
  percentages: { [id: string]: number } = null;

  private routeSubscription: Subscription;

  constructor(
    private canvasResolveService: CanvasResolveService,
    private companyModelService: CompanyModelService,
    private instanceService: InstanceService,
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

  finish() {
    this.canvasResolveService.resolveEditCanvas(this.processApiService.stepInfo, this.companyModel._id, this.instance.id);
  }

  compare(instance: Instance, modelId: string) {
    if (modelId !== this.companyModel._id) {
      this.expertModelId = modelId;
    } else {
      this.expertModelId = null;
    }
    this.compareInstance =
      this.expertModelId ?
        this.instanceService.convertExpertInstance(this.companyModel, this.expertModelId, instance) :
        instance;
    this.percentages = this.instanceService.compareInstances(this.companyModel, this.instance, this.compareInstance);
  }

  clearCompare() {
    this.expertModelId = null;
    this.compareInstance = null;
    this.percentages = null;
  }

  async updateCompanyModel() {
    await this.companyModelService.save(this.companyModel);
    await this.loadInstance(this.companyModel._id, this.instance.id);
  }

  async loadInstance(companyModelId: string, instanceId: number) {
    this.companyModel = await this.companyModelService.get(companyModelId);
    this.instance = this.companyModel.getInstance(instanceId);
    this.competitors = this.companyModel.instances.filter((instance) => instance.id !== this.instance.id);
    if (this.compareInstance) {
      this.compare(this.compareInstance, this.expertModelId);
    }
  }

}
