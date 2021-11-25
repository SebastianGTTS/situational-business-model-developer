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
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { CompanyModel } from '../../../canvas-meta-model/company-model';
import { ExpertModel } from '../../../canvas-meta-model/expert-model';
import { ExpertModelService } from '../../../canvas-meta-model/expert-model.service';
import { Instance } from '../../../canvas-meta-model/instance';
import { Subscription } from 'rxjs';
import { FeatureModel } from '../../../canvas-meta-model/feature-model';

@Component({
  selector: 'app-instance-compare-form',
  templateUrl: './instance-compare-form.component.html',
  styleUrls: ['./instance-compare-form.component.css'],
})
export class InstanceCompareFormComponent
  implements OnInit, OnChanges, OnDestroy
{
  @Input() currentlyComparing = false;
  @Input() companyModel: CompanyModel;
  @Input() competitors: Instance[];

  @Output() compare = new EventEmitter<{
    instance: Instance;
    featureModelId: string;
  }>();
  @Output() clearCompare = new EventEmitter<void>();

  expertModels: ExpertModel[];
  currentExpertModel: ExpertModel;

  selectOtherInstanceForm: FormGroup = this.fb.group({
    featureModel: [null, Validators.required],
    instance: [null, Validators.required],
  });

  private formSubscription: Subscription;

  constructor(
    private fb: FormBuilder,
    private expertModelService: ExpertModelService
  ) {}

  ngOnInit() {
    this.formSubscription = this.featureModelControl.valueChanges.subscribe(
      (value) => {
        this.currentExpertModel = this.expertModels.find(
          (expertModel) => expertModel._id === value
        );
      }
    );
  }

  ngOnChanges(changes: SimpleChanges) {
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

  ngOnDestroy() {
    if (this.formSubscription) {
      this.formSubscription.unsubscribe();
    }
  }

  submit() {
    const featureModel: FeatureModel = this.currentExpertModel
      ? this.currentExpertModel
      : this.companyModel;
    this.compare.emit({
      instance: featureModel.getInstance(this.instanceControl.value),
      featureModelId: featureModel._id,
    });
  }

  async loadExpertModels() {
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

  get featureModelControl(): FormControl {
    return this.selectOtherInstanceForm.get('featureModel') as FormControl;
  }

  get instanceControl(): FormControl {
    return this.selectOtherInstanceForm.get('instance') as FormControl;
  }
}
