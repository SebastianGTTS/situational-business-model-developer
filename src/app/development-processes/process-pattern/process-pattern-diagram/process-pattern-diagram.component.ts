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

import Modeler from 'bpmn-js/lib/Modeler';
import { ProcessPattern } from '../../../development-process-registry/process-pattern/process-pattern';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { DiagramComponentInterface } from '../../shared/diagram-component-interface';
import { BusinessObject } from 'bpmn-js';
import { ProcessPatternModelerService } from '../../shared/process-pattern-modeler.service';

@Component({
  selector: 'app-process-pattern-diagram',
  templateUrl: './process-pattern-diagram.component.html',
  styleUrls: ['./process-pattern-diagram.component.css'],
})
export class ProcessPatternDiagramComponent
  implements
    DiagramComponentInterface,
    OnInit,
    AfterContentInit,
    OnChanges,
    OnDestroy
{
  @Input() processPattern?: ProcessPattern;

  @Output() saveProcessPattern = new EventEmitter<string>();

  private modeler: Modeler = this.processPatternModelerService.getBpmnModeler();

  modalTask?: {
    id: string;
    name: string;
    inherit: boolean;
    neededType: { list: string; element?: { _id: string; name: string } }[];
    forbiddenType: { list: string; element?: { _id: string; name: string } }[];
  };
  private modalReference?: NgbModalRef;

  @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLDivElement>;
  @ViewChild('manageTypesModal', { static: true }) manageTypesModal: unknown;

  constructor(
    private fb: UntypedFormBuilder,
    private modalService: NgbModal,
    private processPatternModelerService: ProcessPatternModelerService
  ) {}

  ngOnInit(): void {
    this.modeler
      .get('eventBus')
      .on('bmdl.types', (event, businessTask) =>
        this.openManageTypesModal(businessTask)
      );
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.processPattern) {
      void this.loadProcessPattern(
        changes.processPattern.currentValue,
        changes.processPattern.firstChange
      );
    }
  }

  ngAfterContentInit(): void {
    this.modeler.attachTo(this.canvas.nativeElement);
  }

  ngOnDestroy(): void {
    this.modeler.destroy();
  }

  saveDiagram(): Promise<void> {
    return this.modeler
      .saveXML()
      .then((result) => this.saveProcessPattern.emit(result.xml));
  }

  toggleLinter(): void {
    this.modeler.get('linting').toggle();
  }

  openManageTypesModal(businessTask: BusinessObject): void {
    this.modalTask = {
      id: businessTask.id,
      name: businessTask.name,
      inherit: businessTask.get('inherit'),
      neededType: businessTask.get('neededType'),
      forbiddenType: businessTask.get('forbiddenType'),
    };
    this.modalReference = this.modalService.open(this.manageTypesModal, {
      size: 'lg',
    });
  }

  async updateTypes(typesForm: UntypedFormGroup): Promise<void> {
    if (this.modalTask != null) {
      this.processPatternModelerService.setTypesOfActivity(
        this.modeler,
        this.modalTask.id,
        typesForm.value.inherit,
        typesForm.value.neededType,
        typesForm.value.forbiddenType
      );
      this.modalReference?.close();
      await this.saveDiagram();
    }
  }

  private async loadProcessPattern(
    processPattern: ProcessPattern,
    firstLoad: boolean
  ): Promise<void> {
    if (processPattern.pattern) {
      await this.modeler.importXML(processPattern.pattern);
      if (firstLoad) {
        this.processPatternModelerService.resizeView(this.modeler);
      }
      if (
        this.modalService.hasOpenModals() &&
        this.modalReference != null &&
        this.modalTask != null
      ) {
        const businessObject =
          this.processPatternModelerService.getBusinessObject(
            this.modeler,
            this.modalTask.id
          );
        if (businessObject == null) {
          this.modalReference.dismiss();
          this.modalReference = undefined;
          this.modalTask = undefined;
        } else {
          this.modalTask = {
            id: businessObject.id,
            name: businessObject.name,
            inherit: businessObject.get('inherit'),
            neededType: businessObject.get('neededType'),
            forbiddenType: businessObject.get('forbiddenType'),
          };
        }
      }
    } else {
      await this.modeler.createDiagram();
    }
  }

  diagramChanged(): Promise<boolean> {
    return this.modeler
      .saveXML()
      .then((result) => result.xml !== this.processPattern?.pattern);
  }
}
