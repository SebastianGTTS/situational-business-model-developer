import { Component } from '@angular/core';
import { Tool } from '../../development-process-registry/method-elements/tool/tool';
import { ToolService } from '../../development-process-registry/method-elements/tool/tool.service';
import { MethodElementLoaderService } from '../shared/method-element-loader.service';
import { MethodElementService } from '../../development-process-registry/method-elements/method-element.service';

@Component({
  selector: 'app-tool',
  templateUrl: './tool.component.html',
  styleUrls: ['./tool.component.css'],
  providers: [
    MethodElementLoaderService,
    { provide: MethodElementService, useExisting: ToolService },
  ],
})
export class ToolComponent {
  constructor(
    private toolLoaderService: MethodElementLoaderService<Tool>,
    private toolService: ToolService
  ) {}

  async updateValue(value: any) {
    await this.toolService.update(this.tool._id, value);
  }

  get tool() {
    return this.toolLoaderService.methodElement;
  }

  get listNames() {
    return this.toolLoaderService.listNames;
  }
}
