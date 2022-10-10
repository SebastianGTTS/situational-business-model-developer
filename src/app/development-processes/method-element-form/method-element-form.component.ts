import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MethodElement } from '../../development-process-registry/method-elements/method-element';
import { merge, Observable, Subject, Subscription } from 'rxjs';
import { getTypeaheadInputPipe } from '../../shared/utils';
import { debounceTime, map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-method-element-form',
  templateUrl: './method-element-form.component.html',
  styleUrls: ['./method-element-form.component.css'],
})
export class MethodElementFormComponent
  implements OnInit, OnChanges, OnDestroy
{
  @Input() methodElement?: MethodElement;
  @Input() listNames: string[] = [];

  @Output() submitMethodElementForm = new EventEmitter<FormGroup>();

  methodElementForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    list: ['', Validators.required],
    description: [''],
  });
  changed = false;

  openListInput = new Subject<string>();

  private changeSubscription?: Subscription;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.changeSubscription = this.methodElementForm.valueChanges
      .pipe(
        debounceTime(300),
        tap(
          (value) =>
            (this.changed =
              this.methodElement != null &&
              !this.equals(this.methodElement, value))
        )
      )
      .subscribe();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.methodElement) {
      const oldMethodElement: MethodElement =
        changes.methodElement.previousValue;
      const newMethodElement: MethodElement =
        changes.methodElement.currentValue;
      if (!this.equals(newMethodElement, oldMethodElement)) {
        this.loadForm(newMethodElement);
      }
    }
  }

  ngOnDestroy(): void {
    if (this.changeSubscription) {
      this.changeSubscription.unsubscribe();
    }
    this.openListInput.complete();
  }

  private loadForm(methodElement: MethodElement): void {
    this.methodElementForm.patchValue(methodElement);
  }

  // noinspection JSMethodCanBeStatic
  private equals(
    methodElementA: MethodElement,
    methodElementB: MethodElement
  ): boolean {
    if (methodElementA == null && methodElementB == null) {
      return true;
    }
    if (methodElementA == null || methodElementB == null) {
      return false;
    }
    return (
      methodElementA.list === methodElementB.list &&
      methodElementA.description === methodElementB.description
    );
  }

  submitForm(): void {
    this.submitMethodElementForm.emit(this.methodElementForm);
    if (this.methodElement == null) {
      this.methodElementForm.reset();
    }
  }

  searchLists = (input: Observable<string>): Observable<string[]> => {
    return merge(getTypeaheadInputPipe(input), this.openListInput).pipe(
      map((term) =>
        this.listNames
          .filter((listItem) =>
            listItem.toLowerCase().includes(term.toLowerCase())
          )
          .slice(0, 10)
      )
    );
  };
}
