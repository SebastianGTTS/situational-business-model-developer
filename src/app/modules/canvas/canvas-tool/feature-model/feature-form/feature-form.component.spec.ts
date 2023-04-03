import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { FeatureFormComponent } from './feature-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { byText } from '@ngneat/spectator';

describe('FeatureFormComponent', () => {
  let spectator: Spectator<FeatureFormComponent>;
  const createComponent = createComponentFactory({
    component: FeatureFormComponent,
    imports: [ReactiveFormsModule],
  });

  beforeEach(
    () =>
      (spectator = createComponent({
        props: {
          featureList: [
            {
              id: 'test-feature-a',
              levelname: '- Test Feature A',
            },
            {
              id: 'test-feature-b',
              levelname: '- Test Feature B',
            },
            {
              id: 'test-feature-c',
              levelname: '- Test Feature C',
            },
          ],
        },
      }))
  );

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should have first feature preselected as subfeature', () => {
    const subfeatureInput = spectator.query('#subfeatureOf');
    expect(subfeatureInput).toHaveSelectedOptions(
      spectator.query(byText('- Test Feature A')) as HTMLOptionElement
    );
  });
});
