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
import { GroupsFormService } from '../../shared/groups-form.service';
import {
  MethodElement,
  MethodElementEntry,
} from '../../../development-process-registry/method-elements/method-element';
import { UntypedFormGroup } from '@angular/forms';
import { Groups } from '../../../development-process-registry/development-method/groups';
import { Subscription } from 'rxjs';
import { debounceTime, tap } from 'rxjs/operators';
import { DevelopmentMethod } from '../../../development-process-registry/development-method/development-method';
import { Updatable, UPDATABLE } from '../../../shared/updatable';

@Component({
  selector: 'app-groups-form',
  templateUrl: './groups-form.component.html',
  styleUrls: ['./groups-form.component.css'],
  providers: [
    {
      provide: UPDATABLE,
      useExisting: GroupsFormComponent,
    },
  ],
})
export class GroupsFormComponent<T extends MethodElement>
  implements OnInit, OnChanges, OnDestroy, Updatable
{
  @Input() idPrefix?: string;

  @Input() groups!: Groups<T>;

  @Input() methodElementName!: string;
  /**
   * Set if the group items have mappings, i.e., are input artifacts
   */
  @Input() developmentMethod?: DevelopmentMethod;

  @Input() methodElements: MethodElementEntry[] = [];
  @Input() listNames: string[] = [];

  @Output() submitGroupsForm = new EventEmitter<Groups<T>>();

  changed = false;
  private changeSubscription?: Subscription;

  constructor(private groupsFormService: GroupsFormService<T>) {}

  ngOnInit(): void {
    this.changeSubscription = this.groupsFormService.form.valueChanges
      .pipe(
        debounceTime(300),
        tap(
          (value) =>
            (this.changed = !this.groups.equals(
              this.groupsFormService.getGroups(value)
            ))
        )
      )
      .subscribe();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.groups) {
      const oldGroups: Groups<T> = changes.groups.previousValue;
      const newGroups: Groups<T> = changes.groups.currentValue;
      if (!newGroups.equals(oldGroups)) {
        this.groupsFormService.loadForm(newGroups);
      }
    }
  }

  ngOnDestroy(): void {
    if (this.changeSubscription != null) {
      this.changeSubscription.unsubscribe();
    }
  }

  addGroup(): void {
    this.groupsFormService.addGroup();
  }

  removeGroup(index: number): void {
    this.groupsFormService.removeGroup(index);
  }

  submitForm(): void {
    this.submitGroupsForm.emit(
      this.groupsFormService.getGroups(this.groupsFormService.form.value)
    );
  }

  update(): void {
    if (this.changed && this.form.valid) {
      this.submitForm();
    }
  }

  setDefaultGroup(index: number): void {
    this.groupsFormService.setDefaultGroup(index);
  }

  unsetDefaultGroup(): void {
    this.groupsFormService.unsetDefaultGroup();
  }

  get form(): UntypedFormGroup {
    return this.groupsFormService.form;
  }

  /**
   * Get all group form groups
   */
  get groupFormGroups(): UntypedFormGroup[] {
    return this.groupsFormService.groupsControl.controls as UntypedFormGroup[];
  }

  isDefaultGroup(index: number): boolean {
    return index === this.groupsFormService.defaultGroupControl.value;
  }

  isEmpty(group: UntypedFormGroup): boolean {
    return this.groupsFormService.getItemsFormArray(group).length === 0;
  }

  getId(suffix: string): string {
    const prefix = this.idPrefix;
    if (prefix != null && prefix != '') {
      return prefix + '-' + suffix;
    } else {
      return '';
    }
  }
}
