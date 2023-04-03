import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import {
  SituationalFactor,
  SituationalFactorEntry,
} from '../../../../development-process-registry/method-elements/situational-factor/situational-factor';
import { SituationalFactorDefinition } from '../../../../development-process-registry/method-elements/situational-factor/situational-factor-definition';
import { SituationalFactorService } from '../../../../development-process-registry/method-elements/situational-factor/situational-factor.service';

@Component({
  selector: 'app-situational-factors-overview',
  templateUrl: './situational-factors-overview.component.html',
  styleUrls: ['./situational-factors-overview.component.css'],
})
export class SituationalFactorsOverviewComponent implements OnChanges {
  @Input() needed!: SituationalFactor[];
  @Input() provided!: SituationalFactorEntry[];

  factors: {
    list: string;
    name: string;
    needed: string;
    provided: string;
    fulfills: boolean | undefined;
  }[] = [];
  factorsMap?: { [list: string]: { [name: string]: string } };

  constructor(private situationalFactorService: SituationalFactorService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.provided) {
      this.createFactorsMap();
    }
    if (changes.needed || changes.provided) {
      this.calculateFactors();
    }
  }

  calculateFactors(): void {
    this.factors = this.needed.map((factor) => {
      const provided = this.getProvidedValue(factor.factor);
      let fulfills: boolean | undefined;
      if (provided) {
        if (provided === factor.value) {
          fulfills = true;
        } else {
          if (factor.factor.ordered) {
            fulfills =
              factor.factor.values.indexOf(factor.value) <=
              factor.factor.values.indexOf(provided);
          } else {
            fulfills = false;
          }
        }
      } else {
        fulfills = undefined;
      }
      return {
        list: factor.factor.list,
        name: factor.factor.name,
        needed: factor.value,
        provided: provided ? provided : '-',
        fulfills,
      };
    });
  }

  private createFactorsMap(): void {
    this.factorsMap = this.situationalFactorService.createMap(this.provided);
  }

  private getProvidedValue(
    factor: SituationalFactorDefinition
  ): string | undefined {
    if (this.factorsMap == null) {
      return undefined;
    }
    if (factor.list in this.factorsMap) {
      const provided = this.factorsMap[factor.list][factor.name];
      if (provided) {
        return provided;
      }
    }
    return undefined;
  }
}
