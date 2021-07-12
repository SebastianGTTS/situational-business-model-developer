import { Component, OnInit, ViewChild } from '@angular/core';
import { CanvasDefinition } from '../../../canvas-meta-model/canvas-definition';
import { CanvasDefinitionService } from '../../../canvas-meta-model/canvas-definition.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-canvas-definitions',
  templateUrl: './canvas-definitions.component.html',
  styleUrls: ['./canvas-definitions.component.css']
})
export class CanvasDefinitionsComponent implements OnInit {

  canvasDefinitions: CanvasDefinition[];

  addCanvasDefinitionForm: FormGroup;

  modalCanvas: CanvasDefinition;
  private modalReference: NgbModalRef;

  @ViewChild('deleteCanvasDefinitionModal', {static: true}) deleteCanvasDefinitionModal: any;

  constructor(
    private canvasDefinitionService: CanvasDefinitionService,
    private fb: FormBuilder,
    private modalService: NgbModal,
  ) {
  }

  ngOnInit() {
    this.loadCanvasDefinitions().then();
    this.initForm();
  }

  initForm() {
    this.addCanvasDefinitionForm = this.fb.group({
      name: ['', Validators.required],
    });
  }

  async addCanvasDefinition() {
    await this.canvasDefinitionService.add({name: this.nameControl.value});
    this.initForm();
    await this.loadCanvasDefinitions();
  }

  async openDeleteCanvasDefinitionModal(canvasDefinitionId: string) {
    this.modalCanvas = await this.canvasDefinitionService.get(canvasDefinitionId);
    this.modalReference = this.modalService.open(this.deleteCanvasDefinitionModal, {size: 'lg'});
  }

  async deleteCanvasDefinition(canvasDefinitionId: string) {
    await this.canvasDefinitionService.delete(canvasDefinitionId);
    await this.loadCanvasDefinitions();
  }

  async loadCanvasDefinitions() {
    this.canvasDefinitions = (await this.canvasDefinitionService.getList()).docs;
  }

  get nameControl() {
    return this.addCanvasDefinitionForm.get('name');
  }

}
