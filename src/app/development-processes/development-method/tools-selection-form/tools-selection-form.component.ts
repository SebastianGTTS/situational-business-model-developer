import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { ToolService } from '../../../development-process-registry/method-elements/tool/tool.service';
import {
  Tool,
  ToolEntry,
} from '../../../development-process-registry/method-elements/tool/tool';
import { ModuleService } from '../../../development-process-registry/module-api/module.service';
import {
  ELEMENT_CONSTRUCTOR,
  GroupsFormService,
} from '../../shared/groups-form.service';
import { Groups } from '../../../development-process-registry/development-method/groups';
import { Updatable, UPDATABLE } from '../../../shared/updatable';
import { GroupsFormComponent } from '../groups-form/groups-form.component';

@Component({
  selector: 'app-tools-selection-form',
  templateUrl: './tools-selection-form.component.html',
  styleUrls: ['./tools-selection-form.component.css'],
  providers: [
    GroupsFormService,
    { provide: ELEMENT_CONSTRUCTOR, useValue: Tool },
    {
      provide: UPDATABLE,
      useExisting: ToolsSelectionFormComponent,
    },
  ],
})
export class ToolsSelectionFormComponent implements OnInit, Updatable {
  @Input() idPrefix?: string;
  @Input() tools!: Groups<Tool>;

  @Output() submitToolsForm = new EventEmitter<Groups<Tool>>();

  methodElements: ToolEntry[] = [];
  listNames: string[] = [];

  @ViewChild(GroupsFormComponent) groupsFormComponent!: Updatable;

  constructor(
    private moduleService: ModuleService,
    private toolService: ToolService
  ) {}

  ngOnInit(): void {
    void this.loadTools();
  }

  update(): void {
    this.groupsFormComponent.update();
  }

  private async loadTools(): Promise<void> {
    const tools = await this.toolService.getList();
    this.methodElements = tools.concat(
      this.moduleService.modules.map((module) => {
        return new Tool(undefined, {
          name: module.name,
          list: module.list,
        }).toDb();
      })
    );
    this.listNames = [
      ...new Set(
        this.methodElements
          .map((element) => element.list)
          .concat(this.moduleService.modules.map((module) => module.list))
      ),
    ];
  }
}
