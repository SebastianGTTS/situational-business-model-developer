import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BmProcessEntry } from '../../../development-process-registry/bm-process/bm-process';
import { BmProcessService } from '../../../development-process-registry/bm-process/bm-process.service';

@Component({
  selector: 'app-bm-processes-selection-modal',
  templateUrl: './bm-processes-selection-modal.component.html',
  styleUrls: ['./bm-processes-selection-modal.component.scss'],
})
export class BmProcessesSelectionModalComponent implements OnInit {
  @Input() title?: string;

  bmProcesses: BmProcessEntry[] = [];

  constructor(
    private activeModal: NgbActiveModal,
    private bmProcessService: BmProcessService
  ) {}

  ngOnInit(): void {
    if (this.bmProcesses.length === 0) {
      void this.loadBmProcesses();
    }
  }

  close(bmProcess: BmProcessEntry): void {
    this.activeModal.close(bmProcess);
  }

  dismiss(): void {
    this.activeModal.dismiss();
  }

  private async loadBmProcesses(): Promise<void> {
    this.bmProcesses = await this.bmProcessService.getList();
  }
}
