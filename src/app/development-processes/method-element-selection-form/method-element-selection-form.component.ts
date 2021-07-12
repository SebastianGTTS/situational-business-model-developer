import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { MethodElement } from '../../development-process-registry/method-elements/method-element';
import { FormBuilder, FormControl, FormGroupDirective } from '@angular/forms';
import { merge, Observable, Subject, Subscription } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';
import { getTypeaheadInputPipe } from '../../shared/utils';

@Component({
  selector: 'app-method-element-selection-form',
  templateUrl: './method-element-selection-form.component.html',
  styleUrls: ['./method-element-selection-form.component.css']
})
export class MethodElementSelectionFormComponent implements OnInit, OnDestroy {

  @Input() methodElementName: string;
  @Input() multipleAllowed = false;

  @Input() methodElements: MethodElement[] = [];
  @Input() listNames: string[] = [];

  @Output() remove = new EventEmitter<void>();

  private listChangeSubscription: Subscription;
  private multipleChangeSubscription: Subscription;
  private elementChangeSubscription: Subscription;

  openListInput = new Subject<string>();
  openElementInput = new Subject<string>();

  constructor(
    private fb: FormBuilder,
    private formGroupDirective: FormGroupDirective,
  ) {
  }

  ngOnInit() {
    this.listChangeSubscription = this.listControl.valueChanges.pipe(
      filter((value) => this.elementControl.value && this.elementControl.value.list !== value),
      tap(() => this.elementControl.setValue(null)),
    ).subscribe();
    this.elementChangeSubscription = this.elementControl.valueChanges.pipe(
      filter((value) => value && this.listControl.value !== value.list),
      tap((value) => this.listControl.setValue(value.list)),
    ).subscribe();
    if (this.multipleAllowed) {
      this.multipleChangeSubscription = this.multipleControl.valueChanges.pipe(
        tap((value) => {
          if (value) {
            this.elementControl.disable();
            this.multipleElementsControl.disable();
          } else {
            this.elementControl.enable();
            this.multipleElementsControl.enable();
          }
        }),
        filter((value) => value),
        tap(() => {
          this.elementControl.setValue(null);
          this.multipleElementsControl.setValue(false);
        }),
      ).subscribe();
    }
  }

  ngOnDestroy() {
    if (this.listChangeSubscription) {
      this.listChangeSubscription.unsubscribe();
    }
    if (this.elementChangeSubscription) {
      this.elementChangeSubscription.unsubscribe();
    }
    if (this.multipleChangeSubscription) {
      this.multipleChangeSubscription.unsubscribe();
    }
    this.openListInput.complete();
    this.openElementInput.complete();
  }

  searchLists = (input: Observable<string>) => {
    return merge(getTypeaheadInputPipe(input), this.openListInput).pipe(
      map((term) => this.listNames.filter((listItem) => listItem.toLowerCase().includes(term.toLowerCase())).slice(0, 10)),
    );
  }

  searchElements = (input: Observable<string>) => {
    return merge(getTypeaheadInputPipe(input), this.openElementInput).pipe(
      map(
        (term) => this.methodElements.filter((methodElement) =>
          (!this.listControl.value || methodElement.list.toLowerCase() === this.listControl.value.toLowerCase()) &&
          methodElement.name.toLowerCase().includes(term.toLowerCase())
        ).slice(0, 7)
      ),
    );
  }

  formatter(x: { name: string }) {
    return x.name;
  }

  get listControl() {
    return this.formGroup.get('list');
  }

  get multipleControl() {
    return this.formGroup.get('multiple');
  }

  get elementControl() {
    return this.formGroup.get('element') as FormControl;
  }

  get multipleElementsControl() {
    return this.formGroup.get('multipleElements') as FormControl;
  }

  get formGroup() {
    return this.formGroupDirective.control;
  }

}
