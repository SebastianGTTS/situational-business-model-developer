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

import Modeler from 'bpmn-js/lib/Modeler';
import { ProcessPattern } from '../../development-process-registry/process-pattern/process-pattern';
import { BpmnService } from '../shared/bpmn.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DiagramComponentInterface } from '../shared/diagram-component-interface';
import { Type } from '../../development-process-registry/method-elements/type/type';

@Component({
  selector: 'app-process-pattern-diagram',
  templateUrl: './process-pattern-diagram.component.html',
  styleUrls: ['./process-pattern-diagram.component.css']
})
export class ProcessPatternDiagramComponent implements DiagramComponentInterface, OnInit, AfterContentInit, OnChanges, OnDestroy {

  @Input() processPattern: ProcessPattern;

  @Output() saveProcessPattern = new EventEmitter<string>();

  private modeler: Modeler;

  modalTask: {
    id: string,
    name: string,
    inherit: boolean,
    neededType: { list: string, element: Type }[],
    forbiddenType: { list: string, element: Type }[],
  };
  private modalReference: NgbModalRef;

  @ViewChild('canvas', {static: true}) canvas: ElementRef<HTMLDivElement>;
  @ViewChild('manageTypesModal', {static: true}) manageTypesModal: any;

  constructor(
    private bpmnService: BpmnService,
    private fb: FormBuilder,
    private modalService: NgbModal,
  ) {
  }

  ngOnInit() {
    this.modeler = this.bpmnService.getBpmnProcessPatternModeler();
    this.modeler.get('eventBus').on('bmdl.types', (event, businessTask) => this.openManageTypesModal(businessTask));
    if (this.processPattern) {
      this.loadProcessPattern(this.processPattern, true);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.processPattern && this.modeler) {
      this.loadProcessPattern(changes.processPattern.currentValue, changes.processPattern.firstChange);
    }
  }

  ngAfterContentInit(): void {
    this.modeler.attachTo(this.canvas.nativeElement);
  }

  ngOnDestroy(): void {
    this.modeler.destroy();
  }

  saveDiagram(): Promise<void> {
    return this.modeler.saveXML().then(
      result => this.saveProcessPattern.emit(result.xml)
    );
  }

  openManageTypesModal(businessTask) {
    this.modalTask = {
      id: businessTask.id,
      name: businessTask.name,
      inherit: businessTask.get('inherit'),
      neededType: businessTask.get('neededType'),
      forbiddenType: businessTask.get('forbiddenType'),
    };
    this.modalReference = this.modalService.open(this.manageTypesModal, {size: 'lg'});
  }

  updateTypes(typesForm: FormGroup) {
    this.bpmnService.setTypesOfActivity(
      this.modeler, this.modalTask.id, typesForm.value.inherit, typesForm.value.neededType, typesForm.value.forbiddenType,
    );
    this.modalReference.close();
    this.saveDiagram();
  }

  private loadProcessPattern(processPattern: ProcessPattern, firstLoad: boolean) {
    if (processPattern.pattern) {
      this.modeler.importXML(processPattern.pattern).then(() => {
        if (firstLoad) {
          this.bpmnService.resizeView(this.modeler);
        }
      }).catch(
        error => console.log('LoadProcessPattern: ' + error)
      );
    } else {
      this.modeler.createDiagram();
    }
  }

  diagramChanged(): Promise<boolean> {
    return this.modeler.saveXML().then((result) => result.xml !== this.processPattern.pattern);
  }

}
