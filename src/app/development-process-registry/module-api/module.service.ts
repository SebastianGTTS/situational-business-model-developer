import { Injectable } from '@angular/core';
import { DevelopmentProcessRegistryModule } from '../development-process-registry.module';
import { Module } from './module';
import { ModuleMethod } from './module-method';

@Injectable({
  providedIn: DevelopmentProcessRegistryModule,
})
export class ModuleService {
  modules: Module[] = [];

  registerModule(module: Module): void {
    this.modules.push(module);
  }

  getModule(module: string): Module {
    return this.modules.find((m) => m.name === module);
  }

  /**
   * Get all modules in their lists
   */
  getLists(): { listName: string; elements: Module[] }[] {
    const moduleListMap: { [listName: string]: Module[] } = {};
    this.modules.forEach((module) => {
      if (module.list in moduleListMap) {
        moduleListMap[module.list].push(module);
      } else {
        moduleListMap[module.list] = [module];
      }
    });
    const moduleLists = [];
    Object.entries(moduleListMap).forEach(([listName, elements]) => {
      moduleLists.push({ listName, elements });
    });
    return moduleLists;
  }

  getModuleMethod(module: string, method: string): ModuleMethod {
    const realModule = this.modules.find((m) => m.name === module);
    if (!realModule) {
      return null;
    }
    return realModule.methods[method];
  }
}
