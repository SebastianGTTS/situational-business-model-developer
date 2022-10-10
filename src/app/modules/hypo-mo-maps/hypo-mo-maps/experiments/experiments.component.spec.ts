import { ExperimentsComponent } from './experiments.component';
import { createRoutingFactory, Spectator } from '@ngneat/spectator/jest';
import { ReactiveFormsModule } from '@angular/forms';
import { MockComponent, MockComponents } from 'ng-mocks';
import { AuthorInfoComponent } from '../../../../shared/author-info/author-info.component';
import { ExperimentRepoService } from '../../hypo-mo-map-meta-model/experiment-repo.service';
import { ListWrapperComponent } from '../../../../shared/list-wrapper/list-wrapper.component';
import { ResultsListItemComponent } from '../../../../shared/results-list-item/results-list-item.component';

describe('ExperimentsComponent', () => {
  let spectator: Spectator<ExperimentsComponent>;
  const createComponent = createRoutingFactory({
    component: ExperimentsComponent,
    declarations: [
      MockComponent(AuthorInfoComponent),
      MockComponents(ListWrapperComponent),
      MockComponents(ResultsListItemComponent),
    ],
    detectChanges: false,
    imports: [ReactiveFormsModule],
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
