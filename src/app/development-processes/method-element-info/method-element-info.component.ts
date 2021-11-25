import { Component, Input, Optional } from '@angular/core';
import { MethodElement } from '../../development-process-registry/method-elements/method-element';
import { merge, Observable, Subject } from 'rxjs';
import {
  FormArray,
  FormArrayName,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { getTypeaheadInputPipe } from '../../shared/utils';
import { filter, map } from 'rxjs/operators';
import { MultipleSelection } from '../../development-process-registry/development-method/multiple-selection';

@Component({
  selector: 'app-method-element-info',
  templateUrl: './method-element-info.component.html',
  styleUrls: ['./method-element-info.component.css'],
})
export class MethodElementInfoComponent {
  @Input() methodElementName: string;

  @Input() element: MultipleSelection<MethodElement>;

  @Input() methodElements: MethodElement[] = [];

  openElementInput = new Subject<[HTMLInputElement, string]>();

  constructor(
    private fb: FormBuilder,
    @Optional() private formArrayName: FormArrayName
  ) {}

  searchElements =
    (field: HTMLInputElement) =>
    (input: Observable<string>): Observable<MethodElement[]> => {
      return merge(
        getTypeaheadInputPipe(input),
        this.openElementInput.pipe(
          filter(([f]) => f === field),
          map(([, i]) => i)
        )
      ).pipe(
        map((term) =>
          this.methodElements
            .filter(
              (methodElement) =>
                methodElement.list.toLowerCase() ===
                  this.element.list.toLowerCase() &&
                methodElement.name.toLowerCase().includes(term.toLowerCase())
            )
            .slice(0, 7)
        )
      );
    };

  add(index: number = null): void {
    if (index === null) {
      index = this.formArray.length;
    }
    this.formArray.insert(index, this.fb.control(null, Validators.required));
  }

  remove(index: number): void {
    this.formArray.removeAt(index);
  }

  formatter(x: { name: string }): string {
    return x.name;
  }

  get formArray(): FormArray {
    return this.formArrayName ? this.formArrayName.control : null;
  }
}
