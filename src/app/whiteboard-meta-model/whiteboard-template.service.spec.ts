import { WhiteboardTemplateService } from './whiteboard-template.service';
import {
  createServiceFactory,
  SpectatorService,
  SpyObject,
} from '@ngneat/spectator/jest';
import { PouchdbService } from '../database/pouchdb.service';
import { WhiteboardTemplate } from './whiteboard-template';
import { WhiteboardCanvasService } from './whiteboard-canvas.service';

describe('WhiteboardTemplateService', () => {
  let spectator: SpectatorService<WhiteboardTemplateService>;
  let pouchdbService: SpyObject<PouchdbService>;
  let whiteboardCanvasService: SpyObject<WhiteboardCanvasService>;

  const createService = createServiceFactory({
    service: WhiteboardTemplateService,
    mocks: [PouchdbService, WhiteboardCanvasService],
  });

  beforeEach(() => {
    spectator = createService();
    pouchdbService = spectator.inject(PouchdbService);
    whiteboardCanvasService = spectator.inject(WhiteboardCanvasService);
  });

  it('should add template', async () => {
    await spectator.service.add({
      name: 'Test',
      whiteboard: '',
    });
    expect(pouchdbService.post).toHaveBeenCalled();
    expect(pouchdbService.post.mock.calls).toHaveLength(1);
    const instance: WhiteboardTemplate = pouchdbService.post.mock.calls[0][0];
    expect(instance).toBeTruthy();
    expect(instance).toBeInstanceOf(WhiteboardTemplate);
  });

  it('should generate whiteboard template initialization', () => {
    whiteboardCanvasService.getEmptyWhiteboardCanvas.andReturn(
      'Test WhiteboardCanvas'
    );
    const init = spectator.service.getWhiteboardTemplateInitialization('Test');
    expect(init).toBeTruthy();
    expect(init.name).toBe('Test');
    expect(init.whiteboard).toBe('Test WhiteboardCanvas');
  });
});
