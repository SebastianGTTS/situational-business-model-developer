import { Component, ViewChild } from '@angular/core';
import { ProcessPattern } from '../../development-process-registry/process-pattern/process-pattern';
import { ProcessPatternService } from '../../development-process-registry/process-pattern/process-pattern.service';
import { FormBuilder, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ELEMENT_SERVICE, ListService } from '../../shared/list.service';

@Component({
  selector: 'app-process-patterns',
  templateUrl: './process-patterns.component.html',
  styleUrls: ['./process-patterns.component.css'],
  providers: [
    ListService,
    { provide: ELEMENT_SERVICE, useExisting: ProcessPatternService },
  ],
})
export class ProcessPatternsComponent {
  processPatternForm = this.fb.group({
    name: ['', Validators.required],
  });

  modalProcessPattern: ProcessPattern;
  private modalReference: NgbModalRef;

  @ViewChild('deleteProcessPatternModal', { static: true })
  deleteProcessPatternModal: any;

  constructor(
    private fb: FormBuilder,
    private listService: ListService<ProcessPattern>,
    private modalService: NgbModal
  ) {}

  openDeleteProcessPatternModal(processPattern: ProcessPattern) {
    this.modalProcessPattern = processPattern;
    this.modalReference = this.modalService.open(
      this.deleteProcessPatternModal,
      {
        size: 'lg',
      }
    );
  }

  async deleteProcessPattern(id: string) {
    await this.listService.delete(id);
  }

  async addProcessPattern(processPatternForm: any) {
    await this.listService.add({ name: processPatternForm.value.name });
    this.processPatternForm.reset();
  }

  get processPatternList(): ProcessPattern[] {
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
