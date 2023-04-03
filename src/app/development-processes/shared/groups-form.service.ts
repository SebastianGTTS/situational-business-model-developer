import { Inject, Injectable, InjectionToken } from '@angular/core';
import { MethodElement } from '../../development-process-registry/method-elements/method-element';
import {
  UntypedFormArray,
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { Groups } from '../../development-process-registry/development-method/groups';
import { MultipleSelection } from '../../development-process-registry/development-method/multiple-selection';
import { Group } from '../../development-process-registry/development-method/group';
import { DatabaseConstructor } from '../../database/database-model-part';

export const ELEMENT_CONSTRUCTOR = new InjectionToken<
  DatabaseConstructor<MethodElement>
>('Element Constructor');

export interface MethodElementFormValue<T extends MethodElement> {
  list: string;
  element: T;
  multiple: boolean;
  optional: boolean;
}

export interface GroupFormValue<T extends MethodElement> {
  items: MethodElementFormValue<T>[];
}

export interface GroupsFormValue<T extends MethodElement> {
  allowNone: boolean;
  groups: GroupFormValue<T>[];
  defaultGroup: number | undefined;
}

@Injectable()
export class GroupsFormService<T extends MethodElement> {
  form: UntypedFormGroup = this.fb.group({
    allowNone: this.fb.control(false),
    groups: this.fb.array([]),
    defaultGroup: this.fb.control(undefined),
  });

  constructor(
    protected fb: UntypedFormBuilder,
    @Inject(ELEMENT_CONSTRUCTOR)
    private elementConstructor: DatabaseConstructor<T>
  ) {}

  loadForm(groups: Groups<T>): void {
    this.allowNoneControl.setValue(groups.allowNone);
    this.form.setControl('groups', this.createGroupsFormArray(groups));
    if (groups.defaultGroupIndex != null) {
      this.defaultGroupControl.setValue(groups.defaultGroupIndex);
    }
  }

  addGroup(): void {
    this.groupsControl.push(this.createGroupForm());
  }

  removeGroup(index: number): void {
    const defaultGroupIndex = this.defaultGroupControl.value;
    if (index === defaultGroupIndex) {
      this.defaultGroupControl.setValue(undefined);
    }
    if (index < defaultGroupIndex) {
      this.defaultGroupControl.setValue(defaultGroupIndex - 1);
    }
    this.groupsControl.removeAt(index);
  }

  setDefaultGroup(index: number): void {
    this.defaultGroupControl.setValue(index);
  }

  unsetDefaultGroup(): void {
    this.defaultGroupControl.setValue(undefined);
  }

  addItem(group: UntypedFormGroup): void {
    this.getItemsFormArray(group).push(this.createItemForm());
  }

  removeItem(group: UntypedFormGroup, index: number): void {
    this.getItemsFormArray(group).removeAt(index);
  }

  private createGroupsFormArray(groups: Groups<T>): UntypedFormArray {
    return this.fb.array(
      groups.groups.map((group) => this.createGroupForm(group))
    );
  }

  private createGroupForm(group?: Group<T>): UntypedFormGroup {
    if (group == null) {
      return this.fb.group({
        items: this.fb.array([]),
      });
    } else {
      return this.fb.group({
        items: this.fb.array(
          group.items.map((item) => this.createItemForm(item))
        ),
      });
    }
  }

  createItemForm(item?: MultipleSelection<T>): UntypedFormGroup {
    if (item == null) {
      return this.fb.group({
        list: ['', Validators.required],
        element: null,
        multiple: false,
        optional: false,
      });
    } else {
      return this.fb.group({
        list: [item.list, Validators.required],
        element: {
          value: item.element,
          disabled: item.multiple,
        },
        multiple: item.multiple,
        optional: item.optional,
      });
    }
  }

  getGroups(groups: GroupsFormValue<T>): Groups<T> {
    const groupObjects = groups.groups.map((group) => this.getGroup(group));
    return new Groups<T>(
      undefined,
      {
        allowNone: groups.allowNone,
        groups: groupObjects,
        defaultGroup:
          groups.defaultGroup != null
            ? groupObjects[groups.defaultGroup]
            : undefined,
      },
      this.elementConstructor
    );
  }

  getGroup(group: GroupFormValue<T>): Group<T> {
    return new Group<T>(
      undefined,
      {
        items: group.items.map((item) => this.getItem(item)),
      },
      this.elementConstructor
    );
  }

  getItem(item: MethodElementFormValue<T>): MultipleSelection<T> {
    return new MultipleSelection(
      undefined,
      {
        list: item.list,
        element: item.element,
        multiple: item.multiple,
        optional: item.optional,
      },
      this.elementConstructor
    );
  }

  get groupsControl(): UntypedFormArray {
    return this.form.get('groups') as UntypedFormArray;
  }

  get defaultGroupControl(): UntypedFormControl {
    return this.form.get('defaultGroup') as UntypedFormControl;
  }

  get allowNoneControl(): UntypedFormControl {
    return this.form.get('allowNone') as UntypedFormControl;
  }

  getItemsFormArray(group: UntypedFormGroup): UntypedFormArray {
    return group.get('items') as UntypedFormArray;
  }

  getElementControl(item: UntypedFormGroup): UntypedFormControl {
    return item.get('element') as UntypedFormControl;
  }
}
