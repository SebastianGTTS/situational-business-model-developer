declare namespace BpmnElements {
  interface Size {
    width: number;
    height: number;
  }

  interface Point {
    x: number;
    y: number;
  }

  interface BoxSizedElement extends Point, Size {}

  export interface BusinessObject {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any | undefined;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    get(key: string): any | undefined;
  }

  export interface BpmnElement {
    type: string;
    id: string;
    businessObject: BusinessObject;

    label: BpmnLabel;
  }

  export interface BpmnSequenceFlow extends BpmnElement {
    type: 'bpmn:SequenceFlow';
    source: BpmnFlowNode;
    target: BpmnFlowNode;
    parent: BpmnElement;

    waypoints: { x: number; y: number }[];
  }

  export interface BpmnFlowNode extends BpmnElement, BoxSizedElement {
    incoming: BpmnSequenceFlow[];
    outgoing: BpmnSequenceFlow[];
    parent: BpmnFlowNode;
  }

  export interface BpmnSubProcess extends BpmnFlowNode {
    children: BpmnFlowNode[];
  }

  export interface BpmnLabel extends BpmnElement, BoxSizedElement {}

  export interface BpmnElementRegistry {
    find(filter: (element: BpmnElement) => boolean): BpmnElement | undefined;

    filter(filter: (element: BpmnElement) => boolean): BpmnElement[];

    get(id: string): BpmnElement | undefined;
  }

  export interface BpmnModeling {
    createConnection(
      source: BpmnFlowNode,
      target: BpmnFlowNode,
      flow: { type: 'bpmn:SequenceFlow' },
      parent: BpmnElement
    ): void;

    createShape(
      shape: BpmnFlowNode,
      box: Point | BoxSizedElement,
      parent: BpmnElement
    ): BpmnFlowNode;

    createSpace(
      movingShapes: BpmnElement[],
      resizingShapes: BpmnFlowNode[],
      delta: { x: number; y: number },
      direction: 'e' | 's',
      start: number
    ): void;

    updateLabel(flow: BpmnElement, text: string, box: BoxSizedElement): void;

    updateProperties(
      element: BpmnElement,
      properties: { [key: string]: unknown }
    ): void;

    removeElements(elements: BpmnElement[]): void;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface MethodElement {}

  export interface BpmnModdle {
    create(
      type: 'bmdl:Method',
      properties: { name: string; id: string }
    ): unknown;

    create(
      type: 'bmdl:Type',
      properties: { list: string; element?: MethodElement }
    ): unknown;

    create(
      type: 'bmdl:MethodElement',
      properties: { _id: string; name: string }
    ): MethodElement;
  }

  export interface ElementFactory {
    createConnection(properties: {
      type: string;
      businessObject: BusinessObject;
      waypoints: Point[] | undefined;
    }): BpmnSequenceFlow;

    createShape(properties: {
      type: string;
      isExpanded?: boolean;
      businessObject: BusinessObject;
    }): BpmnFlowNode;
  }

  export interface BpmnFactory {
    create(
      type: string,
      properties: { name?: string; id?: string; attachedToRef?: BpmnElement }
    ): BusinessObject;
  }

  export interface EventBus {
    on(
      eventName: string,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      handler: (event: unknown, data: any) => boolean | void | Promise<void>
    ): void;

    on(
      eventName: string,
      priority: number,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      handler: (event: unknown, data: any) => boolean | void | Promise<void>
    ): void;

    off(
      eventName: string,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      handler: (event: unknown, data: any) => void
    ): void;

    fire(event: string, content: unknown): void;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface TaskRenderer {}

  export interface ContextPad {
    registerProvider(provider: unknown): void;
  }

  export interface Selection {
    select(element: BpmnElement): void;

    deselect(element: BpmnElement): void;

    get(): BpmnElement[];
  }

  interface CanvasViewBox extends BoxSizedElement {
    outer: BoxSizedElement;
  }

  export interface Canvas {
    viewbox(element?: BoxSizedElement): CanvasViewBox;
  }
}

declare class BpmnViewer {
  constructor(init: {
    linting?: unknown;
    additionalModules: unknown[];
    moddleExtensions: unknown;
  });

  get(key: 'elementRegistry'): BpmnElements.BpmnElementRegistry;
  get(key: 'modeling'): BpmnElements.BpmnModeling;
  get(key: 'moddle'): BpmnElements.BpmnModdle;
  get(key: 'elementFactory'): BpmnElements.ElementFactory;
  get(key: 'bpmnFactory'): BpmnElements.BpmnFactory;
  get(key: 'eventBus'): BpmnElements.EventBus;
  get(key: 'taskRenderer'): BpmnElements.TaskRenderer;
  get(key: 'selection'): BpmnElements.Selection;
  get(key: 'canvas'): BpmnElements.Canvas;
  get(key: 'linting'): Linting;
  get(key: string): unknown;

  destroy(): void;

  attachTo(element: HTMLElement): void;

  importXML(xml: string): Promise<void>;
}

declare class BpmnModeler extends BpmnViewer {
  createDiagram(): Promise<void>;

  saveXML(): Promise<{ xml: string }>;
}

declare module 'bpmn-js' {
  export = BpmnElements;
}

declare module 'bpmn-js/lib/Modeler' {
  export = BpmnModeler;
}

declare module 'bpmn-js/lib/util/ModelUtil' {
  export function is(element: BpmnElements.BpmnElement, type: string): boolean;
}

declare module 'bpmn-js/lib/util/LabelUtil' {
  export function isLabel(element: BpmnElements.BpmnElement): boolean;
}

declare module 'bpmn-js/lib/NavigatedViewer' {
  export = BpmnViewer;
}

declare class BaseRenderer {
  constructor(eventBus: BpmnElements.EventBus, priority: number);

  canRender(element: BpmnElements.BpmnElement): boolean;

  drawShape(
    parentNode: SVGGElement,
    element: BpmnElements.BpmnFlowNode
  ): SVGRectElement;

  drawConnection(
    parentNode: SVGGElement,
    element: BpmnElements.BpmnSequenceFlow
  ): SVGPathElement;

  getShapePath(shape: unknown): unknown;
}

declare module 'diagram-js/lib/draw/BaseRenderer' {
  export = BaseRenderer;
}

declare module 'bpmn-js/lib/draw/BpmnRenderer' {
  export = BaseRenderer;
}

declare interface TextRenderer {
  createText(
    text: string,
    options: {
      box: BpmnElements.BpmnElement;
      align: string;
      padding: number;
    }
  ): SVGElement;
}

declare module 'bpmn-js/lib/draw/TextRenderer' {
  export = TextRenderer;
}

declare module 'bpmn-js/lib/core' {}

declare module 'diagram-js/lib/features/change-support' {}

declare module 'diagram-js/lib/util/Elements' {
  export function getBBox(
    elements: BpmnElements.BpmnElement[]
  ): BpmnElements.BoxSizedElement;

  export function selfAndChildren(
    elements: BpmnElements.BpmnElement[],
    unique: boolean,
    maxDepth: number
  ): BpmnElements.BpmnElement[];
}

declare class PaletteProvider {
  getPaletteEntries(element: BpmnElements.BpmnElement): {
    [id: string]: unknown;
  };
}

declare module 'bpmn-js/lib/features/palette/PaletteProvider' {
  export = PaletteProvider;
}

declare class RuleProvider {
  init(): void;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  addRule(actions: string, fn: (context: any) => false | undefined): void;
  addRule(
    actions: string,
    priority: number,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fn: (context: any) => false | undefined
  ): void;
}

declare module 'diagram-js/lib/features/rules/RuleProvider' {
  export = RuleProvider;
}

declare module 'diagram-js/lib/features/context-pad' {}

declare module 'bpmn-js/lib/features/modeling' {}

declare module 'bpmn-js/lib/features/palette' {}

declare class ContextPadProvider {
  getContextPadEntries(element: BpmnElements.BpmnElement): {
    [id: string]: {
      group: string;
      className: string;
      title: string;
      action: { click: () => void };
    };
  };
}

declare module 'bpmn-js/lib/features/context-pad/ContextPadProvider' {
  export = ContextPadProvider;
}

declare class ReplaceMenuProvider {
  _createEntries(
    element: BpmnElements.BpmnElement,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    replaceOptions: unknown[]
  ): unknown;
}

declare module 'bpmn-js/lib/features/popup-menu/ReplaceMenuProvider' {
  export = ReplaceMenuProvider;
}

declare module 'diagram-js/lib/util/PositionUtil' {
  export function center(box: BpmnElements.BoxSizedElement): BpmnElements.Point;
}

declare module 'diagram-js/lib/util/Geometry' {
  export function pointInRect(
    point: BpmnElements.Point,
    rect: BpmnElements.BoxSizedElement,
    tolerance: number
  ): boolean;
}

declare module 'bpmnlint-utils' {
  export function is(node: BpmnElements.BusinessObject, type: string): boolean;
}

declare module 'bpmn-js-bpmnlint' {}

declare class Linter {
  constructor(options: { config: unknown; resolver: unknown });
}

interface LintingResult {
  id: string;
  message: string;
  category: 'error' | 'warn';
}

interface LintingResults {
  [categoryName: string]: LintingResult[];
}

declare interface Linting {
  /**
   * Toggle whether linting should be active
   *
   * @param active
   * @return whether the linting is now active
   */
  toggle(active?: boolean): boolean;

  /**
   * Lint the diagram
   *
   * @return errors
   */
  lint(): LintingResults;
}

declare module 'bpmnlint/lib/linter' {
  export = Linter;
}

declare interface Reporter {
  report(id: string, message: string): void;
}

declare class StaticResolver {
  constructor(cache: { [name: string]: unknown });
}

declare module 'bpmnlint/lib/resolver/static-resolver' {
  export = StaticResolver;
}

declare module 'bpmnlint/rules/end-event-required' {}
declare module 'bpmnlint/rules/fake-join' {}
declare module 'bpmnlint/rules/superfluous-gateway' {}
declare module 'bpmnlint/rules/no-disconnected' {}
declare module 'bpmnlint/rules/no-duplicate-sequence-flows' {}
declare module 'bpmnlint/rules/no-implicit-split' {}
declare module 'bpmnlint/rules/single-blank-start-event' {}
declare module 'bpmnlint/rules/start-event-required' {}
