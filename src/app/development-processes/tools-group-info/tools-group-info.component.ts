import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {
  Tool,
  ToolEntry,
} from '../../development-process-registry/method-elements/tool/tool';
import { ToolService } from '../../development-process-registry/method-elements/tool/tool.service';
import { GroupDecision } from '../../development-process-registry/bm-process/group-decision';
import {
  ELEMENT_CONSTRUCTOR,
  GroupDecisionFormService,
} from '../shared/group-decision-form.service';
import { MethodElementGroupInfoComponent } from '../method-element-group-info/method-element-group-info.component';
import { UPDATABLE, Updatable } from '../../shared/updatable';

@Component({
  selector: 'app-tools-group-info',
  templateUrl: './tools-group-info.component.html',
  styleUrls: ['./tools-group-info.component.css'],
  providers: [
    GroupDecisionFormService,
    { provide: ELEMENT_CONSTRUCTOR, useValue: Tool },
    { provide: UPDATABLE, useExisting: ToolsGroupInfoComponent },
  ],
})
export class ToolsGroupInfoComponent implements OnInit, Updatable {
  @Input() groupDecision!: GroupDecision<Tool>;

  @Output() submitGroupsForm = new EventEmitter<GroupDecision<Tool>>();

  methodElements: ToolEntry[] = [];

  @ViewChild(MethodElementGroupInfoComponent)
  methodElementGroupInfoComponent!: Updatable;

  constructor(private toolService: ToolService) {}

  ngOnInit(): void {
    void this.loadMethodElements();
  }

  private async loadMethodElements(): Promise<void> {
    this.methodElements = await this.toolService.getList();
  }

  update(): void {
    this.methodElementGroupInfoComponent.update();
  }
}
