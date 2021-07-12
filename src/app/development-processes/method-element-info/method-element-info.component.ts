import { Component, Input, Optional } from '@angular/core';
import { MethodElement } from '../../development-process-registry/method-elements/method-element';
import { merge, Observable, Subject } from 'rxjs';
import { FormArrayName, FormBuilder, Validators } from '@angular/forms';
import { getTypeaheadInputPipe } from '../../shared/utils';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-method-element-info',
  templateUrl: './method-element-info.component.html',
  styleUrls: ['./method-element-info.component.css']
})
export class MethodElementInfoComponent {

  @Input() methodElementName: string;

  @Input() listName: string;
  @Input() methodElement: MethodElement = null;
  @Input() multiple = false;
  @Input() multipleElements = false;

  @Input() methodElements: MethodElement[] = [];

  openElementInput = new Subject<[HTMLInputElement, string]>();

  constructor(
    private fb: FormBuilder,
    @Optional() private formArrayName: FormArrayName,
  ) {
  }

  searchElements = (field: HTMLInputElement) => (input: Observable<string>) => {
    return merge(getTypeaheadInputPipe(input), this.openElementInput.pipe(
      filter(([f]) => f === field),
      map(([, i]) => i),
    )).pipe(
      map(
        (term) => this.methodElements.filter((methodElement) =>
          methodElement.list.toLowerCase() === this.listName.toLowerCase() &&
          methodElement.name.toLowerCase().includes(term.toLowerCase())
        ).slice(0, 7)
      ),
    );
  }

  add(index: number = null) {
    if (index === null) {
      index = this.formArray.length;
    }
    this.formArray.insert(index, this.fb.control(null, Validators.required));
  }

  remove(index: number) {
    this.formArray.removeAt(index);
  }

  formatter(x: { name: string }) {
    return x.name;
  }

  get formArray() {
    return this.formArrayName ? this.formArrayName.control : null;
  }

  get listValue() {
    if (this.multiple) {
      return '[' + this.listName + ']';
    } else {
      return this.listName;
    }
  }

  get elementValue() {
    if (this.multipleElements) {
      return '[' + this.methodElement.name + ']';
    } else {
      return this.methodElement.name;
    }
  }

}
