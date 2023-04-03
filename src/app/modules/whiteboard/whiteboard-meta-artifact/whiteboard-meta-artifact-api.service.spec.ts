import { WhiteboardMetaArtifactApiService } from './whiteboard-meta-artifact-api.service';
import {
  createServiceFactory,
  SpectatorService,
  SpyObject,
} from '@ngneat/spectator/jest';
import { WhiteboardInstanceService } from './whiteboard-instance.service';
import {
  WhiteboardInstance,
  WhiteboardInstanceEntry,
} from './whiteboard-instance';
import { ArtifactDataReference } from '../../../development-process-registry/running-process/artifact-data';
import { ReactiveFormsModule } from '@angular/forms';

describe('WhiteboardMetaArtifactApiService', () => {
  let spectator: SpectatorService<WhiteboardMetaArtifactApiService>;
  let whiteboardInstanceService: SpyObject<WhiteboardInstanceService>;

  let testInstanceDb: WhiteboardInstanceEntry;
  let reference: ArtifactDataReference;

  const createService = createServiceFactory({
    service: WhiteboardMetaArtifactApiService,
    mocks: [WhiteboardInstanceService],
    imports: [ReactiveFormsModule],
  });

  beforeEach(() => {
    spectator = createService();
    whiteboardInstanceService = spectator.inject(WhiteboardInstanceService);
    testInstanceDb = new WhiteboardInstance(undefined, {
      name: 'Test Instance',
      whiteboard: 'Test Whiteboard Serialization',
    }).toDb();
    reference = {
      id: testInstanceDb._id,
      type: testInstanceDb.type,
    };
    whiteboardInstanceService.get.andReturn(
      new WhiteboardInstance(testInstanceDb, undefined)
    );
  });

  function hasCorrectlyCalledGet(): void {
    expect(whiteboardInstanceService.get).toHaveBeenCalled();
    expect(whiteboardInstanceService.get.mock.calls).toHaveLength(1);
    expect(whiteboardInstanceService.get.mock.calls[0][0]).toBe(reference.id);
  }

  it('should copy instances', async () => {
    const copiedReference = await spectator.service.copy(reference);
    hasCorrectlyCalledGet();
    expect(whiteboardInstanceService.add).toHaveBeenCalled();
    expect(whiteboardInstanceService.add.mock.calls).toHaveLength(1);
    const copiedInstance: WhiteboardInstance =
      whiteboardInstanceService.add.mock.calls[0][0];
    expect(copiedInstance._id).toBe(copiedReference.id);
    expect(copiedInstance.type).toBe(copiedReference.type);
    expect(copiedInstance._id).not.toBe(testInstanceDb._id);
  });

  it('should get the name', async () => {
    const name = await spectator.service.getName(reference);
    hasCorrectlyCalledGet();
    expect(name).toBe(testInstanceDb.name);
  });

  it('should remove', async () => {
    await spectator.service.remove(reference);
    expect(whiteboardInstanceService.delete).toHaveBeenCalled();
    expect(whiteboardInstanceService.delete.mock.calls).toHaveLength(1);
    expect(whiteboardInstanceService.delete.mock.calls[0][0]).toBe(
      reference.id
    );
  });
});
