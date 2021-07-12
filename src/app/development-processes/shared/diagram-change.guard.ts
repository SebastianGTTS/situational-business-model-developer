import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot } from '@angular/router';
import { DiagramComponentInterface } from './diagram-component-interface';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmLeaveModalComponent } from '../confirm-leave-modal/confirm-leave-modal.component';

@Injectable({
  providedIn: 'root'
})
export class DiagramChangeGuard implements CanDeactivate<DiagramComponentInterface> {

  constructor(
    private modalService: NgbModal,
  ) {
  }

  canDeactivate(
    component: DiagramComponentInterface, currentRoute: ActivatedRouteSnapshot, currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot,
  ): Promise<boolean> {
    return component.diagramChanged().then((changed) => {
      if (changed) {
        const modal = this.modalService.open(ConfirmLeaveModalComponent, {size: 'lg'});
        return modal.result.then((result) => {
          if (result) {
            return component.saveDiagram().then(() => true);
          } else {
            return true;
          }
        }).catch(() => false);
      } else {
        return true;
      }
    });
  }

}
