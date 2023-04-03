import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-hypothesis-tree-legend',
  templateUrl: './hypothesis-tree-legend.component.html',
  styleUrls: ['./hypothesis-tree-legend.component.css'],
})
export class HypothesisTreeLegendComponent {
  @Input() showEvidenceScore = false;
}
