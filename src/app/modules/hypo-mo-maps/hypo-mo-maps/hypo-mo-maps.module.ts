import { APP_INITIALIZER, NgModule } from '@angular/core';

import { HypoMoMapsRoutingModule } from './hypo-mo-maps-routing.module';
import { SharedModule } from '../../../shared/shared.module';
import { EvidenceCostsFormComponent } from './evidence-costs-form/evidence-costs-form.component';
import { ExperimentChooserComponent } from './experiment-chooser/experiment-chooser.component';
import { ExperimentDefinitionComponent } from './experiment-definition/experiment-definition.component';
import { ExperimentFormComponent } from './experiment-form/experiment-form.component';
import { ExperimentInfoComponent } from './experiment-info/experiment-info.component';
import { ExperimentMappingsModalComponent } from './experiment-mappings-modal/experiment-mappings-modal.component';
import { ExperimentTreeComponent } from './experiment-tree/experiment-tree.component';
import { ExperimentsComponent } from './experiments/experiments.component';
import { HypoMoMapFormComponent } from './hypo-mo-map-form/hypo-mo-map-form.component';
import { HypothesisFormComponent } from './hypothesis-form/hypothesis-form.component';
import { HypothesisInfoComponent } from './hypothesis-info/hypothesis-info.component';
import { HypothesisMappingsModalComponent } from './hypothesis-mappings-modal/hypothesis-mappings-modal.component';
import { HypothesisTreeComponent } from './hypothesis-tree/hypothesis-tree.component';
import { ManageArtifactsFormComponent } from './manage-artifacts-form/manage-artifacts-form.component';
import { MappingFormComponent } from './mapping-form/mapping-form.component';
import { UsedExperimentTreeComponent } from './used-experiment-tree/used-experiment-tree.component';
import { CreateHypoMoMapComponent } from './api/create-hypo-mo-map/create-hypo-mo-map.component';
import { HypoMoMapService } from './hypo-mo-map.service';
import { AddHypothesesComponent } from './api/add-hypotheses/add-hypotheses.component';
import { HypothesisModalComponent } from './hypothesis-modal/hypothesis-modal.component';
import { HypothesisDeleteModalComponent } from './hypothesis-delete-modal/hypothesis-delete-modal.component';
import { HypothesisTreeLegendComponent } from './hypothesis-tree-legend/hypothesis-tree-legend.component';
import { AddExperimentsComponent } from './api/add-experiments/add-experiments.component';
import { UsedExperimentTreeLegendComponent } from './used-experiment-tree-legend/used-experiment-tree-legend.component';
import { ExperimentAddModalComponent } from './experiment-add-modal/experiment-add-modal.component';
import { ExperimentDeleteModalComponent } from './experiment-delete-modal/experiment-delete-modal.component';
import { ExperimentEvidenceCostsModalComponent } from './experiment-evidence-costs-modal/experiment-evidence-costs-modal.component';
import { MappingAddModalComponent } from './mapping-add-modal/mapping-add-modal.component';
import { ArtifactsShowModalComponent } from './artifacts-show-modal/artifacts-show-modal.component';
import { ExecuteExperimentsComponent } from './api/execute-experiments/execute-experiments.component';
import { EditHypoMoMapComponent } from './api/edit-hypo-mo-map/edit-hypo-mo-map.component';
import { ViewHypoMoMapComponent } from './api/view-hypo-mo-map/view-hypo-mo-map.component';

@NgModule({
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: (hypoMoMapService: HypoMoMapService) => (): void =>
        hypoMoMapService.init(),
      deps: [HypoMoMapService],
      multi: true,
    },
  ],
  declarations: [
    EvidenceCostsFormComponent,
    ExperimentChooserComponent,
    ExperimentDefinitionComponent,
    ExperimentFormComponent,
    ExperimentInfoComponent,
    ExperimentMappingsModalComponent,
    ExperimentTreeComponent,
    ExperimentsComponent,
    HypoMoMapFormComponent,
    HypothesisFormComponent,
    HypothesisInfoComponent,
    HypothesisMappingsModalComponent,
    HypothesisTreeComponent,
    ManageArtifactsFormComponent,
    MappingFormComponent,
    UsedExperimentTreeComponent,
    CreateHypoMoMapComponent,
    AddHypothesesComponent,
    HypothesisModalComponent,
    HypothesisDeleteModalComponent,
    HypothesisTreeLegendComponent,
    AddExperimentsComponent,
    UsedExperimentTreeLegendComponent,
    ExperimentAddModalComponent,
    ExperimentDeleteModalComponent,
    ExperimentEvidenceCostsModalComponent,
    MappingAddModalComponent,
    ArtifactsShowModalComponent,
    ExecuteExperimentsComponent,
    EditHypoMoMapComponent,
    ViewHypoMoMapComponent,
  ],
  imports: [HypoMoMapsRoutingModule, SharedModule],
})
export class HypoMoMapsModule {}
