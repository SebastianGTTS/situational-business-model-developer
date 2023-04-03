import { Component, QueryList, ViewChildren } from '@angular/core';
import {
  Type,
  TypeInit,
} from '../../../../development-process-registry/method-elements/type/type';
import { TypeService } from '../../../../development-process-registry/method-elements/type/type.service';
import { MethodElementLoaderService } from '../../../shared/method-element-loader.service';
import { MethodElementService } from '../../../../development-process-registry/method-elements/method-element.service';
import { IconInit } from 'src/app/model/icon';
import { Updatable, UPDATABLE } from 'src/app/shared/updatable';

@Component({
  selector: 'app-type',
  templateUrl: './type.component.html',
  styleUrls: ['./type.component.css'],
  providers: [
    MethodElementLoaderService,
    { provide: MethodElementService, useExisting: TypeService },
    { provide: UPDATABLE, useExisting: TypeComponent },
  ],
})
export class TypeComponent {
  @ViewChildren(UPDATABLE) updatable!: QueryList<Updatable>;

  constructor(
    private typeLoaderService: MethodElementLoaderService<Type, TypeInit>,
    private typeService: TypeService
  ) {}

  async updateValue(value: TypeInit): Promise<void> {
    if (this.type != null) {
      await this.typeService.update(this.type._id, value);
    }
  }

  async updateIcon(icon: IconInit): Promise<void> {
    if (this.type != null) {
      await this.typeService.updateIcon(this.type._id, icon);
    }
  }

  update(): void {
    for (const updatable of this.updatable) {
      updatable.update();
    }
  }

  get type(): Type | undefined {
    return this.typeLoaderService.methodElement;
  }

  get listNames(): string[] {
    return this.typeLoaderService.listNames;
  }
}
