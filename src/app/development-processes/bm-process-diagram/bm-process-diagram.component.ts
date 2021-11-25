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
  ViewChild,
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
import { DevelopmentMethodIncompleteModalComponent } from '../development-method-incomplete-modal/development-method-incomplete-modal.component';

@Component({
  selector: 'app-bm-process-diagram',
  templateUrl: './bm-process-diagram.component.html',
  styleUrls: ['./bm-process-diagram.component.css'],
})
export class BmProcessDiagramComponent
  implements
    DiagramComponentInterface,
    OnInit,
    OnChanges,
    AfterContentInit,
    OnDestroy
{
  @Input() bmProcess: BmProcess;

  @Output() saveBmProcess = new EventEmitter<Partial<BmProcess>>();

  private modeler: BpmnModeler;

  validDevelopmentMethods: DevelopmentMethod[] = null;

  lowWarnings: {
    elementName: string;
    name: string;
    elementId: string;
    situationalFactors: string[];
  }[] = [];
  incorrectWarnings: {
    elementName: string;
    name: string;
    elementId: string;
    situationalFactors: string[];
  }[] = [];
  isGeneratingWarnings = false;
  private wantsToGenerateWarnings = false;

  missingArtifacts: {
    elementId: string;
    elementName: string;
    name: string;
    artifacts: Artifact[];
  }[] = [];
  unreachableActivities: {
    elementId: string;
    elementName: string;
    name: string;
  }[] = [];

  modalElement;
  modalDevelopmentMethod: DevelopmentMethod;
  modalProcessPattern: ProcessPattern;
  modalProcessPatterns: ProcessPattern[];
  private modalReference: NgbModalRef;

  @ViewChild('canvas', { static: true }) canvas: ElementRef<HTMLDivElement>;
  @ViewChild('addProcessPatternModal', { static: true })
  addProcessPatternModal: any;
  @ViewChild('deleteProcessPatternModal', { static: true })
  deleteProcessPatternModal: any;
  @ViewChild('methodInfoModal', { static: true }) methodInfoModal: any;
  @ViewChild('patternInfoModal', { static: true }) patternInfoModal: any;
  @ViewChild('selectDevelopmentMethodModal', { static: true })
  selectDevelopmentMethodModal: any;
  @ViewChild('selectProcessPatternModal', { static: true })
  selectProcessPatternModal: any;
  @ViewChild('showTypesModal', { static: true }) showTypesModal: any;
  @ViewChild('developmentMethodSummaryModal', { static: true })
  developmentMethodSummaryModal: any;

  constructor(
    private bmProcessService: BmProcessService,
    private bpmnService: BpmnService,
    private developmentMethodService: DevelopmentMethodService,
    private modalService: NgbModal,
    private processPatternService: ProcessPatternService
  ) {}

  ngOnInit() {
    this.modeler = this.bpmnService.getBmProcessModeler();
    const eventBus = this.modeler.get('eventBus');
    eventBus.on('bmp.deletePattern', (event, subProcessElement) =>
      this.openDeleteProcessPatternModal(subProcessElement)
    );
    eventBus.on('bmp.processPatterns', (event, businessObject) =>
      this.openAddProcessPatternModal(businessObject)
    );
    eventBus.on('bmp.removeMethod', (event, methodElement) =>
      this.removeMethodFromTask(methodElement)
    );
    eventBus.on('bmp.selectMethod', (event, taskElement) =>
      this.openSelectDevelopmentMethodModal(taskElement)
    );
    eventBus.on('bmp.selectPattern', (event, callActivityElement) =>
      this.openSelectProcessPatternModal(callActivityElement)
    );
    eventBus.on('bmp.showTypes', (event, taskElement) =>
      this.openShowTypesModal(taskElement)
    );
    eventBus.on('bmp.showMethod', (event, methodElement) =>
      this.openMethodInfoModal(methodElement)
    );
    eventBus.on('bmp.showPattern', (event, processPatternElement) =>
      this.openProcessPatternInfoModal(processPatternElement)
    );
    eventBus.on('bmp.summary', (event, methodElement) =>
      this.openDevelopmentMethodSummary(methodElement)
    );
    if (this.bmProcess) {
      void this.loadBmProcess(this.bmProcess, true);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.bmProcess && this.modeler) {
      void this.loadBmProcess(
        changes.bmProcess.currentValue,
        changes.bmProcess.firstChange
      );
    }
  }

  ngAfterContentInit() {
    this.modeler.attachTo(this.canvas.nativeElement);
  }

  ngOnDestroy() {
    this.modeler.destroy();
  }

  private async loadBmProcess(
    bmProcess: BmProcess,
    firstLoad: boolean
  ): Promise<void> {
    if (bmProcess.processDiagram) {
      this.modeler.get('taskRenderer').process = bmProcess;
      this.modeler.get('taskRenderer').bmProcessService = this.bmProcessService;
      await this.modeler.importXML(bmProcess.processDiagram);
      if (firstLoad) {
        this.bpmnService.resizeView(this.modeler);
      }
      this.checkWarnings();
      this.checkArtifacts();
    } else {
      this.modeler.createDiagram();
    }
  }

  async openAddProcessPatternModal(startingElement): Promise<void> {
    this.modalProcessPatterns = null;
    this.modalElement = startingElement;
    const processPatterns: ProcessPattern[] =
      await this.processPatternService.getValidProcessPatterns(
        [{ list: 'initialisation', element: null }],
        []
      );
    this.modalProcessPatterns = this.sortByDistance(processPatterns);
    this.modalReference = this.modalService.open(this.addProcessPatternModal, {
      size: 'lg',
    });
  }

  async addProcessPattern(processPattern: ProcessPattern) {
    const pattern = await this.processPatternService.get(processPattern._id);
    await this.bpmnService.appendBpmn(this.modeler, pattern, this.modalElement);
    this.modeler.get('selection').deselect(this.modalElement);
    await this.saveDiagram();
  }

  openShowTypesModal(taskElement) {
    this.modalElement = taskElement;
    this.modalReference = this.modalService.open(this.showTypesModal, {
      size: 'lg',
    });
  }

  openDeleteProcessPatternModal(subProcessElement) {
    this.modalElement = subProcessElement;
    this.modalReference = this.modalService.open(
      this.deleteProcessPatternModal,
      { size: 'lg' }
    );
  }

  async deleteProcessPattern(subProcessElement) {
    const removeDecision = (event, element) => {
      if (
        element.element.businessObject &&
        element.element.businessObject.method
      ) {
        this.bmProcess.removeDecision(element.element.id);
      }
    };
    const eventBus = this.modeler.get('eventBus');
    eventBus.on('shape.remove', removeDecision);
    this.bpmnService.removeProcessPattern(this.modeler, subProcessElement);
    eventBus.off('shape.remove', removeDecision);
    await this.saveDiagram(this.bmProcess.decisions);
  }

  async openSelectDevelopmentMethodModal(taskElement) {
    this.modalElement = taskElement;
    const types = this.bpmnService.getTypesOfActivity(
      this.modeler,
      taskElement.id
    );
    const methods: DevelopmentMethod[] =
      await this.developmentMethodService.getValidDevelopmentMethods(
        types.neededType,
        types.forbiddenType
      );
    this.validDevelopmentMethods = this.sortByDistance(methods);
    this.modalReference = this.modalService.open(
      this.selectDevelopmentMethodModal,
      {
        size: 'lg',
        beforeDismiss: () => {
          this.validDevelopmentMethods = null;
          return true;
        },
      }
    );
  }

  resetSelectDevelopmentMethodModal() {
    this.validDevelopmentMethods = null;
    this.modalReference.close();
  }

  async selectDevelopmentMethod(
    taskElement,
    developmentMethod: DevelopmentMethod
  ): Promise<void> {
    const method = await this.developmentMethodService.get(
      developmentMethod._id
    );
    if (!this.developmentMethodService.isCorrectlyDefined(method)) {
      const modal = this.modalService.open(
        DevelopmentMethodIncompleteModalComponent
      );
      const component: DevelopmentMethodIncompleteModalComponent =
        modal.componentInstance;
      component.developmentMethod = method;
      return;
    }
    this.resetSelectDevelopmentMethodModal();
    this.bmProcess.addDecision(taskElement.id, method);
    this.bpmnService.selectDevelopmentMethodForProcessTask(
      this.modeler,
      taskElement,
      method
    );
    await this.saveDiagram(this.bmProcess.decisions);
  }

  openMethodInfoModal(methodElement) {
    this.modalElement = methodElement;
    this.modalDevelopmentMethod =
      this.bmProcess.decisions[methodElement.id].method;
    this.modalReference = this.modalService.open(this.methodInfoModal, {
      size: 'lg',
    });
  }

  private openDevelopmentMethodSummary(methodElement) {
    this.modalElement = methodElement;
    this.modalReference = this.modalService.open(
      this.developmentMethodSummaryModal,
      { size: 'lg' }
    );
  }

  async openProcessPatternInfoModal(processPatternElement) {
    this.modalElement = processPatternElement;
    this.modalProcessPattern = await this.processPatternService.get(
      processPatternElement.businessObject.get('processPatternId')
    );
    this.modalReference = this.modalService.open(this.patternInfoModal, {
      size: 'lg',
    });
  }

  async openSelectProcessPatternModal(callActivityElement) {
    this.modalProcessPatterns = null;
    this.modalElement = callActivityElement;
    const types = this.bpmnService.getTypesOfActivity(
      this.modeler,
      callActivityElement.id
    );
    const processPatterns: ProcessPattern[] =
      await this.processPatternService.getValidProcessPatterns(
        [...types.neededType, { list: 'generic', element: null }],
        types.forbiddenType
      );
    this.modalProcessPatterns = this.sortByDistance(processPatterns);
    this.modalReference = this.modalService.open(
      this.selectProcessPatternModal,
      { size: 'lg' }
    );
  }

  async selectProcessPattern(
    callActivityElement,
    processPattern: ProcessPattern
  ) {
    const pattern = await this.processPatternService.get(processPattern._id);
    await this.bpmnService.insertProcessPatternIntoCallActivity(
      this.modeler,
      callActivityElement,
      pattern
    );
    if (callActivityElement.businessObject.method) {
      this.bmProcess.removeDecision(callActivityElement.id);
      await this.saveDiagram(this.bmProcess.decisions);
    } else {
      await this.saveDiagram();
    }
  }

  async removeMethodFromTask(methodElement) {
    this.bpmnService.removeDevelopmentMethodFromProcessTask(
      this.modeler,
      methodElement
    );
    this.bmProcess.removeDecision(methodElement.id);
    await this.saveDiagram(this.bmProcess.decisions);
  }

  checkWarnings() {
    if (this.isGeneratingWarnings) {
      this.wantsToGenerateWarnings = true;
      return;
    }
    this.isGeneratingWarnings = true;

    const lowWarnings: {
      elementName: string;
      name: string;
      elementId: string;
      situationalFactors: string[];
    }[] = [];
    const incorrectWarnings: {
      elementName: string;
      name: string;
      elementId: string;
      situationalFactors: string[];
    }[] = [];

    const generateWarnings = (
      id: string,
      elementName: 'Method' | 'Pattern',
      name: string,
      factors: SituationalFactor[]
    ) => {
      const factorMap = SituationalFactor.createMap(factors);
      const { low, incorrect } = this.bmProcess.checkMatch(factorMap);
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

    const generateMethodWarnings = (element: any) => {
      const method = this.bmProcess.decisions[element.id].method;
      generateWarnings(
        element.id,
        'Method',
        method.name,
        method.situationalFactors.map((factor) => factor.element)
      );
    };

    const generatePatternWarnings = (element: any, pattern: ProcessPattern) => {
      generateWarnings(
        element.id,
        'Pattern',
        pattern.name,
        pattern.situationalFactors.map((factor) => factor.element)
      );
    };

    const activities = this.bpmnService.getActivitiesWithMethod(this.modeler);
    activities.forEach((activity) => generateMethodWarnings(activity));

    const patternElements = this.bpmnService.getPatterns(this.modeler);
    this.processPatternService
      .getProcessPatterns(
        patternElements.map((element) =>
          element.businessObject.get('processPatternId')
        )
      )
      .then((dbPatterns) => {
        const dbPatternsMap: { [id: string]: ProcessPattern } = {};
        dbPatterns.forEach(
          (dbPattern) => (dbPatternsMap[dbPattern._id] = dbPattern)
        );
        patternElements.forEach((patternElement) =>
          generatePatternWarnings(
            patternElement,
            dbPatternsMap[patternElement.businessObject.get('processPatternId')]
          )
        );
        if (!this.wantsToGenerateWarnings) {
          this.lowWarnings = lowWarnings;
          this.incorrectWarnings = incorrectWarnings;
        }
      })
      .finally(() => {
        this.isGeneratingWarnings = false;
        if (this.wantsToGenerateWarnings) {
          this.wantsToGenerateWarnings = false;
          this.checkWarnings();
        }
      });
  }

  selectElement(id: string) {
    this.bpmnService.focusElement(this.modeler, id);
    this.canvas.nativeElement.scrollIntoView({ behavior: 'smooth' });
  }

  async updateDecisions(value: any) {
    this.bmProcess.decisions[this.modalElement.id].update(value);
    await this.saveDiagram(this.bmProcess.decisions);
  }

  saveDiagram(decisions = null): Promise<void> {
    return this.modeler.saveXML().then((result) => {
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
    return this.modeler
      .saveXML()
      .then((result) => result.xml !== this.bmProcess.processDiagram);
  }

  sortByDistance<
    T extends {
      _id: string;
      situationalFactors: { list: string; element: SituationalFactor }[];
    }[]
  >(elements: T): T {
    const distanceMap: { [id: string]: number } = {};
    elements.forEach(
      (element) =>
        (distanceMap[element._id] = this.bmProcessService.distanceToContext(
          this.bmProcess,
          element.situationalFactors.map((factor) => factor.element)
        ))
    );
    return elements.sort(
      (elementA, elementB) =>
        distanceMap[elementA._id] - distanceMap[elementB._id]
    );
  }

  checkArtifacts() {
    const missingMap = this.bpmnService.checkArtifacts(
      this.modeler,
      this.bmProcess.decisions
    );
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
    this.unreachableActivities = missing.filter(
      (element) => !element.artifacts
    );
  }
}
