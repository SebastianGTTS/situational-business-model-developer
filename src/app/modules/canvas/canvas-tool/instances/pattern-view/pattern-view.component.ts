import { Component, Input } from '@angular/core';
import { Instance } from '../../../canvas-meta-artifact/instance';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PatternDescriptionModalComponent } from '../pattern-description-modal/pattern-description-modal.component';

@Component({
  selector: 'app-pattern-view',
  templateUrl: './pattern-view.component.html',
  styleUrls: ['./pattern-view.component.css'],
})
export class PatternViewComponent {
  @Input() pattern!: Instance;

  constructor(private modalService: NgbModal) {}

  openDescription(): void {
    const modal = this.modalService.open(PatternDescriptionModalComponent, {
      size: 'lg',
    });
    modal.componentInstance.pattern = this.pattern;
  }
}
