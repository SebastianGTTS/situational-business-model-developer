import { Component, Input } from '@angular/core';
import {
  FormGroupDirective,
  UntypedFormControl,
  UntypedFormGroup,
} from '@angular/forms';
import { GroupsFormService } from '../../shared/groups-form.service';
import {
  MethodElement,
  MethodElementEntry,
} from '../../../development-process-registry/method-elements/method-element';
import { DevelopmentMethod } from '../../../development-process-registry/development-method/development-method';
import { Artifact } from '../../../development-process-registry/method-elements/artifact/artifact';

@Component({
  selector: 'app-group-form',
  templateUrl: './group-form.component.html',
  styleUrls: ['./group-form.component.css'],
})
export class GroupFormComponent<T extends MethodElement> {
  @Input() idPrefix?: string;
  @Input() index?: number;

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

  get groupFormGroup(): UntypedFormGroup {
    return this.formGroupDirective.form;
  }

  get itemFormGroups(): UntypedFormGroup[] {
    return this.groupsFormService.getItemsFormArray(this.groupFormGroup)
      .controls as UntypedFormGroup[];
  }

  /**
   * Whether the selected item is an internal artifact, i.e., has a meta artifact
   *
   * @param item
   */
  isInternalArtifact(item: UntypedFormGroup): boolean {
    const elementControl: UntypedFormControl = this.getElementControl(item);
    return (
      elementControl.value != null && elementControl.value.metaArtifact != null
    );
  }

  getElementValueAsArtifact(item: UntypedFormGroup): Artifact {
    return this.getElementControl(item).value;
  }

  private getElementControl(item: UntypedFormGroup): UntypedFormControl {
    return this.groupsFormService.getElementControl(item);
  }

  get internalIdPrefix(): string | undefined {
    if (this.idPrefix != null && this.idPrefix != '' && this.index != null) {
      return this.idPrefix + '-' + this.index;
    } else {
      return undefined;
    }
  }

  getId(suffix: string): string {
    const prefix = this.internalIdPrefix;
    if (prefix != null && prefix != '') {
      return prefix + '-' + suffix;
    } else {
      return '';
    }
  }
}
