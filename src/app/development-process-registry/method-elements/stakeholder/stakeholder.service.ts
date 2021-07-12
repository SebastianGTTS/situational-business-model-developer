import { Injectable } from '@angular/core';
import { MethodElementService } from '../method-element.service';
import { Stakeholder } from './stakeholder';
import { DevelopmentProcessRegistryModule } from '../../development-process-registry.module';

@Injectable({
  providedIn: DevelopmentProcessRegistryModule
})
export class StakeholderService extends MethodElementService<Stakeholder> {

  protected createMethodElement(element: Partial<Stakeholder>): Stakeholder {
    return new Stakeholder(element);
  }

  protected getTypeName(): string {
    return Stakeholder.typeName;
  }

}
