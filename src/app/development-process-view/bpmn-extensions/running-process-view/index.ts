import CoreModule from 'bpmn-js/lib/core';
import ChangeSupport from 'diagram-js/lib/features/change-support';
import RunningProcessViewRenderer from './RunningProcessViewRenderer';

export default {
  __depends__: [CoreModule, ChangeSupport],
  __init__: ['runningProcessViewRenderer'],
  runningProcessViewRenderer: ['type', RunningProcessViewRenderer],
};
