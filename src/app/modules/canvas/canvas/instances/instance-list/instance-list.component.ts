import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Instance } from '../../../canvas-meta-model/instance';

@Component({
  selector: 'app-instance-list',
  templateUrl: './instance-list.component.html',
  styleUrls: ['./instance-list.component.css'],
})
export class InstanceListComponent {
  @Input() formTitle!: string;
  @Input() listTitle!: string;
  @Input() instances!: Instance[];

  @Input() viewInstanceLink!: (instance: Instance) => string[];

  @Output() addInstance = new EventEmitter<FormGroup>();
  @Output() deleteInstance = new EventEmitter<number>();

  instanceForm: FormGroup = this.fb.group({ name: ['', Validators.required] });

  constructor(private fb: FormBuilder) {}

  addInstanceForwardEmitter(): void {
    this.addInstance.emit(this.instanceForm);
    this.instanceForm.reset();
  }
}
