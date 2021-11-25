import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ArtifactService } from '../../development-process-registry/method-elements/artifact/artifact.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Artifact } from '../../development-process-registry/method-elements/artifact/artifact';

@Component({
  selector: 'app-artifacts',
  templateUrl: './artifacts.component.html',
  styleUrls: ['./artifacts.component.css'],
})
export class ArtifactsComponent implements OnInit {
  elementLists: { listName: string; elements: Artifact[] }[] = null;
  listNames: string[] = [];

  modalArtifact: Artifact;
  private modalReference: NgbModalRef;

  @ViewChild('deleteArtifactModal', { static: true }) deleteArtifactModal: any;

  constructor(
    private artifactService: ArtifactService,
    private modalService: NgbModal
  ) {}

  ngOnInit() {
    this.load();
  }

  private load() {
    this.artifactService
      .getLists()
      .then((lists) => {
        this.elementLists = lists;
        this.listNames = this.elementLists.map((list) => list.listName);
      })
      .catch((error) => console.log('Load: ' + error));
  }

  openDeleteArtifactModal(artifact: Artifact) {
    this.modalArtifact = artifact;
    this.modalReference = this.modalService.open(this.deleteArtifactModal, {
      size: 'lg',
    });
  }

  delete(id: string) {
    this.artifactService
      .delete(id)
      .then(() => this.load())
      .catch((error) => console.log('Delete: ' + error));
  }

  add(form: FormGroup) {
    this.artifactService
      .add(form.value)
      .then(() => this.load())
      .catch((error) => console.log('Add: ' + error));
  }
}
