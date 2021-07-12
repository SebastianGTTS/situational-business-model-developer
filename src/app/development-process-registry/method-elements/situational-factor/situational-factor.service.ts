import { Injectable } from '@angular/core';
import { SituationalFactorDefinition } from './situational-factor-definition';
import { DevelopmentProcessRegistryModule } from '../../development-process-registry.module';
import { MethodElementService } from '../method-element.service';

@Injectable({
  providedIn: DevelopmentProcessRegistryModule
})
export class SituationalFactorService extends MethodElementService<SituationalFactorDefinition> {

  protected createMethodElement(element: Partial<SituationalFactorDefinition>): SituationalFactorDefinition {
    return new SituationalFactorDefinition(element);
  }

  protected getTypeName(): string {
    return SituationalFactorDefinition.typeName;
  }

}
