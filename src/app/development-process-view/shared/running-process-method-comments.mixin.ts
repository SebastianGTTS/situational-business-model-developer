import { Comment } from '../../development-process-registry/running-process/comment';
import { RunningProcess } from '../../development-process-registry/running-process/running-process';
import { RunningMethod } from '../../development-process-registry/running-process/running-method';
import { RunningProcessService } from '../../development-process-registry/running-process/running-process.service';
import { AnyConstructor } from '../../shared/utils';

export interface RunningProcessMethodCommentsMixin {
  addComment(comment: Comment): Promise<void>;

  updateComment(comment: Comment): Promise<void>;

  removeComment(commentId: string): Promise<void>;
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function RunningProcessMethodCommentsMixin<T extends AnyConstructor>(
  Base: T
) {
  abstract class CommentsEditor
    extends Base
    implements RunningProcessMethodCommentsMixin
  {
    abstract get runningProcess(): RunningProcess | undefined;

    abstract get runningMethod(): RunningMethod | undefined;

    protected abstract get runningProcessService(): RunningProcessService;

    async addComment(comment: Comment): Promise<void> {
      if (this.runningProcess != null && this.runningMethod != null) {
        await this.runningProcessService.addComment(
          this.runningProcess._id,
          this.runningMethod.executionId,
          comment
        );
      }
    }

    async updateComment(comment: Comment): Promise<void> {
      if (this.runningProcess != null && this.runningMethod != null) {
        await this.runningProcessService.updateComment(
          this.runningProcess._id,
          this.runningMethod.executionId,
          comment
        );
      }
    }

    async removeComment(commentId: string): Promise<void> {
      if (this.runningProcess != null && this.runningMethod != null) {
        await this.runningProcessService.removeComment(
          this.runningProcess._id,
          this.runningMethod.executionId,
          commentId
        );
      }
    }
  }

  return CommentsEditor;
}
