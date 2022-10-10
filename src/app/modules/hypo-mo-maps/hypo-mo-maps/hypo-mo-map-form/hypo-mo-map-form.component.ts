import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HypoMoMap } from '../../hypo-mo-map-meta-model/hypo-mo-map';

@Component({
  selector: 'app-hypo-mo-map-form',
  templateUrl: './hypo-mo-map-form.component.html',
  styleUrls: ['./hypo-mo-map-form.component.css'],
})
export class HypoMoMapFormComponent implements OnChanges {
  @Input() hypoMoMap?: HypoMoMap;

  @Output() submitHypoMoMapForm = new EventEmitter<FormGroup>();

  hypoMoMapForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
  });

  constructor(private fb: FormBuilder) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.hypoMoMap) {
      this.loadForm(changes.hypoMoMap.currentValue);
    }
  }

  submitForm(): void {
    this.submitHypoMoMapForm.emit(this.hypoMoMapForm);
    this.loadForm();
  }

  private loadForm(hypoMoMap?: HypoMoMap): void {
    this.hypoMoMapForm.patchValue({
      name: hypoMoMap?.name,
    });
  }
}
