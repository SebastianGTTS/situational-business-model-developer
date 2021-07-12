import { MultipleSelection } from './multiple-selection';
import { MethodElement } from '../method-elements/method-element';
import { ArtifactMapping } from './artifact-mapping';

export class MultipleMappingSelection<T extends MethodElement> extends MultipleSelection<T> {

  mapping: ArtifactMapping[];

  constructor(selection: MultipleMappingSelection<T>, createElement: (element: Partial<T>) => T) {
    super(selection, createElement);
  }

  update(selection: MultipleMappingSelection<T>, createElement: (element: Partial<T>) => T) {
    this.mapping = [];
    super.update(selection, createElement);
    this.element = this.element ? createElement(this.element) : null;
    this.mapping = this.mapping.map((mapping) => new ArtifactMapping(mapping));
  }

  toPouchDb(): any {
    return {
      ...super.toPouchDb(),
      mapping: this.mapping.map((mapping) => mapping.toPouchDb()),
    };
  }

}
