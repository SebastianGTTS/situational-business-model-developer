import { ExperimentDefinitionComponent } from './experiment-definition.component';
import { createRoutingFactory, Spectator } from '@ngneat/spectator/jest';
import { MockComponent } from 'ng-mocks';
import { ExperimentFormComponent } from '../experiment-form/experiment-form.component';
import { ExperimentTreeComponent } from '../experiment-tree/experiment-tree.component';
import { AuthorFormComponent } from '../../../../shared/author-form/author-form.component';
import { ManageArtifactsFormComponent } from '../manage-artifacts-form/manage-artifacts-form.component';
import { ExperimentRepoService } from '../../hypo-mo-map-meta-model/experiment-repo.service';
import { Experiment } from '../../hypo-mo-map-meta-model/experiment';
import { ExperimentDefinition } from '../../hypo-mo-map-meta-model/experiment-definition';

describe('ExperimentDefinitionComponent', () => {
  let spectator: Spectator<ExperimentDefinitionComponent>;
  const createComponent = createRoutingFactory({
    component: ExperimentDefinitionComponent,
    declarations: [
      MockComponent(AuthorFormComponent),
      MockComponent(ExperimentFormComponent),
      MockComponent(ExperimentTreeComponent),
      MockComponent(ManageArtifactsFormComponent),
    ],
    detectChanges: false,
    mocks: [ExperimentRepoService],
  });

  beforeEach(() => {
    spectator = createComponent();
    spectator.inject(ExperimentRepoService).get.andReturn(
      Promise.resolve(
        new ExperimentDefinition(undefined, {
          author: {},
          experiment: new Experiment(
            undefined,
            { name: 'Test', id: 'root' },
            undefined
          ),
        })
      )
    );
  });

  it('should create', () => {
    spectator.detectChanges();
    expect(spectator.component).toBeTruthy();
  });
});
