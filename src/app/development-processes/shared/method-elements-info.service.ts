import { Injectable } from '@angular/core';
import { Icon } from '../../model/icon';
import { Artifact } from '../../development-process-registry/method-elements/artifact/artifact';
import { Phase } from '../../development-process-registry/phase/phase';
import { SituationalFactorDefinition } from '../../development-process-registry/method-elements/situational-factor/situational-factor-definition';
import { Stakeholder } from '../../development-process-registry/method-elements/stakeholder/stakeholder';
import { Tool } from '../../development-process-registry/method-elements/tool/tool';
import { Type } from '../../development-process-registry/method-elements/type/type';
import { Domain } from '../../development-process-registry/knowledge/domain';

export interface MethodElementInfo {
  name: string;
  description: string;
  icon: Icon;
  route: string[];
}

@Injectable({
  providedIn: 'root',
})
export class MethodElementsInfoService {
  readonly methodElementInfo: MethodElementInfo[] = [
    {
      name: 'Artifacts',
      description: 'Artifacts define the inputs and outputs of methods',
      icon: new Icon(undefined, Artifact.defaultIcon),
      route: ['/', 'artifacts'],
    },
    {
      name: 'Phases',
      description: 'Phases classify the possible phases of development steps',
      icon: new Icon(undefined, Phase.defaultIcon),
      route: ['/', 'phase-list'],
    },
    {
      name: 'Situational Factors',
      description:
        'Situational Factors define the situation of development steps',
      icon: new Icon(undefined, SituationalFactorDefinition.defaultIcon),
      route: ['/', 'situationalFactors'],
    },
    {
      name: 'Stakeholders',
      description:
        'Stakeholders describe the involved people in the business model development',
      icon: new Icon(undefined, Stakeholder.defaultIcon),
      route: ['/', 'stakeholders'],
    },
    {
      name: 'Tools',
      description:
        'Tools describe the supporting software within the business model development',
      icon: new Icon(undefined, Tool.defaultIcon),
      route: ['/', 'tools'],
    },
    {
      name: 'Types',
      description: 'Types classify the possible types of development steps',
      icon: new Icon(undefined, Type.defaultIcon),
      route: ['/', 'types'],
    },
    {
      name: 'Domains',
      description:
        'Domains define the application areas of the supporting models',
      icon: new Icon(undefined, Domain.defaultIcon),
      route: ['/', 'domains'],
    },
  ];

  readonly methodElementInfoMap: { [name: string]: MethodElementInfo } =
    Object.fromEntries(this.methodElementInfo.map((info) => [info.name, info]));
}
