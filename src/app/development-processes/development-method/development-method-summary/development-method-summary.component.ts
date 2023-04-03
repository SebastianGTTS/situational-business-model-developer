import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { StepInputArtifact } from '../../../development-process-registry/running-process/step-input-artifact';
import { MetaArtifactService } from '../../../development-process-registry/meta-artifact.service';
import {
  MetaArtifactApi,
  MetaArtifactDefinition,
} from '../../../development-process-registry/meta-artifact-definition';
import {
  ArtifactDataReference,
  ArtifactDataType,
} from '../../../development-process-registry/running-process/artifact-data';
import { MethodDecision } from '../../../development-process-registry/bm-process/method-decision';
import { GroupDecision } from '../../../development-process-registry/bm-process/group-decision';
import { MethodElement } from '../../../development-process-registry/method-elements/method-element';

@Component({
  selector: 'app-development-method-summary',
  templateUrl: './development-method-summary.component.html',
  styleUrls: ['./development-method-summary.component.css'],
})
export class DevelopmentMethodSummaryComponent implements OnChanges {
  @Input() decision!: MethodDecision;
  @Input() inputArtifacts?: (StepInputArtifact | undefined)[];
  @Input() showInfo = true;

  @Output() viewArtifactReference = new EventEmitter<{
    reference: ArtifactDataReference;
    api: MetaArtifactApi;
  }>();

  metaArtifactDefinitions?: MetaArtifactDefinition[];

  constructor(private metaArtifactService: MetaArtifactService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.inputArtifacts && changes.inputArtifacts.currentValue != null) {
      const inputArtifacts: (StepInputArtifact | undefined)[] =
        changes.inputArtifacts.currentValue;
      this.metaArtifactDefinitions = [];
      this.metaArtifactDefinitions.length = inputArtifacts.length;
      for (let index = 0; index < inputArtifacts.length; index++) {
        const stepArtifact = inputArtifacts[index];
        if (
          stepArtifact != null &&
          stepArtifact.data.type === ArtifactDataType.REFERENCE
        ) {
          const reference: ArtifactDataReference = stepArtifact.data
            .data as ArtifactDataReference;
          this.metaArtifactDefinitions[index] =
            this.metaArtifactService.getMetaArtifactDefinition(
              reference.type
            ) as MetaArtifactDefinition;
        }
      }
    }
  }

  _viewArtifactReference(
    index: number,
    reference: ArtifactDataReference
  ): void {
    if (this.metaArtifactDefinitions != null) {
      this.viewArtifactReference.emit({
        reference,
        api: this.metaArtifactDefinitions[index].api,
      });
    }
  }

  asGroupDecision<T extends MethodElement>(element: unknown): GroupDecision<T> {
    return element as GroupDecision<T>;
  }
}
