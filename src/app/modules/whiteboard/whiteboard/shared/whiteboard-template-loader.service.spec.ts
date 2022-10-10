import { WhiteboardTemplateLoaderService } from './whiteboard-template-loader.service';
import {
  createServiceFactory,
  createSpyObject,
  SpectatorService,
  SpyObject,
} from '@ngneat/spectator/jest';
import { WhiteboardTemplateService } from '../../whiteboard-meta-model/whiteboard-template.service';
import { ActivatedRoute } from '@angular/router';
import { ActivatedRouteStub } from '@ngneat/spectator';
import { WhiteboardTemplate } from '../../whiteboard-meta-model/whiteboard-template';
import { Subject } from 'rxjs';

describe('WhiteboardTemplateLoaderService', () => {
  let spectator: SpectatorService<WhiteboardTemplateLoaderService>;
  let activatedRouteStub: ActivatedRouteStub;
  let whiteboardTemplateService: SpyObject<WhiteboardTemplateService>;
  let change: Subject<void>;

  let whiteboardTemplate: WhiteboardTemplate;

  const createService = createServiceFactory({
    service: WhiteboardTemplateLoaderService,
    providers: [
      {
        provide: ActivatedRoute,
        useFactory: (): ActivatedRoute => createActivatedRouteStub(),
      },
      {
        provide: WhiteboardTemplateService,
        useFactory: (): WhiteboardTemplateService =>
          createWhiteboardTemplateService(),
      },
    ],
  });

  function createActivatedRouteStub(): ActivatedRoute {
    activatedRouteStub = new ActivatedRouteStub({
      params: { id: 'TestId' },
    });
    return activatedRouteStub;
  }

  function createWhiteboardTemplateService(): WhiteboardTemplateService {
    change = new Subject();
    const spy = createSpyObject(WhiteboardTemplateService);
    spy.get.andReturn(whiteboardTemplate);
    spy.getChangesFeed.andReturn(change);
    return spy;
  }

  function mockNextTemplate(): WhiteboardTemplate {
    const newTemplate = new WhiteboardTemplate(undefined, {
      name: 'NewTestId',
      whiteboard: '',
    });
    whiteboardTemplateService.get.andReturn(newTemplate);
    return newTemplate;
  }

  beforeEach(() => {
    whiteboardTemplate = new WhiteboardTemplate(undefined, {
      name: 'Test Template',
      whiteboard: '',
    });
    spectator = createService();
    whiteboardTemplateService = spectator.inject(WhiteboardTemplateService);
  });

  afterEach(() => {
    change.complete();
  });

  it('should create', () => {
    expect(spectator.service).toBeTruthy();
  });

  it('should load', () => {
    let loaded = 0;
    const subscription = spectator.service.loaded.subscribe(() => loaded++);
    expect(loaded).toBe(1);
    expect(spectator.service.whiteboardTemplate).toBe(whiteboardTemplate);
    expect(whiteboardTemplateService.get).toHaveBeenCalled();
    expect(whiteboardTemplateService.get.mock.calls).toHaveLength(1);
    expect(whiteboardTemplateService.get.mock.calls[0][0]).toBe('TestId');
    subscription.unsubscribe();
  });

  it('should reload on params change', async () => {
    let loaded = 0;
    const subscription = spectator.service.loaded.subscribe(() => loaded++);
    expect(loaded).toBe(1);
    const newTemplate = mockNextTemplate();
    activatedRouteStub.setParam('id', 'NewTestId');
    activatedRouteStub.triggerNavigation();
    await Promise.resolve();
    expect(loaded).toBe(2);
    expect(spectator.service.whiteboardTemplate).toBe(newTemplate);
    expect(whiteboardTemplateService.get.mock.calls).toHaveLength(2);
    expect(whiteboardTemplateService.get.mock.calls[1][0]).toBe('NewTestId');
    subscription.unsubscribe();
  });

  it('should reload on change', async () => {
    let loaded = 0;
    const subscription = spectator.service.loaded.subscribe(() => loaded++);
    expect(loaded).toBe(1);
    const newTemplate = mockNextTemplate();
    change.next();
    await Promise.resolve();
    expect(loaded).toBe(2);
    expect(spectator.service.whiteboardTemplate).toBe(newTemplate);
    expect(whiteboardTemplateService.get.mock.calls).toHaveLength(2);
    expect(whiteboardTemplateService.get.mock.calls[1][0]).toBe('TestId');
    subscription.unsubscribe();
  });
});
