import { Injectable } from '@angular/core';
import {
  SituationalFactorDefinition,
  SituationalFactorDefinitionInit,
} from './situational-factor-definition';
import { DevelopmentProcessRegistryModule } from '../../development-process-registry.module';
import { MethodElementService } from '../method-element.service';

@Injectable({
  providedIn: DevelopmentProcessRegistryModule,
})
export class SituationalFactorService extends MethodElementService<
  SituationalFactorDefinition,
  SituationalFactorDefinitionInit
> {
  protected readonly typeName = SituationalFactorDefinition.typeName;

  protected readonly elementConstructor = SituationalFactorDefinition;
}
