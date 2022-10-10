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
import { Feature, FeatureType } from '../../../canvas-meta-model/feature';

@Component({
  selector: 'app-feature-form',
  templateUrl: './feature-form.component.html',
  styleUrls: ['./feature-form.component.css'],
})
export class FeatureFormComponent implements OnInit, OnChanges {
  @Input() feature?: Feature;
  @Input() featureList!: { id: string; levelname: string }[];
  @Input() disabledSubfeatures: string[] = [];
  @Input() enabledSubfeatures?: string[];
  @Input() submitButtonText = 'Update Feature';

  @Output() submitFeatureForm = new EventEmitter<FormGroup>();

  featureForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    description: '',
    type: FeatureType.OPTIONAL,
    subfeatureConnections: undefined,
    subfeatureOf: [undefined, Validators.required],
  });

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    if (this.feature == null) {
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

  private loadForm(feature?: Feature): void {
    this.featureForm = this.fb.group({
      name: [feature?.name ?? '', Validators.required],
      description: feature?.description ?? '',
      type: feature?.type ?? FeatureType.OPTIONAL,
      subfeatureConnections: feature?.subfeatureConnections ?? undefined,
      subfeatureOf: [
        feature?.parent ? feature.parent.id : this.featureList[0]?.id,
        Validators.required,
      ],
    });
    if (Object.keys(feature?.expertModelTrace ?? {}).length > 0) {
      this.featureForm.get('subfeatureOf')?.disable();
    }
  }
}
