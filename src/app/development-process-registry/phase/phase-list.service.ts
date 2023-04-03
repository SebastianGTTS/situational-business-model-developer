import { Injectable } from '@angular/core';
import { DevelopmentProcessRegistryModule } from '../development-process-registry.module';
import { DefaultElementService } from '../../database/default-element.service';
import { PhaseList, PhaseListInit } from './phase-list';
import { DatabaseRevision, DbId } from '../../database/database-entry';
import { PhaseInit } from './phase';
import { IconInit } from 'src/app/model/icon';

@Injectable({
  providedIn: DevelopmentProcessRegistryModule,
})
export class PhaseListService extends DefaultElementService<
  PhaseList,
  PhaseListInit
> {
  protected readonly typeName = PhaseList.typeName;

  protected readonly elementConstructor = PhaseList;

  private id?: DbId;
  private creating?: Promise<DbId>;

  async get(): Promise<PhaseList & DatabaseRevision> {
    if (this.id != null) {
      try {
        return await super.get(this.id);
      } catch (e) {
        // On any exception ignore id
        this.id = undefined;
      }
    }
    const elementList = await this.getList();
    const element = elementList[0];
    if (element == null) {
      if (this.creating == null) {
        let resolve!: (id: DbId) => void;
        this.creating = new Promise<DbId>((r) => (resolve = r));
        const phaseList = await this.add({});
        this.id = phaseList._id;
        resolve(this.id);
        this.creating = undefined;
        return super.get(phaseList._id);
      } else {
        return super.get(await this.creating);
      }
    }
    this.id = element._id;
    return new this.elementConstructor(element, undefined) as PhaseList &
      DatabaseRevision;
  }

  async getId(): Promise<DbId> {
    if (this.id != null) {
      return this.id;
    } else {
      return (await this.get())._id;
    }
  }

  /**
   * Add a phase to the phase list
   */
  async addPhase(id: DbId, phase: PhaseInit): Promise<void> {
    try {
      const phaseList = await this.getWrite(id);
      phaseList.addPhase(phase);
      await this.save(phaseList);
    } finally {
      this.freeWrite(id);
    }
  }

  /**
   * Update a phase
   *
   * @param id
   * @param phaseId
   * @param value
   */
  async updatePhase(
    id: DbId,
    phaseId: string,
    value: PhaseInit
  ): Promise<void> {
    try {
      const phaseList = await this.getWrite(id);
      phaseList.updatePhase(phaseId, value);
      await this.save(phaseList);
    } finally {
      this.freeWrite(id);
    }
  }

  /**
   * Update the icon of a phase in a phase list
   *
   * @param id
   * @param phaseId
   * @param icon
   */
  async updateIcon(id: DbId, phaseId: string, icon: IconInit): Promise<void> {
    try {
      const phaseList = await this.getWrite(id);
      phaseList.updateIcon(phaseId, icon);
      await this.save(phaseList);
    } finally {
      this.freeWrite(id);
    }
  }

  /**
   * Move a phase
   *
   * @param id
   * @param phaseId
   * @param offset
   */
  async movePhase(id: DbId, phaseId: string, offset: number): Promise<void> {
    try {
      const phaseList = await this.getWrite(id);
      phaseList.movePhase(phaseId, offset);
      await this.save(phaseList);
    } finally {
      this.freeWrite(id);
    }
  }

  /**
   * Remove a phase form the phase list
   *
   * @param id
   * @param phaseId
   */
  async deletePhase(id: DbId, phaseId: string): Promise<void> {
    try {
      const phaseList = await this.getWrite(id);
      phaseList.removePhase(phaseId);
      await this.save(phaseList);
    } finally {
      this.freeWrite(id);
    }
  }
}
