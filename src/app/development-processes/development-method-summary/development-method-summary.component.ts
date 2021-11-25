import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  Decision,
  GroupSummary,
} from '../../development-process-registry/bm-process/decision';
import { Artifact } from '../../development-process-registry/method-elements/artifact/artifact';
import { Stakeholder } from '../../development-process-registry/method-elements/stakeholder/stakeholder';
import { Tool } from '../../development-process-registry/method-elements/tool/tool';
import { MethodElement } from '../../development-process-registry/method-elements/method-element';
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

@Component({
  selector: 'app-development-method-summary',
  templateUrl: './development-method-summary.component.html',
  styleUrls: ['./development-method-summary.component.css'],
})
export class DevelopmentMethodSummaryComponent implements OnChanges {
  @Input() decision: Decision;
  @Input() inputArtifacts: StepInputArtifact[] = null;

  @Output() viewArtifactReference = new EventEmitter<{
    reference: ArtifactDataReference;
    api: MetaModelApi;
  }>();

  metaModelDefinitions: MetaModelDefinition[];

  summary: {
    inputArtifacts: GroupSummary<Artifact>;
    outputArtifacts: GroupSummary<Artifact>;
    stakeholders: GroupSummary<Stakeholder>;
    tools: GroupSummary<Tool>;
  };

  constructor(private metaModelService: MetaModelService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.decision) {
      this.summary = changes.decision.currentValue.getSummary();
    }
    if (changes.inputArtifacts && changes.inputArtifacts.currentValue != null) {
      const inputArtifacts: StepInputArtifact[] =
        changes.inputArtifacts.currentValue;
      this.metaModelDefinitions = [];
      this.metaModelDefinitions.length = inputArtifacts.length;
      for (let index = 0; index < inputArtifacts.length; index++) {
        const stepArtifact = inputArtifacts[index];
        if (stepArtifact.data.type === ArtifactDataType.REFERENCE) {
          const reference: ArtifactDataReference = stepArtifact.data.data;
          this.metaModelDefinitions[index] =
            this.metaModelService.getMetaModelDefinition(reference.type);
        }
      }
    }
  }

  _viewArtifactReference(index: number, reference: ArtifactDataReference) {
    this.viewArtifactReference.emit({
      reference,
      api: this.metaModelDefinitions[index].api,
    });
  }

  asGroupSummary<T extends MethodElement>(element: any): GroupSummary<T> {
    return element as GroupSummary<T>;
  }
}
