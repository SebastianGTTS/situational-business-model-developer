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
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { FeatureModel } from '../../../canvas-meta-artifact/feature-model';
import { Subscription } from 'rxjs';
import { debounceTime, tap } from 'rxjs/operators';
import { UPDATABLE, Updatable } from '../../../../../shared/updatable';

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
  providers: [{ provide: UPDATABLE, useExisting: FeatureModelFormComponent }],
})
export class FeatureModelFormComponent
  implements OnInit, OnChanges, OnDestroy, Updatable
{
  @Input() featureModel?: FeatureModel;

  @Output() submitFeatureModelForm = new EventEmitter<UntypedFormGroup>();

  featureModelForm: UntypedFormGroup = this.fb.group({
    name: ['', Validators.required],
    description: '',
    version: '',
    copyright: '',
  });
  changed = false;

  private changeSubscription?: Subscription;

  constructor(private fb: UntypedFormBuilder) {}

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
    if (this.featureModel == null) {
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
    if (this.changeSubscription != null) {
      this.changeSubscription.unsubscribe();
    }
  }

  submitForm(): void {
    this.submitFeatureModelForm.emit(this.featureModelForm);
    this.loadForm();
  }

  update(): void {
    if (this.changed && this.featureModelForm.valid) {
      this.submitForm();
    }
  }

  // noinspection JSMethodCanBeStatic
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

  private loadForm(featureModel?: FeatureModel): void {
    if (featureModel == null) {
      this.featureModelForm.reset();
    } else {
      this.featureModelForm.patchValue(featureModel);
    }
  }
}
