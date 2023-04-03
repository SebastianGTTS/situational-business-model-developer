import { APP_INITIALIZER, NgModule } from '@angular/core';

import { HypoMoMapToolRoutingModule } from './hypo-mo-map-tool-routing.module';
import { SharedModule } from '../../../shared/shared.module';
import { EvidenceCostsFormComponent } from './experiment/evidence-costs-form/evidence-costs-form.component';
import { ExperimentChooserComponent } from './experiment/experiment-chooser/experiment-chooser.component';
import { ExperimentDefinitionComponent } from './experiment/experiment-definition/experiment-definition.component';
import { ExperimentFormComponent } from './experiment/experiment-form/experiment-form.component';
import { ExperimentInfoComponent } from './experiment/experiment-info/experiment-info.component';
import { ExperimentMappingsModalComponent } from './experiment/experiment-mappings-modal/experiment-mappings-modal.component';
import { ExperimentTreeComponent } from './experiment/experiment-tree/experiment-tree.component';
import { ExperimentsComponent } from './experiment/experiments/experiments.component';
import { HypothesisFormComponent } from './hypothesis/hypothesis-form/hypothesis-form.component';
import { HypothesisInfoComponent } from './hypothesis/hypothesis-info/hypothesis-info.component';
import { HypothesisMappingsModalComponent } from './hypothesis/hypothesis-mappings-modal/hypothesis-mappings-modal.component';
import { HypothesisTreeComponent } from './hypothesis/hypothesis-tree/hypothesis-tree.component';
import { ManageArtifactsFormComponent } from './experiment/manage-artifacts-form/manage-artifacts-form.component';
import { MappingFormComponent } from './mapping-form/mapping-form.component';
import { UsedExperimentTreeComponent } from './experiment/used-experiment-tree/used-experiment-tree.component';
import { CreateHypoMoMapComponent } from './api/create-hypo-mo-map/create-hypo-mo-map.component';
import { HypoMoMapToolService } from './hypo-mo-map-tool.service';
import { AddHypothesesComponent } from './api/add-hypotheses/add-hypotheses.component';
import { HypothesisModalComponent } from './hypothesis/hypothesis-modal/hypothesis-modal.component';
import { HypothesisDeleteModalComponent } from './hypothesis/hypothesis-delete-modal/hypothesis-delete-modal.component';
import { HypothesisTreeLegendComponent } from './hypothesis/hypothesis-tree-legend/hypothesis-tree-legend.component';
import { AddExperimentsComponent } from './api/add-experiments/add-experiments.component';
import { UsedExperimentTreeLegendComponent } from './experiment/used-experiment-tree-legend/used-experiment-tree-legend.component';
import { ExperimentAddModalComponent } from './experiment/experiment-add-modal/experiment-add-modal.component';
import { ExperimentDeleteModalComponent } from './experiment/experiment-delete-modal/experiment-delete-modal.component';
import { ExperimentEvidenceCostsModalComponent } from './experiment/experiment-evidence-costs-modal/experiment-evidence-costs-modal.component';
import { MappingAddModalComponent } from './mapping-add-modal/mapping-add-modal.component';
import { ArtifactsShowModalComponent } from './experiment/artifacts-show-modal/artifacts-show-modal.component';
import { ExecuteExperimentsComponent } from './api/execute-experiments/execute-experiments.component';
import { EditHypoMoMapComponent } from './api/edit-hypo-mo-map/edit-hypo-mo-map.component';
import { ViewHypoMoMapComponent } from './api/view-hypo-mo-map/view-hypo-mo-map.component';
import { ExperimentDefinitionOverviewComponent } from './experiment/experiment-definition-overview/experiment-definition-overview.component';
import { ExperimentDefinitionGeneralComponent } from './experiment/experiment-definition-general/experiment-definition-general.component';
import { ExperimentDefinitionEditComponent } from './experiment/experiment-definition-edit/experiment-definition-edit.component';

@NgModule({
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: (hypoMoMapService: HypoMoMapToolService) => (): void =>
        hypoMoMapService.init(),
      deps: [HypoMoMapToolService],
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
    ExperimentDefinitionOverviewComponent,
    ExperimentDefinitionGeneralComponent,
    ExperimentDefinitionEditComponent,
  ],
  imports: [HypoMoMapToolRoutingModule, SharedModule],
})
export class HypoMoMapToolModule {}
