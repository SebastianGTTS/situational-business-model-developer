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
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FeatureModel } from '../../../canvas-meta-model/feature-model';
import { Subscription } from 'rxjs';
import { debounceTime, tap } from 'rxjs/operators';

interface FeatureModelFormValues {
  name: string;
  description: string;
  version?: string;
  copyright: string;
}

@Component({
  selector: 'app-feature-model-form',
  templateUrl: './feature-model-form.component.html',
  styleUrls: ['./feature-model-form.component.css'],
})
export class FeatureModelFormComponent implements OnInit, OnChanges, OnDestroy {
  @Input() featureModel: FeatureModel = null;

  @Output() submitFeatureModelForm = new EventEmitter<FormGroup>();

  featureModelForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    description: '',
    version: '',
    copyright: '',
  });
  changed = false;

  private changeSubscription: Subscription;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.changeSubscription = this.featureModelForm.valueChanges
      .pipe(
        debounceTime(300),
        tap(
          (value) =>
            (this.changed =
              this.featureModel != null &&
              !this.equals(this.featureModel, value))
        )
      )
      .subscribe();
    if (this.featureModel === null) {
      this.loadForm();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.featureModel) {
      const oldFeatureModel: FeatureModel = changes.featureModel.previousValue;
      const newFeatureModel: FeatureModel = changes.featureModel.currentValue;
      if (!this.equals(oldFeatureModel, newFeatureModel)) {
        this.loadForm(newFeatureModel);
      }
    }
  }

  ngOnDestroy(): void {
    if (this.changeSubscription) {
      this.changeSubscription.unsubscribe();
    }
  }

  submitForm(): void {
    this.submitFeatureModelForm.emit(this.featureModelForm);
    this.loadForm();
  }

  private equals(
    featureModelA: FeatureModelFormValues,
    featureModelB: FeatureModelFormValues
  ): boolean {
    if (featureModelA == null && featureModelB == null) {
      return true;
    }
    if (featureModelA == null || featureModelB == null) {
      return false;
    }
    if (
      featureModelA.name !== featureModelB.name ||
      featureModelA.description !== featureModelB.description ||
      featureModelA.copyright !== featureModelB.copyright
    ) {
      return false;
    }
    if (
      featureModelA.version === undefined ||
      featureModelB.version === undefined
    ) {
      return true;
    }
    return featureModelA.version === featureModelB.version;
  }

  private loadForm(featureModel: FeatureModel = undefined): void {
    if (featureModel == null) {
      this.featureModelForm.reset();
    } else {
      this.featureModelForm.patchValue(featureModel);
    }
  }
}
