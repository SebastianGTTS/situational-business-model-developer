import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanDeactivate,
  RouterStateSnapshot,
} from '@angular/router';
import { DiagramComponentInterface } from './diagram-component-interface';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmLeaveModalComponent } from '../confirm-leave-modal/confirm-leave-modal.component';

@Injectable({
  providedIn: 'root',
})
export class DiagramChangeGuard
  implements CanDeactivate<DiagramComponentInterface>
{
  constructor(private modalService: NgbModal) {}

  async canDeactivate(
    component: DiagramComponentInterface,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot
  ): Promise<boolean> {
    const changed = await component.diagramChanged();
    if (changed) {
      const modal = this.modalService.open(ConfirmLeaveModalComponent, {
        size: 'lg',
      });
      try {
        const result = await modal.result;
        if (result) {
          await component.saveDiagram();
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
