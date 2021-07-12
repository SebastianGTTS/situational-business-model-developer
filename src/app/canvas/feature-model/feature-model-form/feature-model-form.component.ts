import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FeatureModel } from '../../../canvas-meta-model/feature-model';

@Component({
  selector: 'app-feature-model-form',
  templateUrl: './feature-model-form.component.html',
  styleUrls: ['./feature-model-form.component.css']
})
export class FeatureModelFormComponent implements OnInit, OnChanges {

  @Input() featureModel: FeatureModel = null;

  @Output() submitFeatureModelForm = new EventEmitter<FormGroup>();

  featureModelForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    description: '',
    version: '',
    copyright: ''
  });

  constructor(
    private fb: FormBuilder,
  ) {
  }

  ngOnInit() {
    if (this.featureModel === null) {
      this.loadForm();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.featureModel) {
      this.loadForm(changes.featureModel.currentValue);
    }
  }

  submitForm() {
    this.submitFeatureModelForm.emit(this.featureModelForm);
    this.loadForm();
  }

  private loadForm(featureModel: FeatureModel = null) {
    if (featureModel === null) {
      featureModel = new FeatureModel({}, null);
    }
    this.featureModelForm.patchValue(featureModel);
  }

}
