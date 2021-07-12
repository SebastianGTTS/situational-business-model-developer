import { DevelopmentMethod } from './development-method';

describe('DevelopmentMethod', () => {
  let developmentMethod: DevelopmentMethod;

  beforeEach(() => {
    developmentMethod = new DevelopmentMethod({name: 'Test Development Method'});
  });

  it('should be created', () => expect(developmentMethod).toBeTruthy());
});
