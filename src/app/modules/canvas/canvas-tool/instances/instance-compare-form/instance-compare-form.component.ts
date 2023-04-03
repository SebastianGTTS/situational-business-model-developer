import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { CompanyModel } from '../../../canvas-meta-artifact/company-model';
import { ExpertModel } from '../../../canvas-meta-artifact/expert-model';
import { ExpertModelService } from '../../../canvas-meta-artifact/expert-model.service';
import { Instance } from '../../../canvas-meta-artifact/instance';
import { Subscription } from 'rxjs';
import { FeatureModel } from '../../../canvas-meta-artifact/feature-model';

@Component({
  selector: 'app-instance-compare-form',
  templateUrl: './instance-compare-form.component.html',
  styleUrls: ['./instance-compare-form.component.css'],
})
export class InstanceCompareFormComponent
  implements OnInit, OnChanges, OnDestroy
{
  @Input() currentlyComparing = false;
  @Input() companyModel!: CompanyModel;
  @Input() competitors!: Instance[];

  @Output() compare = new EventEmitter<{
    instance: Instance;
    featureModelId: string;
  }>();
  @Output() clearCompare = new EventEmitter<void>();

  expertModels: ExpertModel[] = [];
  currentExpertModel?: ExpertModel;

  selectOtherInstanceForm: UntypedFormGroup = this.fb.group({
    featureModel: [null, Validators.required],
    instance: [null, Validators.required],
  });

  private formSubscription?: Subscription;

  constructor(
    private fb: UntypedFormBuilder,
    private expertModelService: ExpertModelService
  ) {}

  ngOnInit(): void {
    this.formSubscription = this.featureModelControl.valueChanges.subscribe(
      (value) => {
        this.currentExpertModel = this.expertModels.find(
          (expertModel) => expertModel._id === value
        );
      }
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.companyModel) {
      void this.loadExpertModels();
    }
    if (changes.currentlyComparing) {
      if (changes.currentlyComparing.currentValue) {
        this.selectOtherInstanceForm.disable();
      } else {
        this.selectOtherInstanceForm.enable();
      }
    }
  }

  ngOnDestroy(): void {
    if (this.formSubscription != null) {
      this.formSubscription.unsubscribe();
    }
  }

  submit(): void {
    const featureModel: FeatureModel = this.currentExpertModel
      ? this.currentExpertModel
      : this.companyModel;
    const instance = featureModel.getInstance(this.instanceControl.value);
    if (instance == null) {
      throw new Error('Instance does not exist');
    }
    this.compare.emit({
      instance,
      featureModelId: featureModel._id,
    });
  }

  async loadExpertModels(): Promise<void> {
    const expertModels: ExpertModel[] = [];
    for (const expertModelId of this.companyModel.expertModelIds) {
      const expertModel = await this.expertModelService.get(expertModelId);
      const featureIds = expertModel
        .getFeatureList()
        .map((feature) => feature.id);
      if (
        featureIds.every(
          (id) =>
            id in
            this.companyModel.expertModelTraces[expertModel._id]
              .expertFeatureIdMap
        ) &&
        expertModel.getExamples().length > 0
      ) {
        expertModels.push(expertModel);
      }
    }
    this.expertModels = expertModels;
  }

  get featureModelControl(): UntypedFormControl {
    return this.selectOtherInstanceForm.get(
      'featureModel'
    ) as UntypedFormControl;
  }

  get instanceControl(): UntypedFormControl {
    return this.selectOtherInstanceForm.get('instance') as UntypedFormControl;
  }
}
