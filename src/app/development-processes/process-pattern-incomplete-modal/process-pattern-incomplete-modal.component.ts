import { Component, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { ProcessPattern } from '../../development-process-registry/process-pattern/process-pattern';

@Component({
  selector: 'app-process-pattern-incomplete-modal',
  templateUrl: './process-pattern-incomplete-modal.component.html',
  styleUrls: ['./process-pattern-incomplete-modal.component.css'],
})
export class ProcessPatternIncompleteModalComponent {
  @Input() processPattern?: ProcessPattern;

  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private router: Router
  ) {}

  dismiss(): void {
    this.activeModal.dismiss();
  }

  async check(): Promise<void> {
    if (this.processPattern != null) {
      this.modalService.dismissAll();
      await this.router.navigate([
        'process',
        'processview',
        this.processPattern._id,
      ]);
    }
  }
}
