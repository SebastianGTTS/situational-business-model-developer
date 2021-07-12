import { Injectable } from '@angular/core';
import { MethodElementService } from '../method-element.service';
import { Tool } from './tool';
import { DevelopmentProcessRegistryModule } from '../../development-process-registry.module';

@Injectable({
  providedIn: DevelopmentProcessRegistryModule
})
export class ToolService extends MethodElementService<Tool> {

  protected createMethodElement(element: Partial<Tool>): Tool {
    return new Tool(element);
  }

  protected getTypeName(): string {
    return Tool.typeName;
  }

}
