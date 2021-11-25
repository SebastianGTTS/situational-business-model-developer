import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ToolService } from '../../development-process-registry/method-elements/tool/tool.service';
import { ModuleService } from '../../development-process-registry/module-api/module.service';
import { Module } from '../../development-process-registry/module-api/module';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Tool } from '../../development-process-registry/method-elements/tool/tool';

@Component({
  selector: 'app-tools',
  templateUrl: './tools.component.html',
  styleUrls: ['./tools.component.css'],
})
export class ToolsComponent implements OnInit {
  elementLists: { listName: string; elements: Tool[] }[] = null;
  listNames: string[] = [];

  moduleLists: { listName: string; elements: Module[] }[] = null;

  modalTool: Tool;
  private modalReference: NgbModalRef;

  @ViewChild('deleteToolModal', { static: true }) deleteToolModal: any;

  constructor(
    private modalService: NgbModal,
    private moduleService: ModuleService,
    private toolService: ToolService
  ) {}

  ngOnInit() {
    this.load();
    this.moduleLists = this.moduleService.getLists();
  }

  private load() {
    this.toolService
      .getLists()
      .then((lists) => {
        this.elementLists = lists;
        this.listNames = this.elementLists.map((list) => list.listName);
      })
      .catch((error) => console.log('Load: ' + error));
  }

  openDeleteToolModal(tool: Tool) {
    this.modalTool = tool;
    this.modalReference = this.modalService.open(this.deleteToolModal, {
      size: 'lg',
    });
  }

  delete(id: string) {
    this.toolService
      .delete(id)
      .then(() => this.load())
      .catch((error) => console.log('Delete: ' + error));
  }

  add(form: FormGroup) {
    this.toolService
      .add(form.value)
      .then(() => this.load())
      .catch((error) => console.log('Add: ' + error));
  }
}
