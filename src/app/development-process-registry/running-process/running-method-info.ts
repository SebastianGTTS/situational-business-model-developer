import { Comment } from './comment';

export interface RunningMethodInfo {
  nodeId?: string;
  executionId: string;
  methodName: string;
  comments: Comment[];
}
