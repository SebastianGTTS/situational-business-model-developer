import { CompanyModel } from './company-model';
import { ArtifactDataReference } from '../../../development-process-registry/running-process/artifact-data';

export interface InstanceArtifactData extends ArtifactDataReference {
  type: typeof CompanyModel.typeName;
  id: string;
  instanceId: number;
}
