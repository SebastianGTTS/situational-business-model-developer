import { MethodElement } from '../method-element';

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
  update(tool: Partial<Tool>) {
    Object.assign(this, tool);
  }

  toPouchDb(): any {
    return {
      ...super.toPouchDb(),
    };
  }

}
