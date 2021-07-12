import { ModuleMethod } from './module-method';
import { ModuleApiService } from './module-api-service';

export class Module {

  name: string;
  methods: { [name: string]: ModuleMethod } = {};
  service: ModuleApiService;

  addMethod(method: ModuleMethod) {
    this.methods[method.name] = method;
  }

}
