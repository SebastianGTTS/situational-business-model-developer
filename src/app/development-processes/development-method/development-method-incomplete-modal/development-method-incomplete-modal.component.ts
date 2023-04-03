import { Component, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DevelopmentMethod } from '../../../development-process-registry/development-method/development-method';
import { Router } from '@angular/router';

@Component({
  selector: 'app-development-method-incomplete-modal',
  templateUrl: './development-method-incomplete-modal.component.html',
  styleUrls: ['./development-method-incomplete-modal.component.css'],
})
export class DevelopmentMethodIncompleteModalComponent {
  @Input() developmentMethod?: DevelopmentMethod;

  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private router: Router
  ) {}

  dismiss(): void {
    this.activeModal.dismiss();
  }

  async check(): Promise<void> {
    if (this.developmentMethod != null) {
      this.modalService.dismissAll();
      await this.router.navigate([
        'methods',
        'methodview',
        this.developmentMethod._id,
      ]);
    }
  }
}
