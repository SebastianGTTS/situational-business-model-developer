import { Component, ViewChild } from '@angular/core';
import { RunningArtifact } from '../../development-process-registry/running-process/running-artifact';
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
  modalArtifact: RunningArtifact;
  private modalReference: NgbModalRef;

  @ViewChild('deleteArtifactModal', { static: true })
  deleteArtifactModal: any;

  constructor(
    private listService: ListService<RunningArtifact>,
    private modalService: NgbModal
  ) {}

  openDeleteArtifactModal(artifact: RunningArtifact) {
    this.modalArtifact = artifact;
    this.modalReference = this.modalService.open(this.deleteArtifactModal, {
      size: 'lg',
    });
  }

  async deleteArtifact(artifact: RunningArtifact) {
    await this.listService.delete(artifact._id);
  }

  getRouterLink(artifact: RunningArtifact): string[] {
    return ['detail', artifact._id];
  }

  get artifacts(): RunningArtifact[] {
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
