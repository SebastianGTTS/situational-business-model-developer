import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { StepInputArtifact } from '../../development-process-registry/running-process/step-input-artifact';
import { MetaModelService } from '../../development-process-registry/meta-model.service';
import {
  MetaModelApi,
  MetaModelDefinition,
} from '../../development-process-registry/meta-model-definition';
import {
  ArtifactDataReference,
  ArtifactDataType,
} from '../../development-process-registry/running-process/artifact-data';
import { MethodDecision } from '../../development-process-registry/bm-process/method-decision';
import { GroupDecision } from '../../development-process-registry/bm-process/group-decision';
import { MethodElement } from '../../development-process-registry/method-elements/method-element';

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
    api: MetaModelApi;
  }>();

  metaModelDefinitions?: MetaModelDefinition[];

  constructor(private metaModelService: MetaModelService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.inputArtifacts && changes.inputArtifacts.currentValue != null) {
      const inputArtifacts: (StepInputArtifact | undefined)[] =
        changes.inputArtifacts.currentValue;
      this.metaModelDefinitions = [];
      this.metaModelDefinitions.length = inputArtifacts.length;
      for (let index = 0; index < inputArtifacts.length; index++) {
        const stepArtifact = inputArtifacts[index];
        if (
          stepArtifact != null &&
          stepArtifact.data.type === ArtifactDataType.REFERENCE
        ) {
          const reference: ArtifactDataReference = stepArtifact.data
            .data as ArtifactDataReference;
          this.metaModelDefinitions[index] =
            this.metaModelService.getMetaModelDefinition(
              reference.type
            ) as MetaModelDefinition;
        }
      }
    }
  }

  _viewArtifactReference(
    index: number,
    reference: ArtifactDataReference
  ): void {
    if (this.metaModelDefinitions != null) {
      this.viewArtifactReference.emit({
        reference,
        api: this.metaModelDefinitions[index].api,
      });
    }
  }

  asGroupDecision<T extends MethodElement>(element: unknown): GroupDecision<T> {
    return element as GroupDecision<T>;
  }
}
