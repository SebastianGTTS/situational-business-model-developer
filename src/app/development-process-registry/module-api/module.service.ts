import { Injectable } from '@angular/core';
import { DevelopmentProcessRegistryModule } from '../development-process-registry.module';
import { Module } from './module';
import { ModuleMethod } from './module-method';

@Injectable({
  providedIn: DevelopmentProcessRegistryModule
})
export class ModuleService {

  modules: Module[] = [];

  registerModule(module: Module) {
    this.modules.push(module);
  }

  getModule(module: string): Module {
    return this.modules.find((m) => m.name === module);
  }

  getModuleMethod(module: string, method: string): ModuleMethod {
    const realModule = this.modules.find((m) => m.name === module);
    if (!realModule) {
      return null;
    }
    return realModule.methods[method];
  }

}
