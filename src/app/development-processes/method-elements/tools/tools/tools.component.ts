import { Component, OnInit } from '@angular/core';
import { ToolService } from '../../../../development-process-registry/method-elements/tool/tool.service';
import { ModuleService } from '../../../../development-process-registry/module-api/module.service';
import { Module } from '../../../../development-process-registry/module-api/module';
import {
  ToolEntry,
  ToolInit,
} from '../../../../development-process-registry/method-elements/tool/tool';
import {
  defaultSearchFunction,
  SEARCH_FUNCTION,
  SearchService,
} from '../../../../shared/search.service';
import { ELEMENT_SERVICE, ListService } from '../../../../shared/list.service';
import { MethodElementService } from '../../../../development-process-registry/method-elements/method-element.service';
import { ListFilterService } from '../../../../shared/list-filter.service';
import { FilterService } from '../../../../shared/filter.service';

@Component({
  selector: 'app-tools',
  templateUrl: './tools.component.html',
  styleUrls: ['./tools.component.css'],
  providers: [
    FilterService,
    SearchService,
    { provide: SEARCH_FUNCTION, useValue: defaultSearchFunction },
    ListFilterService,
    { provide: ListService, useExisting: ListFilterService },
    { provide: ELEMENT_SERVICE, useExisting: ToolService },
    { provide: MethodElementService, useExisting: ToolService },
  ],
})
export class ToolsComponent implements OnInit {
  moduleLists?: { listName: string; elements: Module[] }[];

  constructor(private moduleService: ModuleService) {}

  ngOnInit(): void {
    this.moduleLists = this.moduleService.getLists();
  }

  get viewLinkFunction(): (item: ToolEntry) => string[] {
    return (item: ToolEntry) => ['/', 'tools', 'detail', item._id];
  }

  get createFunction(): (name: string, list: string) => ToolInit {
    return (name: string, list: string) => {
      return {
        name: name,
        list: list,
      };
    };
  }
}
