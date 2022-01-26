export interface ColorDefinition {
  name: string;
  value: string | undefined;
  darker: string | undefined;
}

export const noColor: ColorDefinition = {
  name: 'no color',
  value: undefined,
  darker: undefined,
};

export const colors: ColorDefinition[] = [
  {
    name: 'black',
    value: '#000000',
    darker: '#000000',
  },
  {
    name: 'gray',
    value: '#757575',
    darker: '#363636',
  },
  {
    name: 'white',
    value: '#FFFFFF',
    darker: '#BFBFBF',
  },
  {
    name: 'yellow',
    value: '#FFFFA5',
    darker: '#E6E695',
  },
  {
    name: 'blue',
    value: '#58A7E0',
    darker: '#3F78A1',
  },
  {
    name: 'red',
    value: '#E02E2B',
    darker: '#A1211F',
  },
  {
    name: 'green',
    value: '#58E058',
    darker: '#3FA13F',
  },
];
