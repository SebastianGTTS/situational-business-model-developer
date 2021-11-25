import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FeatureModelInstanceFormService } from '../../form-services/feature-model-instance-form.service';
import { Instance } from '../../../canvas-meta-model/instance';
import { CompanyModelService } from '../../../canvas-meta-model/company-model.service';
import { CanvasResolveService } from '../../canvas-resolve.service';
import { ProcessApiService } from '../process-api.service';
import { RunningMethod } from '../../../development-process-registry/running-process/running-method';
import { CompanyModel } from '../../../canvas-meta-model/company-model';

@Component({
  selector: 'app-create-canvas',
  templateUrl: './create-canvas.component.html',
  styleUrls: ['./create-canvas.component.css'],
  providers: [ProcessApiService],
})
export class CreateCanvasComponent implements OnInit {
  companyModel: CompanyModel;
  form: FormGroup;

  constructor(
    private canvasResolveService: CanvasResolveService,
    private companyModelService: CompanyModelService,
    private featureModelInstanceFormService: FeatureModelInstanceFormService,
    private processApiService: ProcessApiService
  ) {}

  ngOnInit(): void {
    this.form = this.featureModelInstanceFormService.createForm();
    this.processApiService.loaded.subscribe(() => this.loadCompanyModel());
  }

  async submit(): Promise<void> {
    if (this.processApiService.stepInfo) {
      const companyModel = await this.companyModelService.get(
        this.runningMethod.decision.stepDecisions[
          this.runningMethod.currentStepNumber
        ].companyModelId
      );
      const instance: Partial<Instance> =
        this.featureModelInstanceFormService.get(this.form.value);
      const instanceId = companyModel.addInstance(instance).id;
      companyModel.resetDatabaseState();
      companyModel.createdByMethod = true;
      await this.companyModelService.save(companyModel);
      this.canvasResolveService.resolveCreateCanvas(
        this.processApiService.stepInfo,
        companyModel._id,
        instanceId
      );
    }
  }

  private async loadCompanyModel(): Promise<void> {
    this.companyModel = await this.companyModelService.get(
      this.runningMethod.decision.stepDecisions[
        this.runningMethod.currentStepNumber
      ].companyModelId
    );
  }

  get runningMethod(): RunningMethod {
    return this.processApiService.runningMethod;
  }

  isCorrectStep(): boolean {
    return this.processApiService.isCorrectStep();
  }
}
