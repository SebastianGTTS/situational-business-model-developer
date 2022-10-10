import { WhiteboardTemplatesComponent } from './whiteboard-templates.component';
import {
  createRoutingFactory,
  createSpyObject,
  Spectator,
} from '@ngneat/spectator/jest';
import { MockComponent, ngMocks } from 'ng-mocks';
import { DeleteModalComponent } from '../../../../shared/delete-modal/delete-modal.component';
import { ListWrapperComponent } from '../../../../shared/list-wrapper/list-wrapper.component';
import { AuthorInfoComponent } from '../../../../shared/author-info/author-info.component';
import { ResultsListItemComponent } from '../../../../shared/results-list-item/results-list-item.component';
import { ReactiveFormsModule } from '@angular/forms';
import { WhiteboardTemplateService } from '../../whiteboard-meta-model/whiteboard-template.service';
import {
  WhiteboardTemplate,
  WhiteboardTemplateEntry,
} from '../../whiteboard-meta-model/whiteboard-template';

describe('WhiteboardTemplatesComponent', () => {
  let spectator: Spectator<WhiteboardTemplatesComponent>;
  const createComponent = createRoutingFactory({
    component: WhiteboardTemplatesComponent,
    declarations: [
      MockComponent(AuthorInfoComponent),
      MockComponent(DeleteModalComponent),
      MockComponent(ListWrapperComponent),
      MockComponent(ResultsListItemComponent),
    ],
    imports: [ReactiveFormsModule],
    providers: [
      {
        provide: WhiteboardTemplateService,
        useFactory: (): WhiteboardTemplateService =>
          createWhiteboardTemplateService(),
      },
    ],
  });
  let loadList: (entries: WhiteboardTemplateEntry[]) => void;
  let listWrapperComponent: ListWrapperComponent<WhiteboardTemplateEntry>;

  beforeEach(() => {
    spectator = createComponent();
    listWrapperComponent =
      ngMocks.find<ListWrapperComponent<WhiteboardTemplateEntry>>(
        'app-list-wrapper'
      ).componentInstance;
  });

  function createWhiteboardTemplateService(): WhiteboardTemplateService {
    const spy = createSpyObject(WhiteboardTemplateService);
    spy.getList.andReturn(new Promise((done) => (loadList = done)));
    return spy;
  }

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
    expect(listWrapperComponent.listTitle).toBe('Whiteboard Templates');
  });

  it('should display loading', () => {
    expect(listWrapperComponent.loading).toBe(true);
  });

  it('should display no results', async () => {
    loadList([]);
    await Promise.resolve();
    spectator.detectChanges();
    expect(listWrapperComponent.loading).toBe(false);
    expect(listWrapperComponent.reloading).toBe(false);
    expect(listWrapperComponent.noResults).toBe(true);
  });

  it('should display results', async () => {
    loadList([
      new WhiteboardTemplate(undefined, {
        name: 'Test',
        whiteboard: '',
      }).toDb(),
    ]);
    await Promise.resolve();
    spectator.detectChanges();
    expect(listWrapperComponent.loading).toBe(false);
    expect(listWrapperComponent.reloading).toBe(false);
    expect(listWrapperComponent.noResults).toBe(false);
    const list = spectator.query('[results]');
    expect(list?.children).toHaveLength(1);
  });
});
