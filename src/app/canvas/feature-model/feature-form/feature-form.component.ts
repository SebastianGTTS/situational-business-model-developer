import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Feature } from '../../../canvas-meta-model/feature';

@Component({
  selector: 'app-feature-form',
  templateUrl: './feature-form.component.html',
  styleUrls: ['./feature-form.component.css'],
})
export class FeatureFormComponent implements OnInit, OnChanges {
  @Input() feature: Feature = null;
  @Input() featureList: { id: string; levelname: string }[];
  @Input() disabledSubfeatures: string[] = [];
  @Input() enabledSubfeatures: string[] = null;
  @Input() submitButtonText = 'Update Feature';

  @Output() submitFeatureForm = new EventEmitter<FormGroup>();

  featureForm: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    if (this.feature === null) {
      this.loadForm();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.feature) {
      this.loadForm(changes.feature.currentValue);
    }
  }

  submitForm(): void {
    this.submitFeatureForm.emit(this.featureForm);
    this.loadForm();
  }

  private loadForm(feature: Feature = null): void {
    if (feature === null) {
      if (this.featureList.length > 0) {
        feature = new Feature(
          undefined,
          { name: '' },
          undefined,
          new Feature(
            undefined,
            { name: '' },
            this.featureList[0].id,
            undefined
          )
        );
      } else {
        feature = new Feature(undefined, { name: '' }, undefined, undefined);
      }
    }
    this.featureForm = this.fb.group({
      name: [feature.name, Validators.required],
      description: feature.description,
      type: feature.type,
      subfeatureConnections: feature.subfeatureConnections,
      subfeatureOf: feature.parent ? feature.parent.id : null,
    });
    if (Object.keys(feature.expertModelTrace).length > 0) {
      this.featureForm.get('subfeatureOf').disable();
    }
  }
}
