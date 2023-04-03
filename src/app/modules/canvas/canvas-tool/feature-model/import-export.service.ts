import { Injectable } from '@angular/core';
import Ajv from 'ajv';
import { ExpertModelService } from '../../canvas-meta-artifact/expert-model.service';
import { saveAs } from 'file-saver';
import {
  ExpertModel,
  ExpertModelEntry,
} from '../../canvas-meta-artifact/expert-model';
import schema from '../../../../../assets/schema_beta.json';
import { CanvasModelConsistencyService } from '../../canvas-meta-artifact/canvas-model-consistency.service';

@Injectable({
  providedIn: 'root',
})
export class ImportExportService {
  private ajv = new Ajv();

  constructor(
    private expertModelService: ExpertModelService,
    private canvasModelConsistencyService: CanvasModelConsistencyService
  ) {}

  /**
   * Export a model to json
   *
   * @param expertModelId the id of the expert model
   */
  async exportExpertModel(expertModelId: string): Promise<void> {
    const expertModel = await this.expertModelService.get(expertModelId);
    const json = new Blob([JSON.stringify(expertModel, null, 2)], {
      type: 'application/json',
    });
    saveAs(json, expertModel.name + '.json');
  }

  /**
   * Imports an expert model into pouchdb after checking the format and consistency
   *
   * @param file the file which includes the model as json
   * @return promise of the new expert model
   */
  async importExpertModel(file: Blob): Promise<ExpertModel> {
    const json = (await this.importJson(file)) as ExpertModelEntry;
    json.instances.forEach((instance, index) => (instance.id = index));
    const expertModel = new ExpertModel(
      undefined,
      new ExpertModel(json, undefined)
    );
    this.canvasModelConsistencyService.checkFormalConsistency(expertModel);
    await this.expertModelService.save(expertModel);
    return this.expertModelService.get(expertModel._id);
  }

  /**
   * Imports JSON from a file and checks against the schema for models.
   *
   * @param file the file to read the JSON from
   */
  private importJson(file: Blob): Promise<unknown> {
    return new Promise((resolve, reject) => {
      const validate = this.ajv.compile(schema);
      const fileReader = new FileReader();
      fileReader.addEventListener('error', () => {
        reject('Error loading file');
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      fileReader.addEventListener('load', (event: any) => {
        let json = undefined;
        try {
          json = JSON.parse(event.target.result);
        } catch (error) {
          reject(error);
          return;
        }
        const valid = validate(json);
        if (!valid) {
          reject(validate.errors);
        } else {
          resolve(json);
        }
      });
      fileReader.readAsText(file);
    });
  }
}
