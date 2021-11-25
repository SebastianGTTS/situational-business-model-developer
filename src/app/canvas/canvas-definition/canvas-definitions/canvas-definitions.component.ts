import { Component, ViewChild } from '@angular/core';
import { CanvasDefinition } from '../../../canvas-meta-model/canvas-definition';
import { CanvasDefinitionService } from '../../../canvas-meta-model/canvas-definition.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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

  modalCanvas: CanvasDefinition;
  private modalReference: NgbModalRef;

  @ViewChild('deleteCanvasDefinitionModal', { static: true })
  deleteCanvasDefinitionModal: any;

  constructor(
    private fb: FormBuilder,
    private listService: ListService<CanvasDefinition>,
    private modalService: NgbModal
  ) {}

  async addCanvasDefinition() {
    await this.listService.add({ name: this.nameControl.value });
    this.addCanvasDefinitionForm.reset();
  }

  openDeleteCanvasDefinitionModal(canvasDefinition: CanvasDefinition) {
    this.modalCanvas = canvasDefinition;
    this.modalReference = this.modalService.open(
      this.deleteCanvasDefinitionModal,
      { size: 'lg' }
    );
  }

  async deleteCanvasDefinition(canvasDefinitionId: string) {
    await this.listService.delete(canvasDefinitionId);
  }

  get nameControl() {
    return this.addCanvasDefinitionForm.get('name');
  }

  get canvasDefinitions(): CanvasDefinition[] {
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
