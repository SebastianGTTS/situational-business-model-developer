import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MultipleSelection } from '../../development-process-registry/development-method/multiple-selection';
import { GroupSelection } from '../../development-process-registry/bm-process/decision';
import { FormGroup } from '@angular/forms';
import { Tool } from '../../development-process-registry/method-elements/tool/tool';
import { ToolService } from '../../development-process-registry/method-elements/tool/tool.service';

@Component({
  selector: 'app-tools-group-info',
  templateUrl: './tools-group-info.component.html',
  styleUrls: ['./tools-group-info.component.css'],
})
export class ToolsGroupInfoComponent implements OnInit {
  @Input() groups: MultipleSelection<Tool>[][];
  @Input() selection: GroupSelection<Tool>;

  @Output() submitGroupsForm = new EventEmitter<FormGroup>();

  methodElements: Tool[] = [];

  constructor(private toolService: ToolService) {}

  ngOnInit() {
    void this.loadMethodElements();
  }

  private async loadMethodElements(): Promise<void> {
    this.methodElements = await this.toolService.getList();
  }
}
