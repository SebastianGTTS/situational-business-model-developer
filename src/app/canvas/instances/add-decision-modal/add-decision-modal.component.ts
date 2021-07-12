import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Instance } from '../../../canvas-meta-model/instance';
import { Feature } from '../../../canvas-meta-model/feature';

@Component({
  selector: 'app-add-decision-modal',
  templateUrl: './add-decision-modal.component.html',
  styleUrls: ['./add-decision-modal.component.css']
})
export class AddDecisionModalComponent {

  @Input() instance: Instance;
  @Input() feature: Feature;

  @Output() closeModal = new EventEmitter<void>();
  @Output() addBusinessModelDecision = new EventEmitter<string>();
  @Output() addFeature = new EventEmitter<Partial<Feature>>();

  addFeatureForm = this.fb.group({name: ['', Validators.required]});

  constructor(
    private fb: FormBuilder,
  ) {
  }

  submitAddFeatureForm() {
    this.addFeature.emit(this.addFeatureForm.value);
    this.addFeatureForm.reset();
  }

  get unselectedFeatures(): Feature[] {
    return Object.values(this.feature.subfeatures).filter((feature) => !this.instance.usedFeatures.includes(feature.id));
  }

}
