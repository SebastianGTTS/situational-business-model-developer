import { OptionsComponent } from './options.component';
import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { PouchdbService } from '../database/pouchdb.service';
import { AutoCompletionService } from '../auto-completion.service';

describe('OptionsComponent', () => {
  let spectator: Spectator<OptionsComponent>;
  const createComponent = createComponentFactory({
    component: OptionsComponent,
    declarations: [],
    detectChanges: false,
    mocks: [AutoCompletionService, PouchdbService],
  });

  beforeEach(() => {
    spectator = createComponent();
    spectator.inject(AutoCompletionService).getLists.and.returnValue(Promise.resolve([]));
  });

  it('should create', () => {
    spectator.detectChanges();
    expect(spectator.component).toBeTruthy();
  });
});
