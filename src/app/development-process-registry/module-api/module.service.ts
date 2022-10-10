import { Injectable } from '@angular/core';
import { DevelopmentProcessRegistryModule } from '../development-process-registry.module';
import { Module } from './module';
import { ModuleMethod } from './module-method';
import { NavItem } from './nav-item';

@Injectable({
  providedIn: DevelopmentProcessRegistryModule,
})
export class ModuleService {
  modules: Module[] = [];

  registerModule(module: Module): void {
    this.modules.push(module);
  }

  getModule(module: string): Module | undefined {
    return this.modules.find((m) => m.name === module);
  }

  /**
   * Get all navigation items from all modules.
   */
  getNavigationItems(): NavItem[] {
    return this.modules.map((module) => module.navigation).flat();
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
    const moduleLists: { listName: string; elements: Module[] }[] = [];
    Object.entries(moduleListMap).forEach(([listName, elements]) => {
      moduleLists.push({ listName, elements });
    });
    return moduleLists;
  }

  getModuleMethod(module: string, method: string): ModuleMethod | undefined {
    const realModule = this.modules.find((m) => m.name === module);
    if (!realModule) {
      return undefined;
    }
    return realModule.methods[method];
  }
}
