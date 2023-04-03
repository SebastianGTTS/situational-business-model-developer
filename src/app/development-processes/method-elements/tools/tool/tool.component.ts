import { Component, QueryList, ViewChildren } from '@angular/core';
import {
  Tool,
  ToolInit,
} from '../../../../development-process-registry/method-elements/tool/tool';
import { ToolService } from '../../../../development-process-registry/method-elements/tool/tool.service';
import { MethodElementLoaderService } from '../../../shared/method-element-loader.service';
import { MethodElementService } from '../../../../development-process-registry/method-elements/method-element.service';
import { IconInit } from 'src/app/model/icon';
import { UPDATABLE, Updatable } from 'src/app/shared/updatable';

@Component({
  selector: 'app-tool',
  templateUrl: './tool.component.html',
  styleUrls: ['./tool.component.css'],
  providers: [
    MethodElementLoaderService,
    { provide: MethodElementService, useExisting: ToolService },
    { provide: UPDATABLE, useExisting: ToolComponent },
  ],
})
export class ToolComponent implements Updatable {
  @ViewChildren(UPDATABLE) updatable!: QueryList<Updatable>;

  constructor(
    private toolLoaderService: MethodElementLoaderService<Tool, ToolInit>,
    private toolService: ToolService
  ) {}

  async updateValue(value: ToolInit): Promise<void> {
    if (this.tool != null) {
      await this.toolService.update(this.tool._id, value);
    }
  }

  async updateIcon(icon: IconInit): Promise<void> {
    if (this.tool != null) {
      await this.toolService.updateIcon(this.tool._id, icon);
    }
  }

  update(): void {
    for (const updatable of this.updatable) {
      updatable.update();
    }
  }

  get tool(): Tool | undefined {
    return this.toolLoaderService.methodElement;
  }

  get listNames(): string[] {
    return this.toolLoaderService.listNames;
  }
}
