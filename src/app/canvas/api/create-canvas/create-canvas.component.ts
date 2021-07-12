import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FeatureModelInstanceFormService } from '../../form-services/feature-model-instance-form.service';
import { ActivatedRoute } from '@angular/router';
import { Instance } from '../../../canvas-meta-model/instance';
import { CompanyModelService } from '../../../canvas-meta-model/company-model.service';
import { CanvasResolveService } from '../../canvas-resolve.service';
import { ProcessApiService } from '../process-api.service';

@Component({
  selector: 'app-create-canvas',
  templateUrl: './create-canvas.component.html',
  styleUrls: ['./create-canvas.component.css']
})
export class CreateCanvasComponent implements OnInit, OnDestroy {

  form: FormGroup;

  constructor(
    private canvasResolveService: CanvasResolveService,
    private companyModelService: CompanyModelService,
    private featureModelInstanceFormService: FeatureModelInstanceFormService,
    public processApiService: ProcessApiService,
    private route: ActivatedRoute,
  ) {
  }

  ngOnInit() {
    this.processApiService.init(this.route);
    this.form = this.featureModelInstanceFormService.createForm();
  }

  ngOnDestroy() {
    this.processApiService.destroy();
  }

  async submit() {
    if (this.processApiService.stepInfo) {
      const runningMethod = this.processApiService.runningMethod;
      const companyModel = await this.companyModelService.get(
        runningMethod.decision.stepDecisions[runningMethod.currentStepNumber].companyModelId
      );
      const instance: Partial<Instance> = this.featureModelInstanceFormService.get(this.form.value);
      const instanceId = companyModel.addInstance(instance).id;
      companyModel.resetDatabaseState();
      companyModel.createdByMethod = true;
      const {id} = await this.companyModelService.save(companyModel);
      this.canvasResolveService.resolveCreateCanvas(this.processApiService.stepInfo, id, instanceId);
    }
  }

}
