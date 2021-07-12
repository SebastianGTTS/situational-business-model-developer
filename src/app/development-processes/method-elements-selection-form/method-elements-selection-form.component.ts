import { Component, Input, TemplateRef } from '@angular/core';
import { MethodElement } from '../../development-process-registry/method-elements/method-element';
import { FormArrayName, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-method-elements-selection-form',
  templateUrl: './method-elements-selection-form.component.html',
  styleUrls: ['./method-elements-selection-form.component.css']
})
export class MethodElementsSelectionFormComponent {

  @Input() methodElementName = 'Element';
  @Input() multipleAllowed = false;

  @Input() methodElements: MethodElement[] = [];
  @Input() listNames: string[] = [];

  @Input() methodElementFormTemplate: TemplateRef<any>;
  @Input() createFormGroupFactory: () => FormGroup;

  constructor(
    private formArrayName: FormArrayName,
  ) {
  }

  add() {
    this.formArray.push(this.createFormGroupFactory());
  }

  remove(index: number) {
    this.formArray.removeAt(index);
  }

  get formArray() {
    return this.formArrayName.control;
  }

  getTemplateContext(formGroup: FormGroup, index: number) {
    return {
      formGroup,
      index,
      listNames: this.listNames,
      methodElements: this.methodElements,
      methodElementName: this.methodElementName,
      remove: this.remove.bind(this),
    };
  }

}
