import { Injectable } from '@angular/core';
import { MethodElementService } from '../method-element.service';
import { Type, TypeInit } from './type';
import { DevelopmentProcessRegistryModule } from '../../development-process-registry.module';

@Injectable({
  providedIn: DevelopmentProcessRegistryModule,
})
export class TypeService extends MethodElementService<Type, TypeInit> {
  protected readonly typeName = Type.typeName;

  protected readonly elementConstructor = Type;
}
