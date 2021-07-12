import { Component, OnInit } from '@angular/core';
import { MethodElement } from '../../development-process-registry/method-elements/method-element';
import { FormGroup } from '@angular/forms';
import { ToolService } from '../../development-process-registry/method-elements/tool/tool.service';

@Component({
  selector: 'app-tools',
  templateUrl: './tools.component.html',
  styleUrls: ['./tools.component.css']
})
export class ToolsComponent implements OnInit {

  elementLists: { listName: string, elements: MethodElement[] }[] = null;
  listNames: string[] = [];

  constructor(
    private toolService: ToolService,
  ) {
  }

  ngOnInit() {
    this.load();
  }

  private load() {
    this.toolService.getLists().then(
      lists => {
        this.elementLists = lists;
        this.listNames = this.elementLists.map((list) => list.listName);
      },
    ).catch(
      error => console.log('Load: ' + error)
    );
  }

  delete(id: string) {
    this.toolService.delete(id).then(
      () => this.load()
    ).catch(
      error => console.log('Delete: ' + error)
    );
  }

  add(form: FormGroup) {
    this.toolService.add(form.value).then(
      () => this.load()
    ).catch(
      error => console.log('Add: ' + error)
    );
  }

}
