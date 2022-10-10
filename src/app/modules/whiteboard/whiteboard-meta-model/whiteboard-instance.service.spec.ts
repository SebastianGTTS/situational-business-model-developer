import { WhiteboardInstanceService } from './whiteboard-instance.service';
import {
  createServiceFactory,
  SpectatorService,
  SpyObject,
} from '@ngneat/spectator/jest';
import { PouchdbService } from '../../../database/pouchdb.service';
import { WhiteboardInstance } from './whiteboard-instance';
import { WhiteboardTemplate } from './whiteboard-template';
import { WhiteboardCanvasService } from './whiteboard-canvas.service';
import { WhiteboardCanvas } from './whiteboard';

describe('WhiteboardInstanceService', () => {
  let spectator: SpectatorService<WhiteboardInstanceService>;
  let pouchdbService: SpyObject<PouchdbService>;
  let whiteboardCanvasService: SpyObject<WhiteboardCanvasService>;

  const createService = createServiceFactory({
    service: WhiteboardInstanceService,
    mocks: [PouchdbService, WhiteboardCanvasService],
  });

  beforeEach(() => {
    spectator = createService();
    pouchdbService = spectator.inject(PouchdbService);
    whiteboardCanvasService = spectator.inject(WhiteboardCanvasService);
    whiteboardCanvasService.setReadOnly.andCallFake(
      (whiteboardCanvas: WhiteboardCanvas) => whiteboardCanvas
    );
  });

  it('should add instances', async () => {
    await spectator.service.add({
      name: 'Test',
      whiteboard: '',
    });
    expect(pouchdbService.post).toHaveBeenCalled();
    expect(pouchdbService.post.mock.calls).toHaveLength(1);
    const instance: WhiteboardInstance = pouchdbService.post.mock.calls[0][0];
    expect(instance).toBeTruthy();
    expect(instance).toBeInstanceOf(WhiteboardInstance);
    expect(instance.name).toBe('Test');
  });

  it('should add instance via template', async () => {
    const template = new WhiteboardTemplate(undefined, {
      name: 'Template',
      whiteboard: 'Test Whiteboard Serialization',
    });
    await spectator.service.addByTemplate('TestInstance', template);
    expect(pouchdbService.put).toHaveBeenCalled();
    expect(pouchdbService.put.mock.calls).toHaveLength(1);
    const instance: WhiteboardInstance = pouchdbService.put.mock.calls[0][0];
    expect(instance).toBeTruthy();
    expect(instance.name).toBe('TestInstance');
    expect(instance.whiteboard).toBe('Test Whiteboard Serialization');
    expect(whiteboardCanvasService.setReadOnly).toHaveBeenCalled();
    expect(whiteboardCanvasService.setReadOnly.mock.calls).toHaveLength(1);
    const whiteboardCanvas: WhiteboardCanvas =
      whiteboardCanvasService.setReadOnly.mock.calls[0][0];
    expect(whiteboardCanvas).toBe('Test Whiteboard Serialization');
  });
});
