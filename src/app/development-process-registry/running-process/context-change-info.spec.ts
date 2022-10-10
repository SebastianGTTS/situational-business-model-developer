import { ContextChangeInfo } from './context-change-info';

describe('ContextChangeInfo', () => {
  it('should create', () => {
    const contextChange = new ContextChangeInfo(undefined, {
      comment: 'Test comment',
      suggestedDomains: [],
      suggestedSituationalFactors: [],
      oldDomains: [],
      oldSituationalFactors: [],
    });
    expect(contextChange.comment).toBe('Test comment');
    expect(contextChange).toBeTruthy();
  });
});
