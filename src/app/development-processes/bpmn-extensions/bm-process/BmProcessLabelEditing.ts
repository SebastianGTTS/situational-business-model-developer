export default class BmProcessLabelEditing {

  private static readonly PRIORITY = 1500;

  static $inject = [
    'eventBus',
  ];

  constructor(private eventBus) {
    this.init();
  }

  init() {
    this.eventBus.on('element.dblclick', BmProcessLabelEditing.PRIORITY, () => false);
  }

}
