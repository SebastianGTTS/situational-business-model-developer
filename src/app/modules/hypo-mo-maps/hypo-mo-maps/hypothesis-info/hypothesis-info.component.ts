import { Component, Input } from '@angular/core';
import { Hypothesis } from '../../hypo-mo-map-meta-model/hypothesis';

@Component({
  selector: 'app-hypothesis-info',
  templateUrl: './hypothesis-info.component.html',
  styleUrls: ['./hypothesis-info.component.css'],
})
export class HypothesisInfoComponent {
  @Input() hypothesis!: Hypothesis;
  @Input() showEvidence = false;
}
