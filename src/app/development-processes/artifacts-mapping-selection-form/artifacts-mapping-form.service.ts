import { Injectable } from '@angular/core';
import {
  GroupFormValue,
  GroupsFormService,
  GroupsFormValue,
  MethodElementFormValue,
} from '../shared/groups-form.service';
import { Artifact } from '../../development-process-registry/method-elements/artifact/artifact';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ArtifactMultipleMappingSelection } from '../../development-process-registry/development-method/artifact-multiple-mapping-selection';
import {
  ArtifactMappingFormService,
  MappingFormValueValid,
} from '../shared/artifact-mapping-form.service';
import { ArtifactGroups } from '../../development-process-registry/development-method/artifact-groups';
import { ArtifactGroup } from '../../development-process-registry/development-method/artifact-group';

interface ArtifactMultipleMappingSelectionFormValue
  extends MethodElementFormValue<Artifact> {
  mapping: MappingFormValueValid[];
}

interface ArtifactGroupFormValue extends GroupFormValue<Artifact> {
  items: ArtifactMultipleMappingSelectionFormValue[];
}

interface ArtifactGroupsFormValue extends GroupsFormValue<Artifact> {
  groups: ArtifactGroupFormValue[];
}

@Injectable()
export class ArtifactsMappingFormService extends GroupsFormService<Artifact> {
  constructor(
    fb: FormBuilder,
    private artifactMappingFormService: ArtifactMappingFormService
  ) {
    super(fb, Artifact);
  }

  createItemForm(item?: ArtifactMultipleMappingSelection): FormGroup {
    const itemGroup = super.createItemForm(item);
    if (item == null) {
      itemGroup.setControl('mapping', this.fb.array([]));
    } else {
      itemGroup.setControl(
        'mapping',
        this.artifactMappingFormService.createMappingsForm(item.mapping)
      );
    }
    itemGroup.addValidators((control) => {
      if (
        control.get('optional')?.value &&
        (control.get('mapping') as FormArray).length > 0
      ) {
        return { optionalAndMapping: true };
      }
      return null;
    });
    return itemGroup;
  }

  getGroups(groups: ArtifactGroupsFormValue): ArtifactGroups {
    const groupObjects = groups.groups.map((group) => this.getGroup(group));
    return new ArtifactGroups(undefined, {
      allowNone: groups.allowNone,
      groups: groupObjects,
      defaultGroup:
        groups.defaultGroup != null
          ? groupObjects[groups.defaultGroup]
          : undefined,
    });
  }

  getGroup(group: ArtifactGroupFormValue): ArtifactGroup {
    return new ArtifactGroup(undefined, {
      items: group.items.map((item) => this.getItem(item)),
    });
  }

  getItem(
    item: ArtifactMultipleMappingSelectionFormValue
  ): ArtifactMultipleMappingSelection {
    return new ArtifactMultipleMappingSelection(undefined, {
      list: item.list,
      element: item.element,
      multiple: item.multiple,
      optional: item.optional,
      mapping: this.artifactMappingFormService.getMappings(item.mapping),
    });
  }
}
