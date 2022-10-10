import {
  MethodElement,
  MethodElementEntry,
  MethodElementInit,
} from '../method-element';

export type ToolInit = MethodElementInit;

export type ToolEntry = MethodElementEntry;

export class Tool extends MethodElement {
  static readonly typeName = 'Tool';

  constructor(entry: ToolEntry | undefined, init: ToolInit | undefined) {
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
