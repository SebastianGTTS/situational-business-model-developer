import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { MethodElementEntry } from '../../../development-process-registry/method-elements/method-element';
import {
  FormGroupDirective,
  UntypedFormControl,
  UntypedFormGroup,
} from '@angular/forms';
import { merge, Observable, Subject, Subscription } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';
import { getTypeaheadInputPipe } from '../../../shared/utils';

let methodElementSelectionFormId = 0;

@Component({
  selector: 'app-method-element-selection-form',
  templateUrl: './method-element-selection-form.component.html',
  styleUrls: ['./method-element-selection-form.component.css'],
})
export class MethodElementSelectionFormComponent implements OnInit, OnDestroy {
  @Input() idPrefix?: string;
  @Input() index?: number;

  @Input() methodElementName!: string;
  @Input() multipleAllowed = false;
  @Input() removeAllowed = true;
  @Input() showValid = false;

  @Input() methodElements: MethodElementEntry[] = [];
  @Input() listNames: string[] = [];

  @Output() remove = new EventEmitter<void>();

  private _id: number;

  private subscriptions: Subscription[] = [];

  openListInput = new Subject<string>();
  openElementInput = new Subject<string>();

  constructor(private formGroupDirective: FormGroupDirective) {
    this._id = methodElementSelectionFormId;
    methodElementSelectionFormId += 1;
  }

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

  get listControl(): UntypedFormControl {
    return this.formGroup.get('list') as UntypedFormControl;
  }

  get multipleControl(): UntypedFormControl {
    return this.formGroup.get('multiple') as UntypedFormControl;
  }

  get elementControl(): UntypedFormControl {
    return this.formGroup.get('element') as UntypedFormControl;
  }

  get formGroup(): UntypedFormGroup {
    return this.formGroupDirective.control;
  }

  get listValid(): boolean {
    return this.showValid && this.listControl.value !== '';
  }

  get elementValid(): boolean {
    return this.showValid && this.elementControl.value != null;
  }

  get id(): string {
    if (this.idPrefix != null && this.idPrefix != '' && this.index != null) {
      return this.idPrefix + '-' + this.index;
    } else {
      return this._id.toString();
    }
  }
}
