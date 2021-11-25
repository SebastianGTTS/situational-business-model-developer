import RuleProvider from 'diagram-js/lib/features/rules/RuleProvider';

export default class BmProcessRuleProvider extends RuleProvider {
  private static readonly PRIORITY = 1500;

  init() {
    this.addRule('connection.reconnect', (context): false | undefined => {
      const currentSource = context.connection.businessObject.sourceRef;
      const currentTarget = context.connection.businessObject.targetRef;
      const newSource = context.source.businessObject;
      const newTarget = context.target.businessObject;
      if (currentSource !== newSource || currentTarget !== newTarget) {
        return false;
      }
      return undefined;
    });
    this.addRule('elements.move', (context): false | undefined => {
      if (context.shapes.length > 0) {
        const shape = context.shapes[0];
        if (context.target && context.target !== shape.parent) {
          return false;
        }
      }
      return undefined;
    });
  }

  addRule(actions, fn) {
    super.addRule(actions, BmProcessRuleProvider.PRIORITY, fn);
  }
}
