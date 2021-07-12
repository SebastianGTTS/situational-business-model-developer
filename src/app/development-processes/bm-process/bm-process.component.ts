import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { BmProcess } from '../../development-process-registry/bm-process/bm-process';
import { BmProcessService } from '../../development-process-registry/bm-process/bm-process.service';
import { FormBuilder } from '@angular/forms';
import { DevelopmentMethodService } from '../../development-process-registry/development-method/development-method.service';
import { BpmnService } from '../shared/bpmn.service';
import { DiagramComponentInterface } from '../shared/diagram-component-interface';
import { BmProcessDiagramComponent } from '../bm-process-diagram/bm-process-diagram.component';

@Component({
  selector: 'app-bm-process',
  templateUrl: './bm-process.component.html',
  styleUrls: ['./bm-process.component.css']
})
export class BmProcessComponent implements DiagramComponentInterface, OnInit, OnDestroy {

  bmProcess: BmProcess;

  private routeSubscription: Subscription;

  @ViewChild(BmProcessDiagramComponent, {static: false}) diagramComponent: BmProcessDiagramComponent;

  constructor(
    private bmProcessService: BmProcessService,
    private bpmnService: BpmnService,
    private developmentMethodService: DevelopmentMethodService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
  ) {
  }

  ngOnInit() {
    this.routeSubscription = this.route.paramMap.subscribe(map => this.loadBmProcess(map.get('id')));
  }

  ngOnDestroy() {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

  loadBmProcess(id: string) {
    this.bmProcessService.getBmProcess(id).then(
      bmProcess => this.bmProcess = bmProcess
    ).catch(
      error => console.log('LoadBmProcess: ' + error)
    );
  }

  save(bmProcess: Partial<BmProcess>) {
    this.bmProcessService.updateBmProcess(this.bmProcess._id, bmProcess).then(
      () => this.loadBmProcess(this.bmProcess._id)
    ).catch(
      error => console.log('Save: ' + error)
    );
  }

  updateBmProcessValue(value: any) {
    this.bmProcessService.updateBmProcess(this.bmProcess._id, value).then(
      () => this.loadBmProcess(this.bmProcess._id)
    ).catch(
      error => console.log('UpdateBmProcess: ' + error)
    );
  }

  diagramChanged(): Promise<boolean> {
    return this.diagramComponent.diagramChanged();
  }

  saveDiagram(): Promise<void> {
    return this.diagramComponent.saveDiagram();
  }
}
