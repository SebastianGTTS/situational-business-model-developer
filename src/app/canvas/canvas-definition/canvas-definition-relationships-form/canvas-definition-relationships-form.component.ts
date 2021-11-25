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
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime, tap } from 'rxjs/operators';
import { equalsListString } from '../../../shared/utils';

@Component({
  selector: 'app-canvas-definition-relationships-form',
  templateUrl: './canvas-definition-relationships-form.component.html',
  styleUrls: ['./canvas-definition-relationships-form.component.css'],
})
export class CanvasDefinitionRelationshipsFormComponent
  implements OnInit, OnChanges, OnDestroy
{
  @Input() relationshipTypes: string[];

  @Output() submitRelationshipTypesForm = new EventEmitter<FormArray>();

  form: FormGroup = this.fb.group({
    relationshipTypes: this.fb.array([]),
  });
  changed = false;

  private changeSubscription: Subscription;

  constructor(private fb: FormBuilder) {}

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
    if (this.changeSubscription) {
      this.changeSubscription.unsubscribe();
    }
  }

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

  get formArray(): FormArray {
    return this.form.get('relationshipTypes') as FormArray;
  }
}
