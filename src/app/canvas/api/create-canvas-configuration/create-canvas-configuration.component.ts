import { Component, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { CompanyModelEntry } from '../../../canvas-meta-model/company-model';
import { CompanyModelService } from '../../../canvas-meta-model/company-model.service';
import { DecisionConfigurationFormComponent } from '../../../development-process-registry/module-api/decision-configuration-form-component';
import { Domain } from '../../../development-process-registry/knowledge/domain';
import {
  FeatureModelFormService,
  FeatureModelFormValue,
} from '../../form-services/feature-model-form.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CanvasDefinitionService } from '../../../canvas-meta-model/canvas-definition.service';
import { BmProcess } from '../../../development-process-registry/bm-process/bm-process';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-canvas-configuration',
  templateUrl: './create-canvas-configuration.component.html',
  styleUrls: ['./create-canvas-configuration.component.css'],
})
export class CreateCanvasConfigurationComponent
  implements OnInit, DecisionConfigurationFormComponent
{
  formGroup: FormGroup;
  bmProcess: BmProcess;
  predefinedInput: any;
  contextDomains: Domain[];
  stepDecision: any;
  forceUpdate: EventEmitter<any>;

  createForm: FormGroup;

  companyModels: CompanyModelEntry[];

  private modalReference: NgbModalRef;

  @ViewChild('createModal', { static: true }) createModal: unknown;

  constructor(
    private canvasDefinitionService: CanvasDefinitionService,
    private companyModelService: CompanyModelService,
    private fb: FormBuilder,
    private featureModelFormService: FeatureModelFormService,
    private modalService: NgbModal,
    private router: Router
  ) {}

  ngOnInit(): void {
    void this.loadCompanyModels();
    this.createForm = this.fb.group({
      featureModel: this.featureModelFormService.createForm(),
    });
  }

  openCreateCompanyModelModal(): void {
    this.modalReference = this.modalService.open(this.createModal, {
      size: 'lg',
    });
  }

  async createCompanyModel(): Promise<void> {
    const model: FeatureModelFormValue = this.featureModelFormService.get(
      this.createForm.get('featureModel').value
    );
    const canvasDefinition = await this.canvasDefinitionService.get(
      this.predefinedInput.definitionId
    );
    const companyModel = this.companyModelService.createFeatureModel(
      { ...model, $definition: canvasDefinition },
      canvasDefinition
    );
    await this.companyModelService.add(companyModel);
    this.forceUpdate.emit({
      companyModelId: companyModel._id,
      automaticCreation: true,
    });
    this.modalService.dismissAll();
    await this.router.navigate(['companyModels', companyModel._id, 'select'], {
      queryParams: {
        bmProcessId: this.bmProcess._id,
      },
    });
  }

  async navigateSelectExpertKnowledge(): Promise<void> {
    this.modalService.dismissAll();
    await this.router.navigate(
      ['companyModels', this.stepDecision.companyModelId, 'select'],
      {
        queryParams: {
          bmProcessId: this.bmProcess._id,
        },
      }
    );
  }

  private async loadCompanyModels(): Promise<void> {
    this.companyModels = await this.companyModelService.getList(
      this.predefinedInput.definitionId
    );
  }

  get companyModelIdControl(): FormControl {
    return this.formGroup.get('companyModelId') as FormControl;
  }
}
