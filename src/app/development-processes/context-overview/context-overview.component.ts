import { Component, Input } from '@angular/core';
import { Domain } from '../../development-process-registry/knowledge/domain';
import { SituationalFactor } from '../../development-process-registry/method-elements/situational-factor/situational-factor';
import { Selection } from '../../development-process-registry/development-method/selection';

@Component({
  selector: 'app-context-overview',
  templateUrl: './context-overview.component.html',
  styleUrls: ['./context-overview.component.scss'],
})
export class ContextOverviewComponent {
  @Input() domains!: Domain[];
  @Input() situationalFactors!: Selection<SituationalFactor>[];
}
