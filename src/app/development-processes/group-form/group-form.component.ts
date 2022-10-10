import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective } from '@angular/forms';
import { GroupsFormService } from '../shared/groups-form.service';
import {
  MethodElement,
  MethodElementEntry,
} from '../../development-process-registry/method-elements/method-element';
import { DevelopmentMethod } from '../../development-process-registry/development-method/development-method';
import { Artifact } from '../../development-process-registry/method-elements/artifact/artifact';

@Component({
  selector: 'app-group-form',
  templateUrl: './group-form.component.html',
  styleUrls: ['./group-form.component.css'],
})
export class GroupFormComponent<T extends MethodElement> {
  @Input() methodElementName!: string;
  /**
   * Set if the group items have mappings, i.e., are input artifacts
   */
  @Input() developmentMethod?: DevelopmentMethod;

  @Input() methodElements: MethodElementEntry[] = [];
  @Input() listNames: string[] = [];

  constructor(
    private formGroupDirective: FormGroupDirective,
    private groupsFormService: GroupsFormService<T>
  ) {}

  addItem(): void {
    this.groupsFormService.addItem(this.groupFormGroup);
  }

  removeItem(index: number): void {
    this.groupsFormService.removeItem(this.groupFormGroup, index);
  }

  get groupFormGroup(): FormGroup {
    return this.formGroupDirective.form;
  }

  get itemFormGroups(): FormGroup[] {
    return this.groupsFormService.getItemsFormArray(this.groupFormGroup)
      .controls as FormGroup[];
  }

  /**
   * Whether the selected item is an internal artifact, i.e., has a meta model
   *
   * @param item
   */
  isInternalArtifact(item: FormGroup): boolean {
    const elementControl: FormControl = this.getElementControl(item);
    return elementControl.value != null && elementControl.value.metaModel;
  }

  getElementValueAsArtifact(item: FormGroup): Artifact {
    return this.getElementControl(item).value;
  }

  private getElementControl(item: FormGroup): FormControl {
    return this.groupsFormService.getElementControl(item);
  }
}
