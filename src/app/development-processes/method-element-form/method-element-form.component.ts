import { Component, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MethodElement } from '../../development-process-registry/method-elements/method-element';
import { merge, Observable, Subject } from 'rxjs';
import { getTypeaheadInputPipe } from '../../shared/utils';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-method-element-form',
  templateUrl: './method-element-form.component.html',
  styleUrls: ['./method-element-form.component.css']
})
export class MethodElementFormComponent implements OnChanges, OnDestroy {

  @Input() methodElement: MethodElement = null;
  @Input() listNames: string[] = [];

  @Output() submitMethodElementForm = new EventEmitter<FormGroup>();

  methodElementForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    list: ['', Validators.required],
    description: [''],
  });

  openListInput = new Subject<string>();

  constructor(
    private fb: FormBuilder,
  ) {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.methodElement) {
      this.loadForm(changes.methodElement.currentValue);
    }
  }

  ngOnDestroy() {
    this.openListInput.complete();
  }

  private loadForm(methodElement: MethodElement) {
    this.methodElementForm.patchValue(methodElement);
  }

  submitForm() {
    this.submitMethodElementForm.emit(this.methodElementForm);
    if (this.methodElement === null) {
      this.methodElementForm.reset();
    }
  }

  searchLists = (input: Observable<string>) => {
    return merge(getTypeaheadInputPipe(input), this.openListInput).pipe(
      map((term) => this.listNames.filter((listItem) => listItem.toLowerCase().includes(term.toLowerCase())).slice(0, 10)),
    );
  }

}
