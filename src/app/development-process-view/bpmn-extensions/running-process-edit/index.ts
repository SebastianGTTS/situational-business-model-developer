import ContextPadModule from 'diagram-js/lib/features/context-pad';
import RunningProcessContextPadProvider from './RunningProcessContextPadProvider';

export default {
  __depends__: [ContextPadModule],
  __init__: ['contextPadProvider'],
  contextPadProvider: ['type', RunningProcessContextPadProvider],
};
