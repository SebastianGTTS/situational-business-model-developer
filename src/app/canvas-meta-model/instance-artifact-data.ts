import { CompanyModel } from './company-model';
import { ArtifactDataReference } from '../development-process-registry/running-process/artifact-data';

export class InstanceArtifactData implements ArtifactDataReference {

  type = CompanyModel.typeName;
  id: string;
  instanceId: number;

  constructor(instanceArtifactData: Partial<InstanceArtifactData>) {
    Object.assign(this, instanceArtifactData);
  }

}
