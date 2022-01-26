import { Comment, CommentEntry, CommentInit } from './comment';
import { DatabaseEntry, DatabaseInit } from '../../database/database-entry';

export interface RunningMethodInfoInit extends DatabaseInit {
  nodeId?: string;
  executionId: string;
  methodName: string;
  comments?: CommentInit[];
}

export interface RunningMethodInfoEntry extends DatabaseEntry {
  nodeId?: string;
  executionId: string;
  methodName: string;
  comments: CommentEntry[];
}

export interface RunningMethodInfo extends RunningMethodInfoInit {
  nodeId?: string;
  executionId: string;
  methodName: string;
  comments: Comment[];
}
