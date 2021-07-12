import buildingBlocks from './building-blocks.json';
import canvasDefinitions from './canvas-definitions.json';
import domains from './domains.json';
import companyModels from './feature-models/company-models.json';
import expertModels from './feature-models/expert-models.json';
import artifact from './method-elements/artifact.json';
import situationalFactorDefinition from './method-elements/situational-factor-definition.json';
import stakeholders from './method-elements/stakeholders.json';
import tools from './method-elements/tools.json';
import types from './method-elements/types.json';
import methods from './methods.json';
import patterns from './patterns.json';
import runningMethods from './running-methods.json';

export default [
  ...buildingBlocks,
  ...artifact,
  ...situationalFactorDefinition,
  ...stakeholders,
  ...tools,
  ...types,
  ...patterns,
  ...methods,
  ...companyModels,
  ...expertModels,
  ...canvasDefinitions,
  ...domains,
  ...runningMethods
];
