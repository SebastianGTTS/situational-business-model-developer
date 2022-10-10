import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Instance } from '../../../canvas-meta-model/instance';

@Component({
  selector: 'app-instance-form',
  templateUrl: './instance-form.component.html',
  styleUrls: ['./instance-form.component.css'],
})
export class InstanceFormComponent implements OnChanges {
  @Input() instance!: Instance;

  @Output() submitInstanceForm = new EventEmitter<FormGroup>();

  instanceForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    description: [''],
  });

  constructor(private fb: FormBuilder) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.instance) {
      this.loadForm(changes.instance.currentValue);
    }
  }

  submitForm(): void {
    this.submitInstanceForm.emit(this.instanceForm);
    this.loadForm(this.instance);
  }

  private loadForm(instance: Instance): void {
    this.instanceForm = this.fb.group({
      name: [instance.name, Validators.required],
      description: [instance.description ? instance.description : ''],
    });
  }
}
