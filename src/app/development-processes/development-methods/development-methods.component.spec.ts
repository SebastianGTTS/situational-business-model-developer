import { DevelopmentMethodsComponent } from './development-methods.component';
import { createRoutingFactory, Spectator } from '@ngneat/spectator';
import { MockComponent } from 'ng-mocks';
import { AuthorInfoComponent } from '../../shared/author-info/author-info.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DevelopmentMethodService } from '../../development-process-registry/development-method/development-method.service';

describe('DevelopmentMethodsComponent', () => {
  let spectator: Spectator<DevelopmentMethodsComponent>;
  const createComponent = createRoutingFactory({
    component: DevelopmentMethodsComponent,
    declarations: [
      MockComponent(AuthorInfoComponent),
    ],
    detectChanges: false,
    imports: [ReactiveFormsModule],
    mocks: [DevelopmentMethodService],
  });

  beforeEach(() => {
    spectator = createComponent();
    spectator.inject(DevelopmentMethodService).getDevelopmentMethodList.and.returnValue(Promise.resolve([]));
  });

  it('should create', () => {
    spectator.detectChanges();
    expect(spectator.component).toBeTruthy();
  });
});
