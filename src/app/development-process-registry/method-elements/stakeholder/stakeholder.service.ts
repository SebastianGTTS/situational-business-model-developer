import { Injectable } from '@angular/core';
import { MethodElementService } from '../method-element.service';
import { Stakeholder, StakeholderInit } from './stakeholder';
import { DevelopmentProcessRegistryModule } from '../../development-process-registry.module';

@Injectable({
  providedIn: DevelopmentProcessRegistryModule,
})
export class StakeholderService extends MethodElementService<
  Stakeholder,
  StakeholderInit
> {
  protected readonly typeName = Stakeholder.typeName;

  protected readonly elementConstructor = Stakeholder;
}
