import { Injectable } from '@angular/core';
import { CanvasDefinition, CanvasDefinitionInit } from './canvas-definition';
import { CanvasDefinitionCell } from './canvas-definition-cell';
import { DefaultElementService } from '../../../database/default-element.service';
import { IconInit } from '../../../model/icon';

@Injectable({
  providedIn: 'root',
})
export class CanvasDefinitionService extends DefaultElementService<
  CanvasDefinition,
  CanvasDefinitionInit
> {
  protected readonly typeName = CanvasDefinition.typeName;

  protected readonly elementConstructor = CanvasDefinition;

  async updateRows(
    id: string,
    newRows: CanvasDefinitionCell[][]
  ): Promise<void> {
    try {
      const canvasDefinition = await this.getWrite(id);
      canvasDefinition.updateRows(newRows);
      await this.save(canvasDefinition);
    } finally {
      this.freeWrite(id);
    }
  }

  async update(id: string, element: Partial<CanvasDefinition>): Promise<void> {
    try {
      const canvasDefinition = await this.getWrite(id);
      canvasDefinition.update(element);
      await this.save(canvasDefinition);
    } finally {
      this.freeWrite(id);
    }
  }

  /**
   * Update the icon of a canvas definition
   *
   * @param id
   * @param icon
   */
  async updateIcon(id: string, icon: IconInit): Promise<void> {
    try {
      const canvasDefinition = await this.getWrite(id);
      canvasDefinition.updateIcon(icon);
      await this.save(canvasDefinition);
    } finally {
      this.freeWrite(id);
    }
  }
}
