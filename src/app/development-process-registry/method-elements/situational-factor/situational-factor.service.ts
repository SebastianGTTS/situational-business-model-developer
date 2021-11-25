import { Injectable } from '@angular/core';
import { SituationalFactorDefinition } from './situational-factor-definition';
import { DevelopmentProcessRegistryModule } from '../../development-process-registry.module';
import { MethodElementService } from '../method-element.service';

@Injectable({
  providedIn: DevelopmentProcessRegistryModule,
})
export class SituationalFactorService extends MethodElementService<SituationalFactorDefinition> {
  protected createElement(
    element: Partial<SituationalFactorDefinition>
  ): SituationalFactorDefinition {
    return new SituationalFactorDefinition(element);
  }

  protected get typeName(): string {
    return SituationalFactorDefinition.typeName;
  }
}
