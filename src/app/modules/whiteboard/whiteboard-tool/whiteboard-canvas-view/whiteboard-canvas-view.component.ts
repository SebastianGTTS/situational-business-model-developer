import { Component, OnChanges, SimpleChanges } from '@angular/core';
import { fabric } from 'fabric';
import { WhiteboardCanvasViewBaseComponent } from './whiteboard-canvas-view-base.component';
import { WhiteboardCanvasService } from '../../whiteboard-meta-artifact/whiteboard-canvas.service';

@Component({
  selector: 'app-whiteboard-canvas-view',
  templateUrl: './whiteboard-canvas-view.component.html',
  styleUrls: ['./whiteboard-canvas-view.component.css'],
})
export class WhiteboardCanvasViewComponent
  extends WhiteboardCanvasViewBaseComponent
  implements OnChanges
{
  constructor(whiteboardCanvasService: WhiteboardCanvasService) {
    super(whiteboardCanvasService);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.whiteboardCanvas && this.canvas != null) {
      void this.whiteboardCanvasService.reload(
        this.canvas,
        changes.whiteboardCanvas.currentValue
      );
    }
  }

  protected mouseMove(options: fabric.IEvent<MouseEvent>): void {
    if (options.absolutePointer == null) {
      return;
    }
    if (this.moving && this.lastMousePosition != null && this.canvas != null) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const viewport = this.canvas.viewportTransform!;
      viewport[4] += options.absolutePointer.x - this.lastMousePosition.x;
      viewport[5] += options.absolutePointer.y - this.lastMousePosition.y;
      this.canvas.setViewportTransform(viewport);
    }
  }

  protected mouseDown(options: fabric.IEvent<MouseEvent>): void {
    if (options.absolutePointer != null) {
      this.lastMousePosition = options.absolutePointer;
      this.moving = true;
    }
  }

  protected mouseUp(): void {
    this.moving = false;
  }
}
