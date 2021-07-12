import {
  AfterContentInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { BmProcess } from '../../development-process-registry/bm-process/bm-process';
import BpmnModeler from 'bpmn-js/lib/Modeler';
import { BpmnService } from '../shared/bpmn.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ProcessPatternService } from '../../development-process-registry/process-pattern/process-pattern.service';
import { DevelopmentMethod } from '../../development-process-registry/development-method/development-method';
import { DevelopmentMethodService } from '../../development-process-registry/development-method/development-method.service';
import { ProcessPattern } from '../../development-process-registry/process-pattern/process-pattern';
import { DiagramComponentInterface } from '../shared/diagram-component-interface';
import { SituationalFactor } from '../../development-process-registry/method-elements/situational-factor/situational-factor';
import { Artifact } from '../../development-process-registry/method-elements/artifact/artifact';
import { BmProcessService } from '../../development-process-registry/bm-process/bm-process.service';

@Component({
  selector: 'app-bm-process-diagram',
  templateUrl: './bm-process-diagram.component.html',
  styleUrls: ['./bm-process-diagram.component.css']
})
export class BmProcessDiagramComponent implements DiagramComponentInterface, OnInit, OnChanges, AfterContentInit, OnDestroy {

  @Input() bmProcess: BmProcess;

  @Output() saveBmProcess = new EventEmitter<Partial<BmProcess>>();

  private modeler: BpmnModeler;

  validDevelopmentMethods: DevelopmentMethod[] = null;

  lowWarnings: { elementName: string, name: string, elementId: string, situationalFactors: string[] }[] = [];
  incorrectWarnings: { elementName: string, name: string, elementId: string, situationalFactors: string[] }[] = [];
  isGeneratingWarnings = false;
  private wantsToGenerateWarnings = false;

  missingArtifacts: { elementId: string, elementName: string, name: string, artifacts: Artifact[] }[] = [];
  unreachableActivities: { elementId: string, elementName: string, name: string }[] = [];

  modalElement;
  modalDevelopmentMethod: DevelopmentMethod;
  modalProcessPattern: ProcessPattern;
  modalProcessPatterns: ProcessPattern[];
  private modalReference: NgbModalRef;

  @ViewChild('canvas', {static: true}) canvas: ElementRef<HTMLDivElement>;
  @ViewChild('addProcessPatternModal', {static: true}) addProcessPatternModal: any;
  @ViewChild('deleteProcessPatternModal', {static: true}) deleteProcessPatternModal: any;
  @ViewChild('methodInfoModal', {static: true}) methodInfoModal: any;
  @ViewChild('patternInfoModal', {static: true}) patternInfoModal: any;
  @ViewChild('selectDevelopmentMethodModal', {static: true}) selectDevelopmentMethodModal: any;
  @ViewChild('selectProcessPatternModal', {static: true}) selectProcessPatternModal: any;
  @ViewChild('showTypesModal', {static: true}) showTypesModal: any;
  @ViewChild('developmentMethodSummaryModal', {static: true}) developmentMethodSummaryModal: any;

  constructor(
    private bmProcessService: BmProcessService,
    private bpmnService: BpmnService,
    private developmentMethodService: DevelopmentMethodService,
    private modalService: NgbModal,
    private processPatternService: ProcessPatternService,
  ) {
  }

  ngOnInit() {
    this.modeler = this.bpmnService.getBmProcessModeler();
    const eventBus = this.modeler.get('eventBus');
    eventBus.on('bmp.deletePattern', (event, subProcessElement) => this.openDeleteProcessPatternModal(subProcessElement));
    eventBus.on('bmp.processPatterns', (event, businessObject) => this.openAddProcessPatternModal(businessObject));
    eventBus.on('bmp.removeMethod', (event, methodElement) => this.removeMethodFromTask(methodElement));
    eventBus.on('bmp.selectMethod', (event, taskElement) => this.openSelectDevelopmentMethodModal(taskElement));
    eventBus.on('bmp.selectPattern', (event, callActivityElement) => this.openSelectProcessPatternModal(callActivityElement));
    eventBus.on('bmp.showTypes', (event, taskElement) => this.openShowTypesModal(taskElement));
    eventBus.on('bmp.showMethod', (event, methodElement) => this.openMethodInfoModal(methodElement));
    eventBus.on('bmp.showPattern', (event, processPatternElement) => this.openProcessPatternInfoModal(processPatternElement));
    eventBus.on('bmp.summary', (event, methodElement) => this.openDevelopmentMethodSummary(methodElement));
    if (this.bmProcess) {
      this.loadBmProcess(this.bmProcess, true);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.bmProcess && this.modeler) {
      this.loadBmProcess(changes.bmProcess.currentValue, changes.bmProcess.firstChange);
    }
  }

  ngAfterContentInit() {
    this.modeler.attachTo(this.canvas.nativeElement);
  }

  ngOnDestroy() {
    this.modeler.destroy();
  }

  private loadBmProcess(bmProcess: BmProcess, firstLoad: boolean) {
    if (bmProcess.processDiagram) {
      this.modeler.get('taskRenderer').process = bmProcess;
      this.modeler.importXML(bmProcess.processDiagram).then(() => {
        if (firstLoad) {
          this.bpmnService.resizeView(this.modeler);
        }
        this.checkWarnings();
        this.checkArtifacts();
      }).catch(
        error => console.log('LoadBmProcess: ' + error)
      );
    } else {
      this.modeler.createDiagram();
    }
  }

  openAddProcessPatternModal(startingElement) {
    this.modalProcessPatterns = null;
    this.modalElement = startingElement;
    this.processPatternService.getValidProcessPatterns(
      [{list: 'initialisation', element: null}], [],
    ).then(list => {
      const processPatterns: ProcessPattern[] = list.docs;
      this.modalProcessPatterns = this.sortByDistance(processPatterns);
    }).catch(
      error => console.log('OpenAddProcessPatternModal: ' + error)
    );
    this.modalReference = this.modalService.open(this.addProcessPatternModal, {size: 'lg'});
  }

  addProcessPattern(processPattern: ProcessPattern) {
    this.processPatternService.getProcessPattern(processPattern._id).then((pattern) => {
      this.bpmnService.appendBpmn(this.modeler, pattern, this.modalElement).then(() => {
        this.modeler.get('selection').deselect(this.modalElement);
        this.saveDiagram();
      }).catch(
        error => console.log('AddProcessPattern (inner): ' + error)
      );
    }).catch(
      error => console.log('AddProcessPattern: ' + error)
    );
  }

  openShowTypesModal(taskElement) {
    this.modalElement = taskElement;
    this.modalReference = this.modalService.open(this.showTypesModal, {size: 'lg'});
  }

  openDeleteProcessPatternModal(subProcessElement) {
    this.modalElement = subProcessElement;
    this.modalReference = this.modalService.open(this.deleteProcessPatternModal, {size: 'lg'});
  }

  deleteProcessPattern(subProcessElement) {
    const removeDecision = (event, element) => {
      if (element.element.businessObject && element.element.businessObject.method) {
        this.bmProcess.removeDecision(element.element.id);
      }
    };
    const eventBus = this.modeler.get('eventBus');
    eventBus.on('shape.remove', removeDecision);
    this.bpmnService.removeProcessPattern(this.modeler, subProcessElement);
    eventBus.off('shape.remove', removeDecision);
    this.saveDiagram(this.bmProcess.decisions);
  }

  openSelectDevelopmentMethodModal(taskElement) {
    this.modalElement = taskElement;
    const types = this.bpmnService.getTypesOfActivity(this.modeler, taskElement.id);
    this.developmentMethodService.getValidDevelopmentMethods(
      types.neededType, types.forbiddenType,
    ).then((developmentMethods) => {
      const methods: DevelopmentMethod[] = developmentMethods.docs;
      this.validDevelopmentMethods = this.sortByDistance(methods);
    });
    this.modalReference = this.modalService.open(this.selectDevelopmentMethodModal, {
      size: 'lg', beforeDismiss: () => {
        this.validDevelopmentMethods = null;
        return true;
      }
    });
  }

  resetSelectDevelopmentMethodModal() {
    this.validDevelopmentMethods = null;
    this.modalReference.close();
  }

  selectDevelopmentMethod(taskElement, developmentMethod: DevelopmentMethod) {
    this.developmentMethodService.getDevelopmentMethod(developmentMethod._id).then((method) => {
      this.bmProcess.addDecision(taskElement.id, method);
      this.bpmnService.selectDevelopmentMethodForProcessTask(this.modeler, taskElement, method);
      this.saveDiagram(this.bmProcess.decisions);
    });
  }

  openMethodInfoModal(methodElement) {
    this.modalElement = methodElement;
    this.modalDevelopmentMethod = this.bmProcess.decisions[methodElement.id].method;
    this.modalReference = this.modalService.open(this.methodInfoModal, {size: 'lg'});
  }

  private openDevelopmentMethodSummary(methodElement) {
    this.modalElement = methodElement;
    this.modalReference = this.modalService.open(this.developmentMethodSummaryModal, {size: 'lg'});
  }

  openProcessPatternInfoModal(processPatternElement) {
    this.modalElement = processPatternElement;
    this.processPatternService.getProcessPattern(processPatternElement.businessObject.get('processPatternId')).then(
      (pattern) => {
        this.modalProcessPattern = pattern;
        this.modalReference = this.modalService.open(this.patternInfoModal, {size: 'lg'});
      }
    );
  }

  openSelectProcessPatternModal(callActivityElement) {
    this.modalProcessPatterns = null;
    this.modalElement = callActivityElement;
    const types = this.bpmnService.getTypesOfActivity(this.modeler, callActivityElement.id);
    this.processPatternService.getValidProcessPatterns(
      [...types.neededType, {list: 'generic', element: null}], types.forbiddenType,
    ).then(list => {
      const processPatterns: ProcessPattern[] = list.docs;
      this.modalProcessPatterns = this.sortByDistance(processPatterns);
    }).catch(
      error => console.log('OpenSelectProcessPatternModal: ' + error)
    );
    this.modalReference = this.modalService.open(this.selectProcessPatternModal, {size: 'lg'});
  }

  selectProcessPattern(callActivityElement, processPattern: ProcessPattern) {
    this.processPatternService.getProcessPattern(processPattern._id).then((pattern) => {
      this.bpmnService.insertProcessPatternIntoCallActivity(this.modeler, callActivityElement, pattern).then(() => {
        if (callActivityElement.businessObject.method) {
          this.bmProcess.removeDecision(callActivityElement.id);
          this.saveDiagram(this.bmProcess.decisions);
        } else {
          this.saveDiagram();
        }
      }).catch(
        error => console.log('SelectProcessPattern (inner): ' + error)
      );
    }).catch((error) => console.log('SelectProcessPattern: ' + error));
  }

  removeMethodFromTask(methodElement) {
    this.bpmnService.removeDevelopmentMethodFromProcessTask(this.modeler, methodElement);
    this.bmProcess.removeDecision(methodElement.id);
    this.saveDiagram(this.bmProcess.decisions);
  }

  checkWarnings() {
    if (this.isGeneratingWarnings) {
      this.wantsToGenerateWarnings = true;
      return;
    }
    this.isGeneratingWarnings = true;

    const lowWarnings: { elementName: string, name: string, elementId: string, situationalFactors: string[] }[] = [];
    const incorrectWarnings: { elementName: string, name: string, elementId: string, situationalFactors: string[] }[] = [];

    const generateWarnings = (id: string, elementName: 'Method' | 'Pattern', name: string, factors: SituationalFactor[]) => {
      const factorMap = SituationalFactor.createMap(factors);
      const {low, incorrect} = this.bmProcess.checkMatch(factorMap);
      if (low.length > 0) {
        lowWarnings.push({
          elementName,
          name,
          elementId: id,
          situationalFactors: low,
        });
      }
      if (incorrect.length > 0) {
        incorrectWarnings.push({
          elementName,
          name,
          elementId: id,
          situationalFactors: incorrect,
        });
      }
    };

    const generateMethodWarnings =
      (element: any) => {
        const method = this.bmProcess.decisions[element.id].method;
        generateWarnings(element.id, 'Method', method.name, method.situationalFactors.map((factor) => factor.element));
      };

    const generatePatternWarnings =
      (element: any, pattern: ProcessPattern) => {
        generateWarnings(element.id, 'Pattern', pattern.name, pattern.situationalFactors.map((factor) => factor.element));
      };

    const activities = this.bpmnService.getActivitiesWithMethod(this.modeler);
    activities.forEach((activity) => generateMethodWarnings(activity));

    const patternElements = this.bpmnService.getPatterns(this.modeler);
    this.processPatternService.getProcessPatterns(
      patternElements.map((element) => element.businessObject.get('processPatternId'))
    ).then((dbPatterns) => {
      const dbPatternsMap: { [id: string]: ProcessPattern } = {};
      dbPatterns.forEach((dbPattern) => dbPatternsMap[dbPattern._id] = dbPattern);
      patternElements.forEach(
        (patternElement) => generatePatternWarnings(patternElement, dbPatternsMap[patternElement.businessObject.get('processPatternId')])
      );
      if (!this.wantsToGenerateWarnings) {
        this.lowWarnings = lowWarnings;
        this.incorrectWarnings = incorrectWarnings;
      }
    }).finally(() => {
      this.isGeneratingWarnings = false;
      if (this.wantsToGenerateWarnings) {
        this.wantsToGenerateWarnings = false;
        this.checkWarnings();
      }
    });
  }

  selectElement(id: string) {
    this.bpmnService.focusElement(this.modeler, id);
    this.canvas.nativeElement.scrollIntoView({behavior: 'smooth'});
  }

  updateDecisions(value: any) {
    this.bmProcess.decisions[this.modalElement.id].update(value);
    this.saveDiagram(this.bmProcess.decisions);
  }

  saveDiagram(decisions = null): Promise<void> {
    return this.modeler.saveXML().then(result => {
      if (decisions !== null) {
        this.saveBmProcess.emit({
          decisions,
          processDiagram: result.xml,
        });
      } else {
        this.saveBmProcess.emit({
          processDiagram: result.xml,
        });
      }
    });
  }

  diagramChanged(): Promise<boolean> {
    return this.modeler.saveXML().then((result) => result.xml !== this.bmProcess.processDiagram);
  }

  sortByDistance<T extends { _id: string, situationalFactors: { list: string, element: SituationalFactor }[] }[]>(elements: T): T {
    const distanceMap: { [id: string]: number } = {};
    elements.forEach((element) =>
      distanceMap[element._id] = this.bmProcessService.distanceToContext(
        this.bmProcess,
        element.situationalFactors.map((factor) => factor.element)
      )
    );
    return elements.sort((elementA, elementB) => distanceMap[elementA._id] - distanceMap[elementB._id]);
  }

  checkArtifacts() {
    const missingMap = this.bpmnService.checkArtifacts(this.modeler, this.bmProcess.decisions);
    const decisions = this.bmProcess.decisions;
    const elementRegistry = this.modeler.get('elementRegistry');
    const missing = Object.entries(missingMap).map(([key, value]) => {
      const element = elementRegistry.get(key);
      let elementName;
      let name;
      if (key in decisions) {
        elementName = 'Method';
        name = decisions[key].method.name;
      } else if (element.businessObject.name) {
        elementName = 'Activity';
        name = element.businessObject.name;
      } else {
        elementName = 'Node';
        name = element.type;
      }
      return {
        artifacts: value,
        elementId: key,
        elementName,
        name,
      };
    });
    this.missingArtifacts = missing.filter((element) => element.artifacts);
    this.unreachableActivities = missing.filter((element) => !element.artifacts);
  }
}
