import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Feature } from '../../../canvas-meta-model/feature';

@Component({
  selector: 'app-merge-into-tree',
  templateUrl: './merge-into-tree.component.html',
  styleUrls: ['./merge-into-tree.component.css'],
})
export class MergeIntoTreeComponent {
  @Input() expertModelId!: string;
  @Input() features!: { [id: string]: Feature };

  @Output() openTrace = new EventEmitter<string>();
  @Output() openDependencies = new EventEmitter<string>();
  @Output() updateFeature = new EventEmitter<string>();
  @Output() deleteFeature = new EventEmitter<string>();

  @Input() openPanels!: string[];

  panelChange(id: string, state: boolean): void {
    if (state && !this.openPanels.includes(id)) {
      this.openPanels.push(id);
    } else if (!state && this.openPanels.includes(id)) {
      this.openPanels.splice(this.openPanels.indexOf(id), 1);
    }
  }

  asList(map: { [id: string]: Feature }): Feature[] {
    return Object.values(map);
  }
}
