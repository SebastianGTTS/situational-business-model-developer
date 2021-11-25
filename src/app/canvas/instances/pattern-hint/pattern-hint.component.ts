import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { PatternHint } from '../../../canvas-meta-model/conformance-report';

@Component({
  selector: 'app-pattern-hint',
  templateUrl: './pattern-hint.component.html',
  styleUrls: ['./pattern-hint.component.css'],
})
export class PatternHintComponent implements OnChanges {
  @Input() patternHint: PatternHint;

  missingFeaturesInfo: string;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.patternHint) {
      this.buildMissingFeaturesInfo();
    }
  }

  private buildMissingFeaturesInfo(): void {
    this.missingFeaturesInfo = this.patternHint.missingFeatures
      .map((feature) => feature.name)
      .join(', ');
  }
}
