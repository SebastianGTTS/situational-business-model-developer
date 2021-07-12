import { Component, OnDestroy, OnInit } from '@angular/core';
import { ProcessApiService } from '../process-api.service';
import { ActivatedRoute } from '@angular/router';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Instance } from '../../../canvas-meta-model/instance';
import { CompanyModelService } from '../../../canvas-meta-model/company-model.service';
import { FeatureModelInstanceFormService } from '../../form-services/feature-model-instance-form.service';
import { Subscription } from 'rxjs';
import { CompanyModel } from '../../../canvas-meta-model/company-model';
import { CanvasResolveService } from '../../canvas-resolve.service';

@Component({
  selector: 'app-create-competitor-canvas',
  templateUrl: './create-competitor-canvas.component.html',
  styleUrls: ['./create-competitor-canvas.component.css']
})
export class CreateCompetitorCanvasComponent implements OnInit, OnDestroy {

  companyModel: CompanyModel;
  instanceId: number;

  form: FormGroup = this.fb.group({
    competitors: this.fb.array([]),
  });

  private routeSubscription: Subscription;

  constructor(
    private canvasResolveService: CanvasResolveService,
    private companyModelService: CompanyModelService,
    private fb: FormBuilder,
    private featureModelInstanceFormService: FeatureModelInstanceFormService,
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

  addCompetitor() {
    this.formArray.push(this.featureModelInstanceFormService.createForm());
  }

  removeCompetitor(index: number) {
    this.formArray.removeAt(index);
  }

  async submit() {
    if (this.processApiService.stepInfo) {
      const companyModel = this.companyModel;
      for (const control of this.formArray.controls) {
        const instance: Partial<Instance> = this.featureModelInstanceFormService.get(control.value);
        companyModel.addInstance(instance);
      }
      await this.companyModelService.save(companyModel);
      this.canvasResolveService.resolveEditCanvas(this.processApiService.stepInfo, this.companyModel._id, this.instanceId);
    }
  }

  get formArray(): FormArray {
    return this.form.get('competitors') as FormArray;
  }

  private async loadCompanyModel(companyModelId: string) {
    this.companyModel = await this.companyModelService.get(companyModelId);
  }

}
