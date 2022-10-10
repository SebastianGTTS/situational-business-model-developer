import { Component, ViewChild } from '@angular/core';
import {
  ProcessPattern,
  ProcessPatternEntry,
  ProcessPatternInit,
} from '../../development-process-registry/process-pattern/process-pattern';
import { ProcessPatternService } from '../../development-process-registry/process-pattern/process-pattern.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ELEMENT_SERVICE } from '../../shared/list.service';
import { ProcessPatternDiagramService } from '../../development-process-registry/process-pattern/process-pattern-diagram.service';
import { ListSearchService } from '../../shared/list-search.service';
import {
  defaultSearchFunction,
  SEARCH_FUNCTION,
  SearchService,
} from '../../shared/search.service';

@Component({
  selector: 'app-process-patterns',
  templateUrl: './process-patterns.component.html',
  styleUrls: ['./process-patterns.component.css'],
  providers: [
    SearchService,
    { provide: SEARCH_FUNCTION, useValue: defaultSearchFunction },
    ListSearchService,
    { provide: ELEMENT_SERVICE, useExisting: ProcessPatternService },
  ],
})
export class ProcessPatternsComponent {
  processPatternForm = this.fb.group({
    name: ['', Validators.required],
  });

  modalProcessPattern?: ProcessPatternEntry;
  private modalReference?: NgbModalRef;

  @ViewChild('deleteProcessPatternModal', { static: true })
  deleteProcessPatternModal: unknown;

  constructor(
    private fb: FormBuilder,
    private listService: ListSearchService<ProcessPattern, ProcessPatternInit>,
    private modalService: NgbModal,
    private processPatternDiagramService: ProcessPatternDiagramService
  ) {}

  openDeleteProcessPatternModal(processPattern: ProcessPatternEntry): void {
    this.modalProcessPattern = processPattern;
    this.modalReference = this.modalService.open(
      this.deleteProcessPatternModal,
      {
        size: 'lg',
      }
    );
  }

  async deleteProcessPattern(id: string): Promise<void> {
    await this.listService.delete(id);
  }

  async addProcessPattern(processPatternForm: FormGroup): Promise<void> {
    await this.listService.add({
      name: processPatternForm.value.name,
      pattern:
        await this.processPatternDiagramService.getEmptyProcessPatternDiagram(),
    });
    this.processPatternForm.reset();
  }

  get processPatternList(): ProcessPatternEntry[] | undefined {
    return this.listService.elements;
  }

  get processPatternListFiltered(): ProcessPatternEntry[] | undefined {
    return this.listService.filteredElements;
  }

  get searchValue(): string | undefined {
    return this.listService.searchValue;
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
