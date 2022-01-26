import { Injectable } from '@angular/core';
import { MethodElementService } from '../method-element.service';
import { Tool, ToolInit } from './tool';
import { DevelopmentProcessRegistryModule } from '../../development-process-registry.module';

@Injectable({
  providedIn: DevelopmentProcessRegistryModule,
})
export class ToolService extends MethodElementService<Tool, ToolInit> {
  protected readonly typeName = Tool.typeName;

  protected readonly elementConstructor = Tool;
}
