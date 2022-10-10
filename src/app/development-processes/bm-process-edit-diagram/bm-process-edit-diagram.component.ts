import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { BmProcess } from '../../development-process-registry/bm-process/bm-process';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ProcessPatternService } from '../../development-process-registry/process-pattern/process-pattern.service';
import {
  DevelopmentMethod,
  DevelopmentMethodEntry,
} from '../../development-process-registry/development-method/development-method';
import { DevelopmentMethodService } from '../../development-process-registry/development-method/development-method.service';
import {
  ProcessPattern,
  ProcessPatternEntry,
} from '../../development-process-registry/process-pattern/process-pattern';
import { DiagramComponentInterface } from '../shared/diagram-component-interface';
import { SituationalFactor } from '../../development-process-registry/method-elements/situational-factor/situational-factor';
import { Artifact } from '../../development-process-registry/method-elements/artifact/artifact';
import { BmProcessService } from '../../development-process-registry/bm-process/bm-process.service';
import {
  MethodDecision,
  MethodDecisionUpdate,
} from '../../development-process-registry/bm-process/method-decision';
import { BpmnFlowNode, BpmnSubProcess } from 'bpmn-js';
import { BmProcessDiagramModelerService } from '../../development-process-registry/bm-process/bm-process-diagram-modeler.service';
import { BmProcessModelerComponent } from '../bm-process-modeler/bm-process-modeler.component';

