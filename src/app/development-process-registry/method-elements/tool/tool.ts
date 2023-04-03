import {
  MethodElement,
  MethodElementEntry,
  MethodElementInit,
} from '../method-element';
import { IconInit } from '../../../model/icon';

export type ToolInit = MethodElementInit;

export type ToolEntry = MethodElementEntry;

export class Tool extends MethodElement {
  static readonly typeName = 'Tool';
  static readonly defaultIcon: IconInit = { icon: 'bi-window' };

  constructor(entry: ToolEntry | undefined, init: ToolInit | undefined) {
    if (init != null && init.icon == null) {
      init.icon = Tool.defaultIcon;
    }
    super(entry, init, Tool.typeName);
  }

  /**
   * Update this tool with new values
   *
   * @param tool the new values of this tool (values will be copied to the current object)
   */
  update(tool: Partial<Tool>): void {
    Object.assign(this, tool);
  }

  toDb(): ToolEntry {
    return {
      ...super.toDb(),
    };
  }
}
