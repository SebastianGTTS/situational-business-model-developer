import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Selection } from '../../development-process-registry/development-method/selection';
import { SituationalFactor } from '../../development-process-registry/method-elements/situational-factor/situational-factor';
import { SituationalFactorService } from '../../development-process-registry/method-elements/situational-factor/situational-factor.service';

enum Status {
  ADDED,
  REMOVED,
  CHANGED,
}

@Component({
  selector: 'app-situational-factors-list',
  templateUrl: './situational-factors-list.component.html',
  styleUrls: ['./situational-factors-list.component.css'],
})
export class SituationalFactorsListComponent implements OnChanges {
  @Input() situationalFactors!: Selection<SituationalFactor>[];
  @Input() newSituationalFactors?: Selection<SituationalFactor>[];

  combinedList?: {
    factorName: string;
    factorValue: string;
    newFactorValue?: string;
    status?: Status;
  }[];

  constructor(private situationalFactorService: SituationalFactorService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.situationalFactors || changes.newSituationalFactors) {
      this.generateCombinedList();
    }
  }

  private generateCombinedList(): void {
    if (this.newSituationalFactors == null) {
      this.combinedList = this.situationalFactors.map((factor) => {
        return {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          factorName: factor.element!.factor.name,
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          factorValue: factor.element!.value,
        };
      });
    } else {
      const newSituationalFactorMap = this.situationalFactorService.createMap(
        this.newSituationalFactors.map(
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          (factor) => factor.element!
        )
      );
      const situationalFactorIds = new Set<string>();
      this.combinedList = [];
      for (const factor of this.situationalFactors) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const element = factor.element!;
        situationalFactorIds.add(element.factor._id);
        const newFactor: string | undefined =
          newSituationalFactorMap[element.factor.list]?.[element.factor.name];
        if (newFactor != null) {
          if (newFactor === element.value) {
            this.combinedList.push({
              factorName: element.factor.name,
              factorValue: element.value,
            });
          } else {
            this.combinedList.push({
              factorName: element.factor.name,
              factorValue: element.value,
              newFactorValue: newFactor,
              status: Status.CHANGED,
            });
          }
        } else {
          this.combinedList.push({
            factorName: element.factor.name,
            factorValue: element.value,
            status: Status.REMOVED,
          });
        }
      }
      for (const factor of this.newSituationalFactors) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const element = factor.element!;
        if (!situationalFactorIds.has(element.factor._id)) {
          this.combinedList.push({
            factorName: element.factor.name,
            factorValue: element.value,
            status: Status.ADDED,
          });
        }
      }
    }
  }

  get status(): typeof Status {
    return Status;
  }
}
