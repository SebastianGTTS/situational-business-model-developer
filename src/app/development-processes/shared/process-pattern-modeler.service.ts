import { Injectable } from '@angular/core';
import BpmnModeler from 'bpmn-js/lib/Modeler';
import bmProcessPatterns from '../bpmn-extensions/bm-process-patterns';
import lintModule from 'bpmn-js-bpmnlint';
import bmdl from '../../../assets/bpmn_bmdl.json';
import { Type } from '../../development-process-registry/method-elements/type/type';
import { BpmnViewerService } from '../../development-process-view/shared/bpmn-viewer.service';
import { BpmnModdle } from 'bpmn-js';
import { ProcessPatternLinterService } from '../../development-process-registry/process-pattern/process-pattern-linter.service';

@Injectable({
  providedIn: 'root',
})
export class ProcessPatternModelerService extends BpmnViewerService {
  constructor(
    private processPatternLinterService: ProcessPatternLinterService
  ) {
    super();
  }

  /**
   * Get a BpmnModeler with customizations to support the development of business model process patterns
   *
   * @returns a bpmnModeler
   */
  getBpmnModeler(): BpmnModeler {
    return new BpmnModeler({
      linting: {
        bpmnlint: this.processPatternLinterService.getBpmnLinter(),
      },
      additionalModules: [bmProcessPatterns, lintModule],
      moddleExtensions: {
        bmdl,
      },
    });
  }

  /**
   * Set types of an activity to specify which methods can be used
   *
   * @param modeler the modeler
   * @param activityId the id of the activity
   * @param inherit whether the types should be inherited
   * @param neededTypes the needed types of the method
   * @param forbiddenTypes the forbidden types of the method
   */
  setTypesOfActivity(
    modeler: BpmnModeler,
    activityId: string,
    inherit: boolean,
    neededTypes: { list: string; element: Type }[],
    forbiddenTypes: { list: string; element: Type }[]
  ): void {
    const moddle = modeler.get('moddle');
    const modeling = modeler.get('modeling');
    const elementRegistry = modeler.get('elementRegistry');
    const activity = elementRegistry.get(activityId);
    if (activity != null) {
      modeling.updateProperties(activity, {
        inherit,
        neededType: neededTypes.map((element) => mapTypes(moddle, element)),
        forbiddenType: forbiddenTypes.map((element) =>
          mapTypes(moddle, element)
        ),
      });
    }
  }
}

function mapTypes(
  moddle: BpmnModdle,
  element: { list: string; element?: Type }
): unknown {
  return moddle.create('bmdl:Type', {
    list: element.list,
    element: element.element
      ? moddle.create('bmdl:MethodElement', {
          _id: element.element._id,
          name: element.element.name,
        })
      : undefined,
  });
}