@Component({
  selector: 'app-bm-process-edit-diagram',
  templateUrl: './bm-process-edit-diagram.component.html',
  styleUrls: ['./bm-process-edit-diagram.component.css'],
})
export class BmProcessEditDiagramComponent
  implements DiagramComponentInterface, OnChanges
{
  @Input() bmProcess!: BmProcess;

  @Output() saveBmProcess = new EventEmitter<{
    decisions?: { [elementId: string]: MethodDecision };
    processDiagram: string;
  }>();
  @Output() appendProcessPattern = new EventEmitter<{
    nodeId: string;
    processPattern: ProcessPatternEntry;
  }>();
  @Output() insertProcessPattern = new EventEmitter<{
    nodeId: string;
    processPattern: ProcessPatternEntry;
  }>();
  @Output() deleteProcessPattern = new EventEmitter<string>();
  @Output() insertDevelopmentMethod = new EventEmitter<{
    nodeId: string;
    developmentMethod: DevelopmentMethodEntry;
  }>();
  @Output() removeDevelopmentMethod = new EventEmitter<string>();

  validDevelopmentMethods?: DevelopmentMethodEntry[];

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

  incompleteMethodDecisions: {
    elementId: string;
    name: string;
  }[] = [];
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

  modalElement?: BpmnFlowNode;
  modalDevelopmentMethod?: DevelopmentMethod;
  modalProcessPattern?: ProcessPattern;
  modalProcessPatterns?: ProcessPatternEntry[];
  private modalReference?: NgbModalRef;

  @ViewChild(BmProcessModelerComponent)
  bmProcessModelerComponent!: BmProcessModelerComponent;
  @ViewChild('addProcessPatternModal', { static: true })
  addProcessPatternModal: unknown;
  @ViewChild('deleteProcessPatternModal', { static: true })
  deleteProcessPatternModal: unknown;
  @ViewChild('methodInfoModal', { static: true }) methodInfoModal: unknown;
  @ViewChild('patternInfoModal', { static: true }) patternInfoModal: unknown;
  @ViewChild('selectDevelopmentMethodModal', { static: true })
  selectDevelopmentMethodModal: unknown;
  @ViewChild('selectProcessPatternModal', { static: true })
  selectProcessPatternModal: unknown;
  @ViewChild('showTypesModal', { static: true }) showTypesModal: unknown;
  @ViewChild('developmentMethodSummaryModal', { static: true })
  developmentMethodSummaryModal: unknown;

  constructor(
    private bmProcessDiagramModelerService: BmProcessDiagramModelerService,
    private bmProcessService: BmProcessService,
    private developmentMethodService: DevelopmentMethodService,
    private modalService: NgbModal,
    private processPatternService: ProcessPatternService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.bmProcess) {
      void this.checkWarnings();
      void this.checkArtifacts();
      this.checkComplete();
    }
  }

  async openAddProcessPatternModal(
    startingElement: BpmnFlowNode
  ): Promise<void> {
    this.modalProcessPatterns = undefined;
    this.modalElement = startingElement;
    this.modalProcessPatterns =
      await this.processPatternService.getSortedValidProcessPatterns(
        [{ list: 'initialisation' }],
        [],
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        this.bmProcess.situationalFactors.map((factor) => factor.element!)
      );
    this.modalReference = this.modalService.open(this.addProcessPatternModal, {
      size: 'lg',
    });
  }

  openShowTypesModal(taskElement: BpmnFlowNode): void {
    this.modalElement = taskElement;
    this.modalReference = this.modalService.open(this.showTypesModal, {
      size: 'lg',
    });
  }

  openDeleteProcessPatternModal(subProcessElement: BpmnSubProcess): void {
    this.modalElement = subProcessElement;
    this.modalReference = this.modalService.open(
      this.deleteProcessPatternModal,
      { size: 'lg' }
    );
  }

  async openSelectDevelopmentMethodModal(
    taskElement: BpmnFlowNode
  ): Promise<void> {
    this.modalElement = taskElement;
    const types =
      this.bmProcessDiagramModelerService.getTypesOfActivity(taskElement);
    this.validDevelopmentMethods =
      await this.developmentMethodService.getSortedValidDevelopmentMethods(
        types.neededType,
        types.forbiddenType,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        this.bmProcess.situationalFactors.map((factor) => factor.element!)
      );
    this.modalReference = this.modalService.open(
      this.selectDevelopmentMethodModal,
      {
        size: 'lg',
        beforeDismiss: () => {
          this.validDevelopmentMethods = undefined;
          return true;
        },
      }
    );
  }

  resetSelectDevelopmentMethodModal(): void {
    this.validDevelopmentMethods = undefined;
    this.modalReference?.close();
  }

  openMethodInfoModal(methodElement: BpmnFlowNode): void {
    this.modalElement = methodElement;
    this.modalDevelopmentMethod =
      this.bmProcess.decisions[methodElement.id].method;
    this.modalReference = this.modalService.open(this.methodInfoModal, {
      size: 'lg',
    });
  }

  openDevelopmentMethodSummary(methodElement: BpmnFlowNode): void {
    this.modalElement = methodElement;
    this.modalReference = this.modalService.open(
      this.developmentMethodSummaryModal,
      { size: 'lg' }
    );
  }

  async openProcessPatternInfoModal(
    processPatternElement: BpmnSubProcess
  ): Promise<void> {
    this.modalElement = processPatternElement;
    this.modalProcessPattern = await this.processPatternService.get(
      processPatternElement.businessObject.get('processPatternId')
    );
    this.modalReference = this.modalService.open(this.patternInfoModal, {
      size: 'lg',
    });
  }

  async openSelectProcessPatternModal(
    callActivityElement: BpmnFlowNode
  ): Promise<void> {
    this.modalProcessPatterns = undefined;
    this.modalElement = callActivityElement;
    const types =
      this.bmProcessDiagramModelerService.getTypesOfActivity(
        callActivityElement
      );
    this.modalProcessPatterns =
      await this.processPatternService.getSortedValidProcessPatterns(
        [...types.neededType, { list: 'generic' }],
        types.forbiddenType,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        this.bmProcess.situationalFactors.map((factor) => factor.element!)
      );
    this.modalReference = this.modalService.open(
      this.selectProcessPatternModal,
      { size: 'lg' }
    );
  }

  async checkWarnings(): Promise<void> {
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
    ): void => {
      const { low, incorrect } = this.bmProcessService.checkMatch(
        this.bmProcess,
        factors
      );
      if (low.length > 0) {
        lowWarnings.push({
          elementName,
          name,
          elementId: id,
          situationalFactors: low.map((factor) => factor.factor.name),
        });
      }
      if (incorrect.length > 0) {
        incorrectWarnings.push({
          elementName,
          name,
          elementId: id,
          situationalFactors: incorrect.map((factor) => factor.factor.name),
        });
      }
    };

    const generateMethodWarnings = (nodeId: string): void => {
      const method = this.bmProcess.decisions[nodeId].method;
      generateWarnings(
        nodeId,
        'Method',
        method.name,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        method.situationalFactors.map((factor) => factor.element!)
      );
    };

    const generatePatternWarnings = (
      nodeId: string,
      pattern: ProcessPattern
    ): void => {
      generateWarnings(
        nodeId,
        'Pattern',
        pattern.name,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        pattern.situationalFactors.map((factor) => factor.element!)
      );
    };

    Object.keys(this.bmProcess.decisions).forEach((nodeId) =>
      generateMethodWarnings(nodeId)
    );

    const patternElements = await this.bmProcessService.getPatterns(
      this.bmProcess
    );
    patternElements.forEach((patternElement) =>
      generatePatternWarnings(
        patternElement.nodeId,
        patternElement.processPattern
      )
    );
    if (!this.wantsToGenerateWarnings) {
      this.lowWarnings = lowWarnings;
      this.incorrectWarnings = incorrectWarnings;
    }
    this.isGeneratingWarnings = false;
    if (this.wantsToGenerateWarnings) {
      this.wantsToGenerateWarnings = false;
      await this.checkWarnings();
    }
  }

  focusElement(id: string): void {
    this.bmProcessModelerComponent.focus(id);
  }

  async updateDecisions(value: MethodDecisionUpdate): Promise<void> {
    if (this.modalElement != null) {
      this.bmProcess.decisions[this.modalElement.id].update(value);
      await this.saveDiagram(this.bmProcess.decisions);
    }
  }

  async saveDiagram(decisions?: {
    [elementId: string]: MethodDecision;
  }): Promise<void> {
    const xml = await this.bmProcessModelerComponent.getDiagramXml();
    if (decisions != null) {
      this.saveBmProcess.emit({
        decisions,
        processDiagram: xml,
      });
    } else {
      this.saveBmProcess.emit({
        processDiagram: xml,
      });
    }
  }

  async diagramChanged(): Promise<boolean> {
    return this.bmProcessModelerComponent.diagramChanged();
  }

  async checkArtifacts(): Promise<void> {
    const missingMap = await this.bmProcessService.checkArtifacts(
      this.bmProcess
    );
    const decisions = this.bmProcess.decisions;
    const missing = missingMap.map((missingElement) => {
      const element = missingElement.node;
      const key = element.id;
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
        artifacts: missingElement.missingArtifacts,
        elementId: key,
        elementName,
        name,
      };
    });
    this.missingArtifacts = missing.filter(
      (element) => element.artifacts != null
    ) as {
      elementId: string;
      elementName: string;
      name: string;
      artifacts: Artifact[];
    }[];
    this.unreachableActivities = missing.filter(
      (element) => !element.artifacts
    );
  }

  checkComplete(): void {
    this.incompleteMethodDecisions = Object.entries(this.bmProcess.decisions)
      .filter(
        ([, decision]) =>
          !decision.isComplete() ||
          !this.bmProcessService.checkDecisionStepArtifacts(decision)
      )
      .map(([nodeId, decision]) => {
        return {
          elementId: nodeId,
          name: decision.method.name,
        };
      });
  }
}
