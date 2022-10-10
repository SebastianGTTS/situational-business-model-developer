import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { KanbanBoardMethodInfo } from '../kanban-board/kanban-board-method-info';
import { RunningProcess } from '../../development-process-registry/running-process/running-process';
import { RunningProcessService } from '../../development-process-registry/running-process/running-process.service';
import { MethodDecision } from '../../development-process-registry/bm-process/method-decision';

@Component({
  selector: 'app-running-process-kanban-board',
  templateUrl: './running-process-kanban-board.component.html',
  styleUrls: ['./running-process-kanban-board.component.css'],
})
export class RunningProcessKanbanBoardComponent implements OnChanges {
  @Input() runningProcess!: RunningProcess;

  @Output() addTodo = new EventEmitter<void>();
  @Output() editTodo = new EventEmitter<string>(); // emits the execution id
  @Output() removeTodo = new EventEmitter<string>(); // emits the execution id
  @Output() viewNode = new EventEmitter<string>(); // emits the node id
  @Output() showInfo = new EventEmitter<MethodDecision>();
  @Output() startNodeExecution = new EventEmitter<string>(); // emits the node id
  @Output() startExecution = new EventEmitter<string>(); // emits the execution id
  @Output() viewExecution = new EventEmitter<string>(); // emits execution id
  @Output() viewArtifacts = new EventEmitter<string>(); // emits execution id
  @Output() viewComments = new EventEmitter<string>(); // emits execution id

  todo: KanbanBoardMethodInfo[] = [];
  doing: KanbanBoardMethodInfo[] = [];
  done: KanbanBoardMethodInfo[] = [];

  constructor(private runningProcessService: RunningProcessService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.runningProcess) {
      void this.updateBoard(changes.runningProcess.currentValue);
    }
  }

  _showNodeInfo(nodeId: string): void {
    if (this.runningProcess.hasProcess()) {
      this.showInfo.emit(this.runningProcess.process.decisions[nodeId]);
    }
  }

  _showExecutionInfo(executionId: string): void {
    const todoMethod = this.runningProcess.getTodoMethod(executionId);
    const runningMethod = this.runningProcess.getRunningMethod(executionId);
    let decision;
    if (todoMethod) {
      decision = todoMethod.decision;
    } else if (runningMethod) {
      decision = runningMethod.decision;
    }
    this.showInfo.emit(decision);
  }

  private async updateBoard(runningProcess: RunningProcess): Promise<void> {
    this.todo = await this.getTodoList(runningProcess);
    this.doing = this.getDoingList(runningProcess);
    this.done = this.getDoneList(runningProcess);
  }

  private async getTodoList(
    runningProcess: RunningProcess
  ): Promise<KanbanBoardMethodInfo[]> {
    const todo: KanbanBoardMethodInfo[] = [];
    todo.push(...runningProcess.todoMethods);
    todo.push(
      ...(
        await this.runningProcessService.getExecutableMethods(runningProcess)
      ).map((node) => {
        return {
          nodeId: node.id,
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          methodName: runningProcess.process!.decisions[node.id].method.name,
        };
      })
    );
    return todo;
  }

  // noinspection JSMethodCanBeStatic
  private getDoingList(
    runningProcess: RunningProcess
  ): KanbanBoardMethodInfo[] {
    return runningProcess.runningMethods;
  }

  // noinspection JSMethodCanBeStatic
  private getDoneList(runningProcess: RunningProcess): KanbanBoardMethodInfo[] {
    return runningProcess.executedMethods.slice().reverse();
  }
}
