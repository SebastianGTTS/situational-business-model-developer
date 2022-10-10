import { Injectable } from '@angular/core';
import { WhiteboardCanvas } from './whiteboard';
import { fabric } from 'fabric';

interface CanvasObjectData {
  interactive: boolean;
}

@Injectable()
export class WhiteboardCanvasService {
  /**
   * Get a fabric whiteboard canvas instance that is read only
   *
   * @param canvasElement the canvas element to which to connect
   * @param whiteboardCanvas the whiteboard canvas to load
   * @return the read only fabric canvas instance
   */
  async getReadonlyWhiteboardCanvas(
    canvasElement: HTMLCanvasElement,
    whiteboardCanvas: WhiteboardCanvas
  ): Promise<fabric.Canvas> {
    const canvas = new fabric.Canvas(canvasElement);
    canvas.interactive = false;
    canvas.selection = false;
    await new Promise((resolve) =>
      canvas.loadFromJSON(whiteboardCanvas, resolve)
    );
    canvas.forEachObject((object) =>
      object.set({
        selectable: false,
        lockMovementX: true,
        lockMovementY: true,
        lockScalingX: true,
        lockScalingY: true,
        lockUniScaling: true,
        lockRotation: true,
        hoverCursor: 'default',
        moveCursor: 'default',
      })
    );
    return canvas;
  }

  /**
   * Get a fabric whiteboard canvas instance
   *
   * @param canvasElement the canvas element to which to connect
   * @param whiteboardCanvas the whiteboard canvas to load
   * @return the fabric canvas instance
   */
  async getWhiteboardCanvas(
    canvasElement: HTMLCanvasElement,
    whiteboardCanvas: WhiteboardCanvas
  ): Promise<fabric.Canvas> {
    const canvas = new fabric.Canvas(canvasElement);
    await new Promise((resolve) =>
      canvas.loadFromJSON(whiteboardCanvas, resolve)
    );
    canvas.forEachObject((object) => {
      const data: CanvasObjectData | undefined = object.get('data');
      if (data != null) {
        if (!data.interactive) {
          object.set({
            selectable: false,
            lockMovementX: true,
            lockMovementY: true,
            lockScalingX: true,
            lockScalingY: true,
            lockUniScaling: true,
            lockRotation: true,
            hoverCursor: 'default',
            moveCursor: 'default',
          });
        }
      }
    });
    return canvas;
  }

  /**
   * Get the whiteboard canvas serialization
   *
   * @param canvas the canvas
   * @return the serialization as a json string
   */
  getWhiteboardCanvasSerialization(canvas: fabric.Canvas): string {
    canvas.fire('save');
    return JSON.stringify(canvas.toJSON(['data']));
  }

  /**
   * Creates an empty whiteboard canvas.
   */
  getEmptyWhiteboardCanvas(): WhiteboardCanvas {
    const canvas = new fabric.Canvas(null);
    const serialization = JSON.stringify(canvas);
    canvas.dispose();
    return serialization;
  }

  /**
   * Sets all elements in a whiteboard canvas to read only
   *
   * @param whiteboardCanvas the canvas to make read only
   * @return the canvas with all elements marked as readonly
   */
  async setReadOnly(
    whiteboardCanvas: WhiteboardCanvas
  ): Promise<WhiteboardCanvas> {
    const canvas = new fabric.Canvas(null);
    await new Promise((resolve) =>
      canvas.loadFromJSON(whiteboardCanvas, resolve)
    );
    const data: CanvasObjectData = {
      interactive: false,
    };
    canvas.forEachObject((object) => {
      object.set('data', data);
    });
    const serialization = this.getWhiteboardCanvasSerialization(canvas);
    canvas.dispose();
    return serialization;
  }

  /**
   * Reload a canvas
   *
   * @param canvas
   * @param whiteboardCanvas
   */
  async reload(
    canvas: fabric.Canvas,
    whiteboardCanvas: WhiteboardCanvas
  ): Promise<void> {
    await new Promise((resolve) =>
      canvas.loadFromJSON(whiteboardCanvas, resolve)
    );
  }
}
