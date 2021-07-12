import { ConfirmLeaveModalComponent } from './confirm-leave-modal.component';
import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

describe('ConfirmLeaveModalComponent', () => {
  let spectator: Spectator<ConfirmLeaveModalComponent>;
  const createComponent = createComponentFactory({
    component: ConfirmLeaveModalComponent,
    declarations: [],
    mocks: [NgbActiveModal],
  });

  beforeEach(() => spectator = createComponent());

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
