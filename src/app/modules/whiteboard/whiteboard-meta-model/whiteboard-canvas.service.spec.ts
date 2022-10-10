import { WhiteboardCanvasService } from './whiteboard-canvas.service';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

describe('WhiteboardCanvasService', () => {
  let spectator: SpectatorService<WhiteboardCanvasService>;

  const createService = createServiceFactory({
    service: WhiteboardCanvasService,
  });

  beforeEach(() => {
    spectator = createService();
  });

  it('should get empty canvas', () => {
    const emptyCanvas = spectator.service.getEmptyWhiteboardCanvas();
    expect(emptyCanvas).toBeTruthy();
  });
});
