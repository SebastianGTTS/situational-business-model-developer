import { Component, OnInit, ViewChild } from '@angular/core';
import { SituationalFactorService } from '../../development-process-registry/method-elements/situational-factor/situational-factor.service';
import { FormGroup } from '@angular/forms';
import {
  SituationalFactorDefinition,
  SituationalFactorDefinitionEntry,
} from '../../development-process-registry/method-elements/situational-factor/situational-factor-definition';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-situational-factors',
  templateUrl: './situational-factors.component.html',
  styleUrls: ['./situational-factors.component.css'],
})
export class SituationalFactorsComponent implements OnInit {
  elementLists: {
    listName: string;
    elements: SituationalFactorDefinitionEntry[];
  }[] = null;
  listNames: string[] = [];

  modalSituationalFactor: SituationalFactorDefinition;
  private modalReference: NgbModalRef;

  @ViewChild('deleteSituationalFactorModal', { static: true })
  deleteSituationalFactorModal: unknown;

  constructor(
    private situationalFactorService: SituationalFactorService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    void this.loadSituationalFactors();
  }

  private async loadSituationalFactors(): Promise<void> {
    this.elementLists = await this.situationalFactorService.getLists();
    this.listNames = this.elementLists.map((list) => list.listName);
  }

  openDeleteSituationalFactorModal(
    situationalFactor: SituationalFactorDefinition
  ): void {
    this.modalSituationalFactor = situationalFactor;
    this.modalReference = this.modalService.open(
      this.deleteSituationalFactorModal,
      {
        size: 'lg',
      }
    );
  }

  async deleteSituationalFactor(id: string): Promise<void> {
    await this.situationalFactorService.delete(id);
    await this.loadSituationalFactors();
  }

  async addSituationalFactor(situationalFactorForm: FormGroup): Promise<void> {
    await this.situationalFactorService.add(situationalFactorForm.value);
    await this.loadSituationalFactors();
  }
}
