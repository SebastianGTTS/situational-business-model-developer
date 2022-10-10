import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ArtifactService } from '../../development-process-registry/method-elements/artifact/artifact.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ArtifactEntry } from '../../development-process-registry/method-elements/artifact/artifact';

@Component({
  selector: 'app-artifacts',
  templateUrl: './artifacts.component.html',
  styleUrls: ['./artifacts.component.css'],
})
export class ArtifactsComponent implements OnInit {
  elementLists?: { listName: string; elements: ArtifactEntry[] }[];
  listNames: string[] = [];

  modalArtifact?: ArtifactEntry;
  private modalReference?: NgbModalRef;

  @ViewChild('deleteArtifactModal', { static: true })
  deleteArtifactModal: unknown;

  constructor(
    private artifactService: ArtifactService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    void this.load();
  }

  private async load(): Promise<void> {
    this.elementLists = await this.artifactService.getLists();
    this.listNames = this.elementLists.map((list) => list.listName);
  }

  openDeleteArtifactModal(artifact: ArtifactEntry): void {
    this.modalArtifact = artifact;
    this.modalReference = this.modalService.open(this.deleteArtifactModal, {
      size: 'lg',
    });
  }

  async delete(id: string): Promise<void> {
    await this.artifactService.delete(id);
    await this.load();
  }

  async add(form: FormGroup): Promise<void> {
    await this.artifactService.add(form.value);
    await this.load();
  }
}
