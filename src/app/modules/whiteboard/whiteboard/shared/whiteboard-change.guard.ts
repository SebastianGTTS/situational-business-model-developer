import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { WhiteboardEditComponent } from './whiteboard-edit-component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmLeaveWhiteboardModalComponent } from '../confirm-leave-whiteboard-modal/confirm-leave-whiteboard-modal.component';

@Injectable({
  providedIn: 'root',
})
export class WhiteboardChangeGuard
  implements CanDeactivate<WhiteboardEditComponent>
{
  constructor(private modalService: NgbModal) {}

  async canDeactivate(component: WhiteboardEditComponent): Promise<boolean> {
    const changed = await component.whiteboardChanged();
    if (changed) {
      const modal = this.modalService.open(
        ConfirmLeaveWhiteboardModalComponent,
        {
          size: 'lg',
        }
      );
      try {
        const result = await modal.result;
        if (result) {
          await component.saveWhiteboard();
        }
        return true;
      } catch {
        return false;
      }
    } else {
      return true;
    }
  }
}
