import { DevelopmentMethodComponent } from './development-method.component';
import { createRoutingFactory, Spectator } from '@ngneat/spectator';
import { MockComponent } from 'ng-mocks';
import { AuthorFormComponent } from '../../shared/author-form/author-form.component';
import { DescriptionFormComponent } from '../../shared/description-form/description-form.component';
import { DevelopmentMethodService } from '../../development-process-registry/development-method/development-method.service';
import { DevelopmentMethod } from '../../development-process-registry/development-method/development-method';

describe('DevelopmentMethodComponent', () => {
  let spectator: Spectator<DevelopmentMethodComponent>;
  const createComponent = createRoutingFactory({
    component: DevelopmentMethodComponent,
    declarations: [
      MockComponent(AuthorFormComponent),
      MockComponent(DescriptionFormComponent),
    ],
    detectChanges: false,
    mocks: [DevelopmentMethodService],
  });

  beforeEach(() => {
    spectator = createComponent();
    spectator.inject(DevelopmentMethodService).getDevelopmentMethod.and.returnValue(Promise.resolve(new DevelopmentMethod({name: 'Test'})));
  });

  it('should create', () => {
    spectator.detectChanges();
    expect(spectator.component).toBeTruthy();
  });
});
