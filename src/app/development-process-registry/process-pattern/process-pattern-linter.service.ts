import { Injectable } from '@angular/core';
import { DevelopmentProcessRegistryModule } from '../development-process-registry.module';
import Linter from 'bpmnlint/lib/linter';
import StaticResolver from 'bpmnlint/lib/resolver/static-resolver';
import endEventRequired from 'bpmnlint/rules/end-event-required';
import fakeJoin from 'bpmnlint/rules/fake-join';
import superfluousGateway from 'bpmnlint/rules/superfluous-gateway';
import noDisconnected from 'bpmnlint/rules/no-disconnected';
import noDuplicateSequenceFlows from 'bpmnlint/rules/no-duplicate-sequence-flows';
import noImplicitSplit from 'bpmnlint/rules/no-implicit-split';
import singleBlankStartEvent from 'bpmnlint/rules/single-blank-start-event';
import startEventRequired from 'bpmnlint/rules/start-event-required';
import noEmptyTypes from './linting-rules/no-empty-types';
import startReachable from './linting-rules/start-reachable';
import endReachable from './linting-rules/end-reachable';

@Injectable({
  providedIn: DevelopmentProcessRegistryModule,
})
export class ProcessPatternLinterService {
  /**
   * Get a BPMN Linter with default rules for Process Patterns
   */
  getBpmnLinter(): Linter {
    return new Linter({
      config: {
        rules: {
          'end-event-required': 'error',
          'fake-join': 'error',
          'superfluous-gateway': 'warn',
          'no-disconnected': 'warn',
          'no-duplicate-sequence-flows': 'error',
          'no-implicit-split': 'error',
          'single-blank-start-event': 'error',
          'start-event-required': 'error',
          'sbmd/no-empty-types': 'error',
          'sbmd/start-reachable': 'error',
          'sbmd/end-reachable': 'error',
        },
      },
      resolver: new StaticResolver({
        'rule:bpmnlint/end-event-required': endEventRequired,
        'rule:bpmnlint/fake-join': fakeJoin,
        'rule:bpmnlint/superfluous-gateway': superfluousGateway,
        'rule:bpmnlint/no-disconnected': noDisconnected,
        'rule:bpmnlint/no-duplicate-sequence-flows': noDuplicateSequenceFlows,
        'rule:bpmnlint/no-implicit-split': noImplicitSplit,
        'rule:bpmnlint/single-blank-start-event': singleBlankStartEvent,
        'rule:bpmnlint/start-event-required': startEventRequired,
        'rule:bpmnlint-plugin-sbmd/no-empty-types': noEmptyTypes,
        'rule:bpmnlint-plugin-sbmd/start-reachable': startReachable,
        'rule:bpmnlint-plugin-sbmd/end-reachable': endReachable,
      }),
    });
  }
}
