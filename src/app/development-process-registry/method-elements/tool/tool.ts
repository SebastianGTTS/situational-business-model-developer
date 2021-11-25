import { MethodElement, MethodElementEntry } from '../method-element';

export interface ToolEntry extends MethodElementEntry {}

export class Tool extends MethodElement {
  static readonly typeName = 'Tool';

  constructor(tool: Partial<Tool>) {
    super(Tool.typeName);
    this.update(tool);
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
