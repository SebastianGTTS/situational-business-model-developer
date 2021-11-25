import { NgModule } from '@angular/core';
import { RunningProcessViewerComponent } from './running-process-viewer/running-process-viewer.component';
import { KanbanBoardComponent } from './kanban-board/kanban-board.component';
import { RunningProcessKanbanBoardComponent } from './running-process-kanban-board/running-process-kanban-board.component';
import { RunningProcessMethodCommentsComponent } from './running-process-method-comments/running-process-method-comments.component';
import { RunningProcessMethodCommentFormComponent } from './running-process-method-comment-form/running-process-method-comment-form.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';

@NgModule({
  declarations: [
    RunningProcessViewerComponent,
    KanbanBoardComponent,
    RunningProcessKanbanBoardComponent,
    RunningProcessMethodCommentsComponent,
    RunningProcessMethodCommentFormComponent,
  ],
  imports: [CommonModule, ReactiveFormsModule, QuillModule],
  exports: [
    RunningProcessViewerComponent,
    KanbanBoardComponent,
    RunningProcessKanbanBoardComponent,
    RunningProcessMethodCommentsComponent,
  ],
})
export class DevelopmentProcessViewModule {}
