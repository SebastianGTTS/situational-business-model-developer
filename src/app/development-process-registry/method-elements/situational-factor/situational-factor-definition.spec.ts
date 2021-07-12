import { SituationalFactorDefinition } from './situational-factor-definition';

describe('SituationalFactorDefinition', () => {
  let situationalFactorDefinition: SituationalFactorDefinition;

  beforeEach(() => {
    situationalFactorDefinition = new SituationalFactorDefinition({name: 'Test SituationalFactorDefinition'});
  });

  it('should be created', () => expect(situationalFactorDefinition).toBeTruthy());
});
