import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ELEMENT_SERVICE, ListService } from '../../shared/list.service';
import {
  WhiteboardTemplate,
  WhiteboardTemplateEntry,
  WhiteboardTemplateInit,
} from '../../whiteboard-meta-model/whiteboard-template';
import { WhiteboardTemplateService } from '../../whiteboard-meta-model/whiteboard-template.service';

@Component({
  selector: 'app-whiteboard-templates',
  templateUrl: './whiteboard-templates.component.html',
  styleUrls: ['./whiteboard-templates.component.css'],
  providers: [
    ListService,
    { provide: ELEMENT_SERVICE, useExisting: WhiteboardTemplateService },
  ],
})
export class WhiteboardTemplatesComponent {
  whiteboardTemplateForm = this.fb.group({
    name: this.fb.control('', Validators.required),
  });

  modalWhiteboardTemplate?: WhiteboardTemplateEntry;
  private modalReference?: NgbModalRef;

  @ViewChild('deleteWhiteboardTemplateModal', { static: true })
  deleteWhiteboardTemplateModal: unknown;

  constructor(
    private listService: ListService<
      WhiteboardTemplate,
      WhiteboardTemplateInit
    >,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private whiteboardTemplateService: WhiteboardTemplateService
  ) {}

  openDeleteWhiteboardTemplateModal(
    whiteboardTemplate: WhiteboardTemplateEntry
  ): void {
    this.modalWhiteboardTemplate = whiteboardTemplate;
    this.modalReference = this.modalService.open(
      this.deleteWhiteboardTemplateModal,
      {
        size: 'lg',
      }
    );
  }

  async deleteWhiteboardTemplate(id: string): Promise<void> {
    await this.listService.delete(id);
  }

  async addWhiteboardTemplate(
    whiteboardTemplateForm: FormGroup
  ): Promise<void> {
    await this.listService.add(
      this.whiteboardTemplateService.getWhiteboardTemplateInitialization(
        whiteboardTemplateForm.value.name
      )
    );
    this.whiteboardTemplateForm.reset();
  }

  get whiteboardTemplatesList(): WhiteboardTemplateEntry[] {
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
