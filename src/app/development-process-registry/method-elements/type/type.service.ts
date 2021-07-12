import { Injectable } from '@angular/core';
import { MethodElementService } from '../method-element.service';
import { Type } from './type';
import { DevelopmentProcessRegistryModule } from '../../development-process-registry.module';

@Injectable({
  providedIn: DevelopmentProcessRegistryModule,
})
export class TypeService extends MethodElementService<Type> {

  protected createMethodElement(element: Partial<Type>): Type {
    return new Type(element);
  }

  protected getTypeName(): string {
    return Type.typeName;
  }

}
