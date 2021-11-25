import { Injectable } from '@angular/core';
import { MethodElementService } from '../method-element.service';
import { Tool } from './tool';
import { DevelopmentProcessRegistryModule } from '../../development-process-registry.module';

@Injectable({
  providedIn: DevelopmentProcessRegistryModule,
})
export class ToolService extends MethodElementService<Tool> {
  protected createElement(element: Partial<Tool>): Tool {
    return new Tool(element);
  }

  protected get typeName(): string {
    return Tool.typeName;
  }
}
