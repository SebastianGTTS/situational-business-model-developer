import CoreModule from 'bpmn-js/lib/core';
import RunningProcessViewRenderer from './RunningProcessViewRenderer';

export default {
  __depends__: [CoreModule],
  __init__: ['runningProcessViewRenderer'],
  runningProcessViewRenderer: ['type', RunningProcessViewRenderer]
};
