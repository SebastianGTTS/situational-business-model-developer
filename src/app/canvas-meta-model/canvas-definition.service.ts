import { Injectable } from '@angular/core';
import { CanvasDefinition } from './canvas-definition';
import { CanvasDefinitionCell } from './canvas-definition-cell';
import { DefaultElementService } from '../database/default-element.service';

@Injectable({
  providedIn: 'root',
})
export class CanvasDefinitionService extends DefaultElementService<CanvasDefinition> {
  protected get typeName(): string {
    return CanvasDefinition.typeName;
  }

  async updateRows(
    id: string,
    newRows: CanvasDefinitionCell[][]
  ): Promise<void> {
    const canvasDefinition = await this.get(id);
    canvasDefinition.updateRows(newRows);
    await this.save(canvasDefinition);
  }

  async update(id: string, element: Partial<CanvasDefinition>): Promise<void> {
    const dbElement = await this.get(id);
    dbElement.update(element);
    await this.save(dbElement);
  }

  protected createElement(
    element: Partial<CanvasDefinition>
  ): CanvasDefinition {
    return new CanvasDefinition(element);
  }
}
