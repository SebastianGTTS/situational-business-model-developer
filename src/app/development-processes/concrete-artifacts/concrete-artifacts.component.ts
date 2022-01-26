import { Component, ViewChild } from '@angular/core';
import {
  RunningArtifact,
  RunningArtifactEntry,
  RunningArtifactInit,
} from '../../development-process-registry/running-process/running-artifact';
import { ConcreteArtifactService } from '../../development-process-registry/running-process/concrete-artifact.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ELEMENT_SERVICE, ListService } from '../../shared/list.service';

@Component({
  selector: 'app-concrete-artifacts',
  templateUrl: './concrete-artifacts.component.html',
  styleUrls: ['./concrete-artifacts.component.css'],
  providers: [
    ListService,
    { provide: ELEMENT_SERVICE, useExisting: ConcreteArtifactService },
  ],
})
export class ConcreteArtifactsComponent {
  modalArtifact: RunningArtifactEntry;
  private modalReference: NgbModalRef;

  @ViewChild('deleteArtifactModal', { static: true })
  deleteArtifactModal: unknown;

  constructor(
    private listService: ListService<RunningArtifact, RunningArtifactInit>,
    private modalService: NgbModal
  ) {}

  openDeleteArtifactModal(artifact: RunningArtifactEntry): void {
    this.modalArtifact = artifact;
    this.modalReference = this.modalService.open(this.deleteArtifactModal, {
      size: 'lg',
    });
  }

  async deleteArtifact(artifact: RunningArtifactEntry): Promise<void> {
    await this.listService.delete(artifact._id);
  }

  getRouterLink(artifact: RunningArtifactEntry): string[] {
    return ['detail', artifact._id];
  }

  get artifacts(): RunningArtifactEntry[] {
    return this.listService.elements;
  }

  get noResults(): boolean {
    return this.listService.noResults;
  }

  get loading(): boolean {
    return this.listService.loading;
  }

  get reloading(): boolean {
    return this.listService.reloading;
  }
}
