import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-element-name-modal',
  templateUrl: './element-name-modal.component.html',
  styleUrls: ['./element-name-modal.component.scss'],
})
export class ElementNameModalComponent {
  @Input() title?: string;

  nameForm = this.fb.nonNullable.group({
    name: ['', Validators.required],
  });

  constructor(private activeModal: NgbActiveModal, private fb: FormBuilder) {}

  dismiss(): void {
    this.activeModal.dismiss();
  }

  close(name: string): void {
    this.activeModal.close(name);
  }
}
