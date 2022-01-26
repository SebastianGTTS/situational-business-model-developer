import { Component, ViewChild } from '@angular/core';
import {
  CanvasDefinition,
  CanvasDefinitionEntry,
  CanvasDefinitionInit,
} from '../../../canvas-meta-model/canvas-definition';
import { CanvasDefinitionService } from '../../../canvas-meta-model/canvas-definition.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ELEMENT_SERVICE, ListService } from '../../../shared/list.service';

@Component({
  selector: 'app-canvas-definitions',
  templateUrl: './canvas-definitions.component.html',
  styleUrls: ['./canvas-definitions.component.css'],
  providers: [
    ListService,
    { provide: ELEMENT_SERVICE, useExisting: CanvasDefinitionService },
  ],
})
export class CanvasDefinitionsComponent {
  addCanvasDefinitionForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
  });

  modalCanvas: CanvasDefinitionEntry;
  private modalReference: NgbModalRef;

  @ViewChild('deleteCanvasDefinitionModal', { static: true })
  deleteCanvasDefinitionModal: unknown;

  constructor(
    private fb: FormBuilder,
    private listService: ListService<CanvasDefinition, CanvasDefinitionInit>,
    private modalService: NgbModal
  ) {}

  async addCanvasDefinition(): Promise<void> {
    await this.listService.add({ name: this.nameControl.value });
    this.addCanvasDefinitionForm.reset();
  }

  openDeleteCanvasDefinitionModal(
    canvasDefinition: CanvasDefinitionEntry
  ): void {
    this.modalCanvas = canvasDefinition;
    this.modalReference = this.modalService.open(
      this.deleteCanvasDefinitionModal,
      { size: 'lg' }
    );
  }

  async deleteCanvasDefinition(canvasDefinitionId: string): Promise<void> {
    await this.listService.delete(canvasDefinitionId);
  }

  get nameControl(): FormControl {
    return this.addCanvasDefinitionForm.get('name') as FormControl;
  }

  get canvasDefinitions(): CanvasDefinitionEntry[] {
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
