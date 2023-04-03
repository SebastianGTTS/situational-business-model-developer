import { Component, OnDestroy, OnInit } from '@angular/core';
import { ProcessApiService } from '../../../../../development-process-registry/module-api/process-api.service';
import { ActivatedRoute } from '@angular/router';
import {
  UntypedFormArray,
  UntypedFormBuilder,
  UntypedFormGroup,
} from '@angular/forms';
import { InstanceInit } from '../../../canvas-meta-artifact/instance';
import { CompanyModelService } from '../../../canvas-meta-artifact/company-model.service';
import { FeatureModelInstanceFormService } from '../../form-services/feature-model-instance-form.service';
import { Subscription } from 'rxjs';
import { CompanyModel } from '../../../canvas-meta-artifact/company-model';
import { CanvasToolResolveService } from '../../canvas-tool-resolve.service';
import { RunningProcess } from '../../../../../development-process-registry/running-process/running-process';
import { RunningMethod } from '../../../../../development-process-registry/running-process/running-method';

@Component({
  selector: 'app-create-competitor-canvas',
  templateUrl: './create-competitor-canvas.component.html',
  styleUrls: ['./create-competitor-canvas.component.css'],
  providers: [ProcessApiService],
})
export class CreateCompetitorCanvasComponent implements OnInit, OnDestroy {
  companyModel?: CompanyModel;
  instanceId?: number;

  form: UntypedFormGroup = this.fb.group({
    competitors: this.fb.array([]),
  });

  private routeSubscription?: Subscription;

  constructor(
    private canvasResolveService: CanvasToolResolveService,
    private companyModelService: CompanyModelService,
    private fb: UntypedFormBuilder,
    private featureModelInstanceFormService: FeatureModelInstanceFormService,
    private processApiService: ProcessApiService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.routeSubscription = this.route.paramMap.subscribe((paramMap) => {
      const instanceId = paramMap.get('instanceId');
      this.instanceId = instanceId ? +instanceId : undefined;
      const companyModel = paramMap.get('companyModelId');
      if (companyModel != null) {
        void this.loadCompanyModel(companyModel);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.routeSubscription != null) {
      this.routeSubscription.unsubscribe();
    }
  }

  addCompetitor(): void {
    this.formArray.push(this.featureModelInstanceFormService.createForm());
  }

  removeCompetitor(index: number): void {
    this.formArray.removeAt(index);
  }

  async submit(): Promise<void> {
    if (
      this.processApiService.stepInfo &&
      this.companyModel != null &&
      this.instanceId != null
    ) {
      const companyModel = this.companyModel;
      for (const control of this.formArray.controls) {
        const instance: Omit<InstanceInit, 'id'> =
          this.featureModelInstanceFormService.get(control.value);
        companyModel.addInstance(instance);
      }
      await this.companyModelService.save(companyModel);
      this.canvasResolveService.resolveEditCanvas(
        this.processApiService.stepInfo,
        this.companyModel._id,
        this.instanceId
      );
    }
  }

  get formArray(): UntypedFormArray {
    return this.form.get('competitors') as UntypedFormArray;
  }

  private async loadCompanyModel(companyModelId: string): Promise<void> {
    this.companyModel = await this.companyModelService.get(companyModelId);
  }

  get runningProcess(): RunningProcess | undefined {
    return this.processApiService.runningProcess;
  }

  get runningMethod(): RunningMethod | undefined {
    return this.processApiService.runningMethod;
  }

  get isCorrectStep(): boolean {
    return this.processApiService.isCorrectStep();
  }
}
