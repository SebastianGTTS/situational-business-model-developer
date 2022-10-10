import { Group } from './group';
import { Tool } from '../method-elements/tool/tool';

describe('Group', () => {
  it('should create', () => {
    const group = new Group(undefined, {}, Tool);
    expect(group).toBeTruthy();
    expect(group.items).toStrictEqual([]);
  });

  it('should have items', () => {
    const group = new Group(
      undefined,
      {
        items: [
          {
            list: 'Test',
          },
        ],
      },
      Tool
    );
    expect(group).toBeTruthy();
    expect(group.items).toHaveLength(1);
    expect(group.items[0]).toBeTruthy();
    const item = group.items[0];
    expect(item.list).toBe('Test');
  });
});
