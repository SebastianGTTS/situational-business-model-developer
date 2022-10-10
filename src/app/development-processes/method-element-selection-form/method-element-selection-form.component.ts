import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { MethodElementEntry } from '../../development-process-registry/method-elements/method-element';
import { FormControl, FormGroup, FormGroupDirective } from '@angular/forms';
import { merge, Observable, Subject, Subscription } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';
import { getTypeaheadInputPipe } from '../../shared/utils';

@Component({
  selector: 'app-method-element-selection-form',
  templateUrl: './method-element-selection-form.component.html',
  styleUrls: ['./method-element-selection-form.component.css'],
})
export class MethodElementSelectionFormComponent implements OnInit, OnDestroy {
  @Input() methodElementName!: string;
  @Input() multipleAllowed = false;
  @Input() removeAllowed = true;

  @Input() methodElements: MethodElementEntry[] = [];
  @Input() listNames: string[] = [];

  @Output() remove = new EventEmitter<void>();

  private subscriptions: Subscription[] = [];

  openListInput = new Subject<string>();
  openElementInput = new Subject<string>();

  constructor(private formGroupDirective: FormGroupDirective) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.listControl.valueChanges
        .pipe(
          filter(
            (value) =>
              this.elementControl.value &&
              this.elementControl.value.list !== value
          ),
          tap(() => this.elementControl.setValue(null))
        )
        .subscribe()
    );
    this.subscriptions.push(
      this.elementControl.valueChanges
        .pipe(
          filter((value) => value && this.listControl.value !== value.list),
          tap((value) => this.listControl.setValue(value.list))
        )
        .subscribe()
    );
    if (this.multipleAllowed) {
      this.subscriptions.push(
        this.multipleControl.valueChanges
          .pipe(
            tap(() => {
              this.checkElementControl();
            })
          )
          .subscribe()
      );
    }
  }

  ngOnDestroy(): void {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
    this.openListInput.complete();
    this.openElementInput.complete();
  }

  private checkElementControl(): void {
    if (this.multipleControl.value) {
      this.elementControl.setValue(null);
      this.elementControl.disable();
    } else {
      this.elementControl.enable();
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

  searchElements = (
    input: Observable<string>
  ): Observable<MethodElementEntry[]> => {
    return merge(getTypeaheadInputPipe(input), this.openElementInput).pipe(
      map((term) =>
        this.methodElements
          .filter(
            (methodElement) =>
              (!this.listControl.value ||
                methodElement.list.toLowerCase() ===
                  this.listControl.value.toLowerCase()) &&
              methodElement.name.toLowerCase().includes(term.toLowerCase())
          )
          .slice(0, 7)
      )
    );
  };

  formatter(x: { name: string }): string {
    return x.name;
  }

  get listControl(): FormControl {
    return this.formGroup.get('list') as FormControl;
  }

  get multipleControl(): FormControl {
    return this.formGroup.get('multiple') as FormControl;
  }

  get elementControl(): FormControl {
    return this.formGroup.get('element') as FormControl;
  }

  get formGroup(): FormGroup {
    return this.formGroupDirective.control;
  }
}
