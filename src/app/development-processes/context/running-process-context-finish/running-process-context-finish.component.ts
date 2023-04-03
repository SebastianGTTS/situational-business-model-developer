import { Component, Input } from '@angular/core';
import { ContextChangeRunningProcess } from '../../../development-process-registry/running-process/running-full-process';

@Component({
  selector: 'app-running-process-context-finish',
  templateUrl: './running-process-context-finish.component.html',
  styleUrls: ['./running-process-context-finish.component.css'],
})
export class RunningProcessContextFinishComponent {
  @Input() runningProcess!: ContextChangeRunningProcess;
}
