import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ProcessPatternService } from '../../development-process-registry/process-pattern/process-pattern.service';
import { ProcessPattern } from '../../development-process-registry/process-pattern/process-pattern';
import { DiagramComponentInterface } from '../shared/diagram-component-interface';
import { ProcessPatternDiagramComponent } from '../process-pattern-diagram/process-pattern-diagram.component';

@Component({
  selector: 'app-process-pattern',
  templateUrl: './process-pattern.component.html',
  styleUrls: ['./process-pattern.component.css']
})
export class ProcessPatternComponent implements DiagramComponentInterface, OnInit, OnDestroy {

  processPattern: ProcessPattern;

  private routeSubscription: Subscription;

  @ViewChild(ProcessPatternDiagramComponent, {static: false}) diagramComponent: ProcessPatternDiagramComponent;

  constructor(
    private processPatternService: ProcessPatternService,
    private route: ActivatedRoute,
  ) {
  }

  ngOnInit() {
    this.routeSubscription = this.route.paramMap.subscribe(map => this.loadProcessPattern(map.get('id')));
  }

  ngOnDestroy() {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

  loadProcessPattern(id: string) {
    this.processPatternService.getProcessPattern(id).then(
      processPattern => this.processPattern = processPattern
    ).catch(
      error => console.log('LoadProcessPattern: ' + error)
    );
  }

  save(pattern: string) {
    this.processPatternService.updateProcessPattern(this.processPattern._id, {pattern}).then(
      () => this.loadProcessPattern(this.processPattern._id)
    ).catch(
      error => console.log('Save: ' + error)
    );
  }

  updateProcessPatternValue(value: any) {
    this.processPatternService.updateProcessPattern(this.processPattern._id, value).then(
      () => this.loadProcessPattern(this.processPattern._id)
    ).catch(
      error => console.log('UpdateProcessPattern: ' + error)
    );
  }

  diagramChanged(): Promise<boolean> {
    return this.diagramComponent.diagramChanged();
  }

  saveDiagram(): Promise<void> {
    return this.diagramComponent.saveDiagram();
  }
}
