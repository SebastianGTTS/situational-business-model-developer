import { Component, EventEmitter, Input, Output } from '@angular/core';
import { KanbanBoardMethodInfo } from './kanban-board-method-info';

@Component({
  selector: 'app-kanban-board',
  templateUrl: './kanban-board.component.html',
  styleUrls: ['./kanban-board.component.css'],
})
export class KanbanBoardComponent {
  @Input() todo: KanbanBoardMethodInfo[];
  @Input() doing: KanbanBoardMethodInfo[];
  @Input() done: KanbanBoardMethodInfo[];

  @Output() addTodo = new EventEmitter<void>();
  @Output() removeTodo = new EventEmitter<string>(); // emits the execution id
  @Output() viewNode = new EventEmitter<string>(); // emits the node id
  @Output() showNodeInfo = new EventEmitter<string>(); // emits the node id
  @Output() showExecutionInfo = new EventEmitter<string>(); // emits the execution id
  @Output() startNodeExecution = new EventEmitter<string>(); // emits the node id
  @Output() startExecution = new EventEmitter<string>(); // emits the execution id
  @Output() viewExecution = new EventEmitter<string>(); // emits execution id
  @Output() viewComments = new EventEmitter<string>(); // emits execution id

  donePage: number = 1;
  donePageSize: number = 4;

  _showInfo(info: KanbanBoardMethodInfo): void {
    if (info.executionId) {
      this.showExecutionInfo.emit(info.executionId);
    } else if (info.nodeId) {
      this.showNodeInfo.emit(info.nodeId);
    }
  }

  _startExecution(info: KanbanBoardMethodInfo): void {
    if (info.executionId) {
      this.startExecution.emit(info.executionId);
    } else if (info.nodeId) {
      this.startNodeExecution.emit(info.nodeId);
    }
  }
}
