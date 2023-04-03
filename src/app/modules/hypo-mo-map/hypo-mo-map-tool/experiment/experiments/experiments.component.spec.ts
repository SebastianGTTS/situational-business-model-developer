import { ExperimentsComponent } from './experiments.component';
import { createRoutingFactory, Spectator } from '@ngneat/spectator/jest';
import { MockComponents } from 'ng-mocks';
import { ExperimentRepoService } from '../../../hypo-mo-map-meta-artifact/experiment-repo.service';
import { ListPanelComponent } from '../../../../../shared/list-panel/list-panel.component';
import { ElementNameFormComponent } from '../../../../../shared/element-name-form/element-name-form.component';

describe('ExperimentsComponent', () => {
  let spectator: Spectator<ExperimentsComponent>;
  const createComponent = createRoutingFactory({
    component: ExperimentsComponent,
    declarations: [
      MockComponents(ElementNameFormComponent),
      MockComponents(ListPanelComponent),
    ],
    detectChanges: false,
    mocks: [ExperimentRepoService],
  });

  beforeEach(() => {
    spectator = createComponent();
    spectator
      .inject(ExperimentRepoService)
      .getExperimentsList.andReturn(Promise.resolve([]));
  });

  it('should create', () => {
    spectator.detectChanges();
    expect(spectator.component).toBeTruthy();
  });
});
