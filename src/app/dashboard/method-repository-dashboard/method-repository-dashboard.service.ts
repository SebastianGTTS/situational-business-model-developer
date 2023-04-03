import { Injectable } from '@angular/core';
import { PouchdbService } from '../../database/pouchdb.service';
import { Artifact } from '../../development-process-registry/method-elements/artifact/artifact';
import { Stakeholder } from '../../development-process-registry/method-elements/stakeholder/stakeholder';
import { Tool } from '../../development-process-registry/method-elements/tool/tool';
import { SituationalFactorDefinition } from '../../development-process-registry/method-elements/situational-factor/situational-factor-definition';
import { Domain } from '../../development-process-registry/knowledge/domain';
import { Type } from '../../development-process-registry/method-elements/type/type';
import { PhaseListService } from '../../development-process-registry/phase/phase-list.service';
import { PhaseList } from '../../development-process-registry/phase/phase-list';
import { ProcessPattern } from '../../development-process-registry/process-pattern/process-pattern';
import { DevelopmentMethod } from '../../development-process-registry/development-method/development-method';

@Injectable()
export class MethodRepositoryDashboardService {
  readonly numberElements: { [name: string]: number } = {};

  constructor(
    private phaseListService: PhaseListService,
    private pouchdbService: PouchdbService
  ) {
    this.load();
  }

  private load(): void {
    void this.loadElement(Artifact.typeName);
    void this.loadElement(Domain.typeName);
    void this.loadElement(SituationalFactorDefinition.typeName);
    void this.loadElement(Stakeholder.typeName);
    void this.loadElement(Tool.typeName);
    void this.loadElement(Type.typeName);
    void this.loadPhases();
    void this.loadElement(ProcessPattern.typeName);
    void this.loadElement(DevelopmentMethod.typeName);
  }

  private async loadElement(name: string): Promise<void> {
    this.numberElements[name] = (
      await this.pouchdbService.find(name, {
        fields: [],
        selector: {},
      })
    ).length;
  }

  private async loadPhases(): Promise<void> {
    const phaseList = await this.phaseListService.get();
    this.numberElements[PhaseList.typeName] = phaseList.phases.length;
  }
}
