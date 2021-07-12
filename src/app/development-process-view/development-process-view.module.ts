import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RunningProcessViewerComponent } from './running-process-viewer/running-process-viewer.component';
import { KanbanBoardComponent } from './kanban-board/kanban-board.component';
import { RunningProcessKanbanBoardComponent } from './running-process-kanban-board/running-process-kanban-board.component';


@NgModule({
  declarations: [RunningProcessViewerComponent, KanbanBoardComponent, RunningProcessKanbanBoardComponent],
  imports: [
    CommonModule
  ],
  exports: [
    RunningProcessViewerComponent,
    KanbanBoardComponent,
    RunningProcessKanbanBoardComponent
  ],
})
export class DevelopmentProcessViewModule {
}
