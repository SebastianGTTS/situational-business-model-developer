import { Injectable } from '@angular/core';
import { MethodElementService } from '../method-element.service';
import { Stakeholder } from './stakeholder';
import { DevelopmentProcessRegistryModule } from '../../development-process-registry.module';

@Injectable({
  providedIn: DevelopmentProcessRegistryModule,
})
export class StakeholderService extends MethodElementService<Stakeholder> {
  protected createElement(element: Partial<Stakeholder>): Stakeholder {
    return new Stakeholder(element);
  }

  protected get typeName(): string {
    return Stakeholder.typeName;
  }
}
