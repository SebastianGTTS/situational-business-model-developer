import { Component } from '@angular/core';
import {
  Type,
  TypeInit,
} from '../../development-process-registry/method-elements/type/type';
import { TypeService } from '../../development-process-registry/method-elements/type/type.service';
import { MethodElementLoaderService } from '../shared/method-element-loader.service';
import { MethodElementService } from '../../development-process-registry/method-elements/method-element.service';

@Component({
  selector: 'app-type',
  templateUrl: './type.component.html',
  styleUrls: ['./type.component.css'],
  providers: [
    MethodElementLoaderService,
    { provide: MethodElementService, useExisting: TypeService },
  ],
})
export class TypeComponent {
  constructor(
    private typeLoaderService: MethodElementLoaderService<Type, TypeInit>,
    private typeService: TypeService
  ) {}

  async updateValue(value: TypeInit): Promise<void> {
    if (this.type != null) {
      await this.typeService.update(this.type._id, value);
    }
  }

  get type(): Type | undefined {
    return this.typeLoaderService.methodElement;
  }

  get listNames(): string[] {
    return this.typeLoaderService.listNames;
  }
}
