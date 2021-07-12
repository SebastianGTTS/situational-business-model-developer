import { Component, Input, OnDestroy } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, ValidationErrors, Validators } from '@angular/forms';
import { merge, Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map, mapTo } from 'rxjs/operators';

@Component({
  selector: 'app-form-array-list',
  templateUrl: './form-array-list.component.html',
  styleUrls: ['./form-array-list.component.css']
})
export class FormArrayListComponent implements OnDestroy {

  @Input() elementName: string;
  @Input() formArray: FormArray;
  @Input() validators: ((control: AbstractControl) => ValidationErrors)[] = [Validators.required];

  @Input() ordered = false;
  @Input() searchList: string[] = null;

  open = new Subject<[HTMLInputElement, string]>();

  constructor(
    private fb: FormBuilder,
  ) {
  }

  ngOnDestroy() {
    this.open.complete();
  }

  add() {
    this.formArray.push(this.fb.control('', this.validators));
  }

  search = (index: HTMLInputElement) => (input: Observable<string>) => {
    const inputPipe = input.pipe(
      debounceTime(200),
      distinctUntilChanged(),
    );
    const openPipe = this.open.pipe(
      filter(([i]) => i === index),
      map(([, text]) => text),
    );
    if (this.searchList === null) {
      return merge(inputPipe, openPipe).pipe(
        mapTo([]),
      );
    }
    return merge(inputPipe, openPipe).pipe(
      map(term => this.searchList.filter(v => v.indexOf(term) > -1).slice(0, 10))
    );
  }

  up(position: number) {
    this.changePosition(position, -1);
  }

  down(position: number) {
    this.changePosition(position, 1);
  }

  changePosition(position: number, delta: number) {
    const control = this.formArray.controls[position];
    const newPosition = position + delta;
    this.formArray.removeAt(position);
    this.formArray.insert(newPosition, control);
  }

  remove(index: number) {
    this.formArray.removeAt(index);
  }

  asFormControl(control: AbstractControl): FormControl {
    return control as FormControl;
  }

}
