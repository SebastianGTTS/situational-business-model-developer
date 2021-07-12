import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Instance } from '../../../canvas-meta-model/instance';
import { ExpertModel } from '../../../canvas-meta-model/expert-model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-instance-select-pattern-form',
  templateUrl: './instance-select-pattern-form.component.html',
  styleUrls: ['./instance-select-pattern-form.component.css']
})
export class InstanceSelectPatternFormComponent implements OnInit, OnChanges, OnDestroy {

  @Input() expertModels: ExpertModel[] = [];
  @Input() showsPattern = false;

  @Output() showPattern = new EventEmitter<{ instance: Instance, featureModelId: string }>();
  @Output() clearPattern = new EventEmitter<void>();

  selectPatternForm: FormGroup = this.fb.group({
    featureModel: [null, Validators.required],
    instance: [null, Validators.required],
  });

  expertModel: ExpertModel;

  private formSubscription: Subscription;

  constructor(
    private fb: FormBuilder,
  ) {
  }

  ngOnInit() {
    this.formSubscription = this.featureModelControl.valueChanges.subscribe((value) => {
      this.expertModel = this.expertModels.find((expertModel) => expertModel._id === value);
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.showsPattern) {
      if (changes.showsPattern.currentValue) {
        this.selectPatternForm.disable();
      } else {
        this.selectPatternForm.enable();
      }
    }
  }

  ngOnDestroy() {
    if (this.formSubscription) {
      this.formSubscription.unsubscribe();
    }
  }

  submit() {
    this.showPattern.emit({
      instance: this.expertModel.getInstance(this.instanceControl.value),
      featureModelId: this.expertModel._id,
    });
  }

  get featureModelControl(): FormControl {
    return this.selectPatternForm.get('featureModel') as FormControl;
  }

  get instanceControl(): FormControl {
    return this.selectPatternForm.get('instance') as FormControl;
  }

}
