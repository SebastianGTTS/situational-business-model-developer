import { Component, OnInit } from '@angular/core';
import { MethodElement } from '../../development-process-registry/method-elements/method-element';
import { FormGroup } from '@angular/forms';
import { StakeholderService } from '../../development-process-registry/method-elements/stakeholder/stakeholder.service';

@Component({
  selector: 'app-stakeholders',
  templateUrl: './stakeholders.component.html',
  styleUrls: ['./stakeholders.component.css']
})
export class StakeholdersComponent implements OnInit {

  elementLists: { listName: string, elements: MethodElement[] }[] = null;
  listNames: string[] = [];

  constructor(
    private stakeholderService: StakeholderService,
  ) {
  }

  ngOnInit() {
    this.load();
  }

  private load() {
    this.stakeholderService.getLists().then(
      lists => {
        this.elementLists = lists;
        this.listNames = this.elementLists.map((list) => list.listName);
      },
    ).catch(
      error => console.log('Load: ' + error)
    );
  }

  delete(id: string) {
    this.stakeholderService.delete(id).then(
      () => this.load()
    ).catch(
      error => console.log('Delete: ' + error)
    );
  }

  add(form: FormGroup) {
    this.stakeholderService.add(form.value).then(
      () => this.load()
    ).catch(
      error => console.log('Add: ' + error)
    );
  }

}
