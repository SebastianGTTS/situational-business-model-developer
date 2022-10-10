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
import { ProcessPattern } from '../../development-process-registry/process-pattern/process-pattern';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DiagramComponentInterface } from '../shared/diagram-component-interface';
import { Type } from '../../development-process-registry/method-elements/type/type';
import { BusinessObject } from 'bpmn-js';
import { ProcessPatternModelerService } from '../shared/process-pattern-modeler.service';

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
    neededType: { list: string; element: Type }[];
    forbiddenType: { list: string; element: Type }[];
  };
  private modalReference?: NgbModalRef;

  @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLDivElement>;
  @ViewChild('manageTypesModal', { static: true }) manageTypesModal: unknown;

  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    private processPatternModelerService: ProcessPatternModelerService
  ) {}

  ngOnInit(): void {
    this.modeler
      .get('eventBus')
      .on('bmdl.types', (event, businessTask) =>
        this.openManageTypesModal(businessTask)
      );
    if (this.processPattern != null) {
      void this.loadProcessPattern(this.processPattern, true);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.processPattern && this.modeler) {
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

  async updateTypes(typesForm: FormGroup): Promise<void> {
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
      this.modeler
        .importXML(processPattern.pattern)
        .then(() => {
          if (firstLoad) {
            this.processPatternModelerService.resizeView(this.modeler);
          }
        })
        .catch((error) => console.log('LoadProcessPattern: ' + error));
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
