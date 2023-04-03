import { Component, OnInit, ViewChild } from '@angular/core';
import { PhaseListService } from '../../../../development-process-registry/phase/phase-list.service';
import { PhaseListLoaderService } from '../../../shared/phase-list-loader.service';
import { PhaseList } from '../../../../development-process-registry/phase/phase-list';
import { Phase } from '../../../../development-process-registry/phase/phase';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { DbId } from '../../../../database/database-entry';

@Component({
  selector: 'app-phase-list',
  templateUrl: './phase-list.component.html',
  styleUrls: ['./phase-list.component.css'],
  providers: [PhaseListLoaderService],
})
export class PhaseListComponent implements OnInit {
  reloading = false;

  modalPhase?: Phase;
  private modalReference?: NgbModalRef;

  @ViewChild('deletePhaseModal', { static: true })
  deletePhaseModal: unknown;

  constructor(
    private fb: UntypedFormBuilder,
    private modalService: NgbModal,
    private phaseListLoaderService: PhaseListLoaderService,
    private phaseListService: PhaseListService
  ) {}

  ngOnInit(): void {
    this.phaseListLoaderService.loaded.subscribe(
      () => (this.reloading = false)
    );
  }

  get phaseList(): PhaseList | undefined {
    return this.phaseListLoaderService.phaseList;
  }

  openDeletePhaseModal(phase: Phase): void {
    this.modalPhase = phase;
    this.modalReference = this.modalService.open(this.deletePhaseModal, {
      size: 'lg',
    });
  }

  async movePhase(phase: Phase, offset: number): Promise<void> {
    if (this.phaseList != null) {
      this.reloading = true;
      await this.phaseListService.movePhase(
        this.phaseList._id,
        phase.id,
        offset
      );
    }
  }

  async deletePhase(phase: Phase): Promise<void> {
    if (this.phaseList != null) {
      this.reloading = true;
      await this.phaseListService.deletePhase(this.phaseList._id, phase.id);
    }
  }

  async addPhase(form: UntypedFormGroup): Promise<void> {
    if (this.phaseList != null) {
      this.reloading = true;
      await this.phaseListService.addPhase(this.phaseList._id, {
        name: form.get('name')?.value,
      });
    }
  }

  trackBy(index: number, item: Phase): DbId {
    return item.id;
  }
}
