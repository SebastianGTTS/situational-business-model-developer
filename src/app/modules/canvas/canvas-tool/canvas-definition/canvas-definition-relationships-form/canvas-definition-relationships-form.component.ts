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
import {
  UntypedFormArray,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime, tap } from 'rxjs/operators';
import { equalsListString } from '../../../../../shared/utils';
import { Updatable, UPDATABLE } from '../../../../../shared/updatable';

@Component({
  selector: 'app-canvas-definition-relationships-form',
  templateUrl: './canvas-definition-relationships-form.component.html',
  styleUrls: ['./canvas-definition-relationships-form.component.css'],
  providers: [
    {
      provide: UPDATABLE,
      useExisting: CanvasDefinitionRelationshipsFormComponent,
    },
  ],
})
export class CanvasDefinitionRelationshipsFormComponent
  implements OnInit, OnChanges, OnDestroy, Updatable
{
  @Input() relationshipTypes!: string[];

  @Output() submitRelationshipTypesForm = new EventEmitter<UntypedFormArray>();

  form: UntypedFormGroup = this.fb.group({
    relationshipTypes: this.fb.array([]),
  });
  changed = false;

  private changeSubscription?: Subscription;

  constructor(private fb: UntypedFormBuilder) {}

  ngOnInit(): void {
    this.changeSubscription = this.form.valueChanges
      .pipe(
        debounceTime(300),
        tap(
          (value) =>
            (this.changed = !this.equals(
              this.relationshipTypes,
              value.relationshipTypes
            ))
        )
      )
      .subscribe();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.relationshipTypes) {
      const oldRelationshipTypes: string[] =
        changes.relationshipTypes.previousValue;
      const newRelationshipTypes: string[] =
        changes.relationshipTypes.currentValue;
      if (!this.equals(newRelationshipTypes, oldRelationshipTypes)) {
        this.loadForm(newRelationshipTypes);
      }
    }
  }

  ngOnDestroy(): void {
    if (this.changeSubscription != null) {
      this.changeSubscription.unsubscribe();
    }
  }

  // noinspection JSMethodCanBeStatic
  private equals(
    relationshipTypesA: string[],
    relationshipTypesB: string[]
  ): boolean {
    return equalsListString(relationshipTypesA, relationshipTypesB);
  }

  private loadForm(relationshipTypes: string[]): void {
    this.form.setControl(
      'relationshipTypes',
      this.fb.array(
        relationshipTypes.map((typeName) =>
          this.fb.control(typeName, Validators.required)
        )
      )
    );
  }

  submitForm(): void {
    this.submitRelationshipTypesForm.emit(this.formArray);
  }

  update(): void {
    if (this.changed && this.form.valid) {
      this.submitForm();
    }
  }

  get formArray(): UntypedFormArray {
    return this.form.get('relationshipTypes') as UntypedFormArray;
  }
}
