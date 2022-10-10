import { Inject, Injectable, InjectionToken, OnDestroy } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { DatabaseConstructor } from '../../database/database-model-part';
import { MethodElement } from '../../development-process-registry/method-elements/method-element';
import { GroupDecision } from '../../development-process-registry/bm-process/group-decision';
import { ElementDecision } from '../../development-process-registry/bm-process/element-decision';
import { Group } from '../../development-process-registry/development-method/group';
import { MultipleSelection } from '../../development-process-registry/development-method/multiple-selection';
import { Groups } from '../../development-process-registry/development-method/groups';
import { Subscription } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

export const ELEMENT_CONSTRUCTOR = new InjectionToken<
  DatabaseConstructor<MethodElement>
>('Group Decision Element Constructor');

export interface ElementDecisionFormValue<T extends MethodElement> {
  element?: T;
  elements?: T[];
}

export interface GroupDecisionFormValue<T extends MethodElement> {
  groupIndex: number | undefined;
  elementDecisions: ElementDecisionFormValue<T>[];
}

@Injectable()
export class GroupDecisionFormService<T extends MethodElement>
  implements OnDestroy
{
  form: FormGroup = this.fb.group({
    groupIndex: [undefined, Validators.required],
    elementDecisions: this.fb.array([]),
  });

  private groups?: Readonly<Groups<T>>;

  private groupChangeSubscription: Subscription;

  constructor(
    private fb: FormBuilder,
    @Inject(ELEMENT_CONSTRUCTOR)
    private elementConstructor: DatabaseConstructor<T>
  ) {
    this.groupChangeSubscription = this.groupIndexControl.valueChanges
      .pipe(distinctUntilChanged())
      .subscribe((value) => {
        if (value != null) {
          const elementDecisionsFromArray =
            this.createElementDecisionsFormArray(this.groups?.groups[value]);
          if (elementDecisionsFromArray != null) {
            this.form.setControl('elementDecisions', elementDecisionsFromArray);
          }
        } else {
          this.form.removeControl('elementDecisions');
        }
      });
  }

  ngOnDestroy(): void {
    this.groupChangeSubscription.unsubscribe();
  }

  addElement(elementDecisionFormGroup: FormGroup, index?: number): void {
    const formArray = this.getElementsFormArray(elementDecisionFormGroup);
    if (formArray == null) {
      return;
    }
    if (index == null) {
      index = formArray.length;
    }
    formArray.insert(index, this.fb.control(undefined, Validators.required));
  }

  removeElement(elementDecisionFormGroup: FormGroup, index: number): void {
    const formArray = this.getElementsFormArray(elementDecisionFormGroup);
    if (formArray == null) {
      return;
    }
    formArray.removeAt(index);
  }

  updateGroups(groups: Readonly<Groups<T>>): void {
    this.groups = groups;
    if (!groups.allowNone) {
      this.groupIndexControl.setValidators(Validators.required);
    } else {
      this.groupIndexControl.setValidators(null);
    }
    this.groupIndexControl.updateValueAndValidity({ emitEvent: false });
  }

  loadForm(groupDecision: GroupDecision<T>): void {
    this.updateGroups(groupDecision.groups);
    this.groupIndexControl.setValue(groupDecision.groupIndex, {
      emitEvent: false,
    });
    const elementDecisionsFromArray = this.createElementDecisionsFormArray(
      groupDecision.group,
      groupDecision.elementDecisions
    );
    if (elementDecisionsFromArray != null) {
      this.form.setControl('elementDecisions', elementDecisionsFromArray);
    } else {
      this.form.removeControl('elementDecisions');
    }
  }

  private createElementDecisionsFormArray(
    group?: Readonly<Group<T>> | null,
    elementDecisions?: ElementDecision<T>[]
  ): FormArray | undefined {
    if (group == null) {
      return undefined;
    }
    const decisionFormGroups: FormGroup[] = group.items.map((element, index) =>
      this.createElementDecisionFormGroup(element, elementDecisions?.[index])
    );
    return this.fb.array(decisionFormGroups);
  }

  private createElementDecisionFormGroup(
    selection: MultipleSelection<T>,
    elementDecision?: ElementDecision<T>
  ): FormGroup {
    if (selection.multiple) {
      if (elementDecision != null) {
        return this.fb.group({
          elements: this.fb.array(
            elementDecision.elements?.map((element) =>
              this.fb.control(element, Validators.required)
            ) ?? []
          ),
        });
      } else {
        return this.fb.group({
          elements: this.fb.array([]),
        });
      }
    }
    return this.fb.group({ element: elementDecision?.element });
  }

  getGroupDecision(value: GroupDecisionFormValue<T>): GroupDecision<T> {
    if (this.groups == null) {
      throw new Error('Form must be loaded before getting GroupDecisions');
    }
    return new GroupDecision<T>(
      undefined,
      {
        groupIndex: value.groupIndex,
        elementDecisions: value.elementDecisions,
      },
      this.elementConstructor,
      this.groups
    );
  }

  get groupIndexControl(): FormControl {
    return this.form.get('groupIndex') as FormControl;
  }

  getElementsFormArray(
    elementDecisionFormGroup: FormGroup
  ): FormArray | undefined {
    return elementDecisionFormGroup.get('elements') as FormArray | undefined;
  }
}
