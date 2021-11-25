import { ModuleMethod } from './module-method';
import { ModuleApiService } from './module-api-service';

export class Module {
  list: string;
  name: string;
  methods: { [name: string]: ModuleMethod } = {};
  service: ModuleApiService;

  addMethod(method: ModuleMethod): void {
    this.methods[method.name] = method;
  }

  get methodNames(): string[] {
    return Object.keys(this.methods);
  }
}
