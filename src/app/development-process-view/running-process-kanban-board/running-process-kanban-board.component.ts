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
import { MethodDecision } from '../../development-process-registry/bm-process/method-decision';
import { RunningPatternProcess } from '../../development-process-registry/running-process/running-pattern-process';
import { RunningPhaseProcess } from '../../development-process-registry/running-process/running-phase-process';
import { RunningPatternProcessService } from '../../development-process-registry/running-process/running-pattern-process.service';
import { RunningPhaseProcessService } from '../../development-process-registry/running-process/running-phase-process.service';

@Component({
  selector: 'app-running-process-kanban-board',
  templateUrl: './running-process-kanban-board.component.html',
  styleUrls: ['./running-process-kanban-board.component.css'],
})
export class RunningProcessKanbanBoardComponent implements OnChanges {
  @Input() editable = true;
  @Input() infoOnly = false;

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

  constructor(
    private runningPatternProcessService: RunningPatternProcessService,
    private runningPhaseProcessService: RunningPhaseProcessService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.runningProcess) {
      void this.updateBoard(changes.runningProcess.currentValue);
    }
  }

  _showNodeInfo(nodeId: string): void {
    if (this.runningProcess instanceof RunningPatternProcess) {
      this.showInfo.emit(this.runningProcess.process.decisions[nodeId]);
    } else if (this.runningProcess instanceof RunningPhaseProcess) {
      this.showInfo.emit(
        this.runningProcess.process.getPhaseMethodDecision(nodeId)?.decision
      );
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
    if (runningProcess instanceof RunningPatternProcess) {
      todo.push(
        ...(
          await this.runningPatternProcessService.getExecutableMethods(
            runningProcess
          )
        ).map((node) => {
          return {
            nodeId: node.id,
            methodName: runningProcess.process.decisions[node.id].method.name,
          };
        })
      );
    }
    if (runningProcess instanceof RunningPhaseProcess) {
      const currentPhaseMethodDecision =
        this.runningPhaseProcessService.getExecutableMethod(runningProcess);
      if (currentPhaseMethodDecision != null) {
        todo.push({
          nodeId: currentPhaseMethodDecision.id,
          methodName: currentPhaseMethodDecision.decision.method.name,
        });
      }
    }
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
