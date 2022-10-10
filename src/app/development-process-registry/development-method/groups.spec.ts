import { Groups, GroupsEntry } from './groups';
import { Tool, ToolEntry } from '../method-elements/tool/tool';

describe('Groups', () => {
  it('should create', () => {
    const groups = new Groups(undefined, {}, Tool);
    expect(groups).toBeTruthy();
    expect(groups.allowNone).toBe(false);
    expect(groups.groups).toStrictEqual([]);
    expect(groups.defaultGroup).toBeUndefined();
    expect(groups.defaultGroupIndex).toBeUndefined();
  });

  it('should export entry', () => {
    const groups = new Groups(undefined, {}, Tool);
    const entry = groups.toDb();
    expect(entry).toBeTruthy();
    expect(entry.allowNone).toBe(false);
    expect(entry.groups).toStrictEqual([]);
    expect(entry.defaultGroup).toBeUndefined();
  });

  it('should create from entry', () => {
    const entry: GroupsEntry<ToolEntry> = {
      groups: [
        {
          items: [],
        },
      ],
      allowNone: true,
    };
    const group = new Groups(entry, undefined, Tool);
    expect(group).toBeTruthy();
    expect(group.allowNone).toBe(true);
    expect(group.groups).toBeTruthy();
    expect(group.groups).toHaveLength(1);
    expect(group.defaultGroup).toBeUndefined();
  });

  it('should create from entry default group', () => {
    const entry: GroupsEntry<ToolEntry> = {
      groups: [
        {
          items: [],
        },
      ],
      allowNone: false,
      defaultGroup: 0,
    };
    const group = new Groups(entry, undefined, Tool);
    expect(group).toBeTruthy();
    expect(group.allowNone).toBe(false);
    expect(group.groups).toBeTruthy();
    expect(group.groups).toHaveLength(1);
    expect(group.defaultGroup).toBe(group.groups[0]);
  });

  it('should not create without entry or init', () => {
    expect(() => new Groups(undefined, undefined, Tool)).toThrow();
  });

  describe('equals', () => {
    let groups: Groups<Tool>;

    beforeAll(() => (groups = new Groups(undefined, {}, Tool)));

    it('not undefined', () => {
      expect(groups.equals(undefined)).toBe(false);
    });

    it('itself', () => {
      expect(groups.equals(groups)).toBe(true);
    });

    it('equal group', () => {
      expect(
        groups.equals(
          new Groups<Tool>(
            undefined,
            {
              groups: undefined,
              defaultGroup: undefined,
              allowNone: false,
            },
            Tool
          )
        )
      ).toBe(true);
    });

    it('not different number of groups', () => {
      expect(
        groups.equals(
          new Groups<Tool>(
            undefined,
            {
              groups: [{}],
            },
            Tool
          )
        )
      ).toBe(false);
    });

    it('not different default group', () => {
      const defaultGroup = {};
      const otherGroups = new Groups(
        undefined,
        {
          groups: [defaultGroup],
        },
        Tool
      );
      expect(
        otherGroups.equals(
          new Groups<Tool>(
            undefined,
            {
              groups: [defaultGroup],
              defaultGroup: defaultGroup,
            },
            Tool
          )
        )
      ).toBe(false);
    });

    it('not group that allows none', () => {
      expect(
        groups.equals(
          new Groups<Tool>(
            undefined,
            {
              allowNone: true,
            },
            Tool
          )
        )
      ).toBe(false);
    });
  });
});
