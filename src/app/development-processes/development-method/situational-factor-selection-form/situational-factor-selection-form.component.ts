import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { merge, Observable, Subject, Subscription } from 'rxjs';
import {
  FormGroupDirective,
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
} from '@angular/forms';
import { filter, map, tap } from 'rxjs/operators';
import {
  SituationalFactorDefinition,
  SituationalFactorDefinitionEntry,
} from '../../../development-process-registry/method-elements/situational-factor/situational-factor-definition';
import { getTypeaheadInputPipe } from '../../../shared/utils';
import { NgbTypeaheadSelectItemEvent } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-situational-factor-selection-form',
  templateUrl: './situational-factor-selection-form.component.html',
  styleUrls: ['./situational-factor-selection-form.component.css'],
})
export class SituationalFactorSelectionFormComponent
  implements OnInit, OnDestroy
{
  @Input() index!: number;

  @Input() methodElements!: SituationalFactorDefinitionEntry[];
  @Input() listNames!: string[];

  @Output() remove = new EventEmitter<void>();

  private listChangeSubscription?: Subscription;
  private factorChangeSubscription?: Subscription;

  openListInput = new Subject<string>();
  openElementInput = new Subject<string>();

  constructor(
    private fb: UntypedFormBuilder,
    private formGroupDirective: FormGroupDirective
  ) {}

  ngOnInit(): void {
    this.listChangeSubscription = this.listControl.valueChanges
      .pipe(
        filter(
          (value) =>
            this.factorControl.value && this.factorControl.value.list !== value
        ),
        tap(() =>
          this.elementControl.setValue({
            factor: null,
            value: null,
          })
        )
      )
      .subscribe();
    this.factorChangeSubscription = this.factorControl.valueChanges
      .pipe(
        tap(() => this.valueControl.setValue(null)),
        filter((value) => value && this.listControl.value !== value.list),
        tap((value) => this.listControl.setValue(value.list))
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    if (this.listChangeSubscription != null) {
      this.listChangeSubscription.unsubscribe();
    }
    if (this.factorChangeSubscription != null) {
      this.factorChangeSubscription.unsubscribe();
    }
    this.openListInput.complete();
    this.openElementInput.complete();
  }

  searchLists = (input: Observable<string>): Observable<string[]> => {
    return merge(getTypeaheadInputPipe(input), this.openListInput).pipe(
      map((term) =>
        this.listNames
          .filter((listItem) =>
            listItem.toLowerCase().includes(term.toLowerCase())
          )
          .slice(0, 7)
      )
    );
  };

  searchElements = (
    input: Observable<string>
  ): Observable<SituationalFactorDefinitionEntry[]> => {
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

  selectFactor(
    event: NgbTypeaheadSelectItemEvent<SituationalFactorDefinitionEntry>
  ): void {
    event.preventDefault();
    this.factorControl.setValue(
      new SituationalFactorDefinition(event.item, undefined)
    );
  }

  get values(): string[] {
    if (this.factorValue == null) {
      return [];
    }
    return this.factorValue.values;
  }

  formatter(x: { name: string }): string {
    return x.name;
  }

  get listControl(): UntypedFormControl {
    return this.formGroup.get('list') as UntypedFormControl;
  }

  get elementControl(): UntypedFormControl {
    return this.formGroup.get('element') as UntypedFormControl;
  }

  get factorControl(): UntypedFormControl {
    return this.elementControl.get('factor') as UntypedFormControl;
  }

  get factorValue(): SituationalFactorDefinition | undefined {
    return this.factorControl.value;
  }

  get valueControl(): UntypedFormControl {
    return this.elementControl.get('value') as UntypedFormControl;
  }

  get formGroup(): UntypedFormGroup {
    return this.formGroupDirective.control;
  }
}
