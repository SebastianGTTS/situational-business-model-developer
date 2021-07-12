import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Instance } from '../../../canvas-meta-model/instance';
import { ConformanceReport } from '../../../canvas-meta-model/conformance-report';
import { FeatureModel } from '../../../canvas-meta-model/feature-model';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.css']
})
export class CanvasComponent {

  @Input() featureModel: FeatureModel;
  @Input() instance: Instance;

  @Input() conformance: ConformanceReport = new ConformanceReport();
  @Input() conformanceOptions: {
    showWarnings: boolean,
    showStrengths: boolean,
    showHints: boolean,
    showPatternHints: boolean,
  } = {
    showHints: false,
    showPatternHints: false,
    showStrengths: false,
    showWarnings: false,
  };

  @Input() compareInstance: Instance = null;
  @Input() percentages: { [id: string]: number } = null;

  @Input() patternInstance: Instance = null;

  @Input() editable = true;


  @Output() addFeatureModal = new EventEmitter<string>();
  @Output() deleteFeatureModal = new EventEmitter<string>();


  getHeatmapStyle(featureId: string) {
    return this.percentages ? {'background-color': 'hsla(' + (this.percentages[featureId] / 100) * 120 + ', 100%, 66%, 0.3)'} : {};
  }

}
