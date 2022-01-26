import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ToolService } from '../../development-process-registry/method-elements/tool/tool.service';
import { ModuleService } from '../../development-process-registry/module-api/module.service';
import { Module } from '../../development-process-registry/module-api/module';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import {
  Tool,
  ToolEntry,
} from '../../development-process-registry/method-elements/tool/tool';

@Component({
  selector: 'app-tools',
  templateUrl: './tools.component.html',
  styleUrls: ['./tools.component.css'],
})
export class ToolsComponent implements OnInit {
  elementLists: { listName: string; elements: ToolEntry[] }[] = null;
  listNames: string[] = [];

  moduleLists: { listName: string; elements: Module[] }[] = null;

  modalTool: Tool;
  private modalReference: NgbModalRef;

  @ViewChild('deleteToolModal', { static: true }) deleteToolModal: unknown;

  constructor(
    private modalService: NgbModal,
    private moduleService: ModuleService,
    private toolService: ToolService
  ) {}

  ngOnInit(): void {
    this.load();
    this.moduleLists = this.moduleService.getLists();
  }

  private load(): void {
    this.toolService
      .getLists()
      .then((lists) => {
        this.elementLists = lists;
        this.listNames = this.elementLists.map((list) => list.listName);
      })
      .catch((error) => console.log('Load: ' + error));
  }

  openDeleteToolModal(tool: Tool): void {
    this.modalTool = tool;
    this.modalReference = this.modalService.open(this.deleteToolModal, {
      size: 'lg',
    });
  }

  delete(id: string): void {
    this.toolService
      .delete(id)
      .then(() => this.load())
      .catch((error) => console.log('Delete: ' + error));
  }

  add(form: FormGroup): void {
    this.toolService
      .add(form.value)
      .then(() => this.load())
      .catch((error) => console.log('Add: ' + error));
  }
}
