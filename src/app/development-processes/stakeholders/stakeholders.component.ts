import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { StakeholderService } from '../../development-process-registry/method-elements/stakeholder/stakeholder.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Stakeholder } from '../../development-process-registry/method-elements/stakeholder/stakeholder';

@Component({
  selector: 'app-stakeholders',
  templateUrl: './stakeholders.component.html',
  styleUrls: ['./stakeholders.component.css'],
})
export class StakeholdersComponent implements OnInit {
  elementLists: { listName: string; elements: Stakeholder[] }[] = null;
  listNames: string[] = [];

  modalStakeholder: Stakeholder;
  private modalReference: NgbModalRef;

  @ViewChild('deleteStakeholderModal', { static: true })
  deleteStakeholderModal: any;

  constructor(
    private modalService: NgbModal,
    private stakeholderService: StakeholderService
  ) {}

  ngOnInit() {
    this.load();
  }

  private load() {
    this.stakeholderService
      .getLists()
      .then((lists) => {
        this.elementLists = lists;
        this.listNames = this.elementLists.map((list) => list.listName);
      })
      .catch((error) => console.log('Load: ' + error));
  }

  openDeleteStakeholderModal(stakeholder: Stakeholder) {
    this.modalStakeholder = stakeholder;
    this.modalReference = this.modalService.open(this.deleteStakeholderModal, {
      size: 'lg',
    });
  }

  delete(id: string) {
    this.stakeholderService
      .delete(id)
      .then(() => this.load())
      .catch((error) => console.log('Delete: ' + error));
  }

  add(form: FormGroup) {
    this.stakeholderService
      .add(form.value)
      .then(() => this.load())
      .catch((error) => console.log('Add: ' + error));
  }
}
