import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Instance, InstanceType } from '../../../canvas-meta-artifact/instance';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-instance-list',
  templateUrl: './instance-list.component.html',
  styleUrls: ['./instance-list.component.css'],
})
export class InstanceListComponent {
  @Input() elementName!: string;
  @Input() elementNamePlural!: string;
  @Input() instances!: Instance[];

  @Input() viewLinkFunction!: (instance: Instance) => string[];

  @Output() addInstance = new EventEmitter<
    FormGroup<{ name: FormControl<string> }>
  >();
  @Output() deleteInstance = new EventEmitter<number>();

  modalItem?: Instance;
  private modalReference?: NgbModalRef;

  form = this.fb.nonNullable.group({
    name: ['', Validators.required],
  });

  @ViewChild('deleteItemModal', { static: true })
  deleteItemModal: unknown;

  constructor(private fb: FormBuilder, private modalService: NgbModal) {}

  addInstanceForwardEmitter(): void {
    this.addInstance.emit(this.form);
    this.form.reset();
  }

  openDeleteItemModal(item: Instance): void {
    this.modalItem = item;
    this.modalReference = this.modalService.open(this.deleteItemModal, {
      size: 'lg',
    });
  }

  getInstanceTypeName(type: InstanceType): string | undefined {
    switch (type) {
      case InstanceType.EXAMPLE:
        return 'Example';
      case InstanceType.PATTERN:
        return 'Pattern';
    }
    return undefined;
  }
}
