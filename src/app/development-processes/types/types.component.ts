import { Component, OnInit } from '@angular/core';
import { MethodElement } from '../../development-process-registry/method-elements/method-element';
import { FormGroup } from '@angular/forms';
import { TypeService } from '../../development-process-registry/method-elements/type/type.service';

@Component({
  selector: 'app-types',
  templateUrl: './types.component.html',
  styleUrls: ['./types.component.css']
})
export class TypesComponent implements OnInit {

  elementLists: { listName: string, elements: MethodElement[] }[] = null;
  listNames: string[] = [];

  constructor(
    private typeService: TypeService,
  ) {
  }

  ngOnInit() {
    this.load();
  }

  private load() {
    this.typeService.getLists().then(
      lists => {
        this.elementLists = lists;
        this.listNames = this.elementLists.map((list) => list.listName);
      },
    ).catch(
      error => console.log('Load: ' + error)
    );
  }

  delete(id: string) {
    this.typeService.delete(id).then(
      () => this.load()
    ).catch(
      error => console.log('Delete: ' + error)
    );
  }

  add(form: FormGroup) {
    this.typeService.add(form.value).then(
      () => this.load()
    ).catch(
      error => console.log('Add: ' + error)
    );
  }

}
