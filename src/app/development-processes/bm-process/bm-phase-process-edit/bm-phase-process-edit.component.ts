import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { BmPhaseProcess } from '../../../development-process-registry/bm-process/bm-phase-process';
import { PhaseMethodDecision } from '../../../development-process-registry/bm-process/phase-method-decision';
import { Artifact } from '../../../development-process-registry/method-elements/artifact/artifact';
import { PhaseDecision } from '../../../development-process-registry/bm-process/phase-decision';
import { DevelopmentMethodEntry } from '../../../development-process-registry/development-method/development-method';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { BmPhaseProcessService } from '../../../development-process-registry/bm-process/bm-phase-process.service';
import { DevelopmentMethodService } from '../../../development-process-registry/development-method/development-method.service';
import { MethodDecisionUpdate } from '../../../development-process-registry/bm-process/method-decision';
import { SituationalFactor } from '../../../development-process-registry/method-elements/situational-factor/situational-factor';
import { DevelopmentMethodSummaryModal } from '../../development-method/development-method-summary-modal/development-method-summary-modal';
import { DevelopmentMethodSummaryModalComponent } from '../../development-method/development-method-summary-modal/development-method-summary-modal.component';
import { BmPhaseProcessBoardComponent } from '../bm-phase-process-board/bm-phase-process-board.component';

@Component({
  selector: 'app-bm-phase-process-edit',
  templateUrl: './bm-phase-process-edit.component.html',
  styleUrls: ['./bm-phase-process-edit.component.css'],
})
export class BmPhaseProcessEditComponent implements OnChanges {
  @Input() bmProcess!: BmPhaseProcess;
  @Output() updatePhases = new EventEmitter<string[]>();
  @Output() addDevelopmentMethod = new EventEmitter<{
    phaseId: string;
    developmentMethod: DevelopmentMethodEntry;
  }>();
  @Output() updateDecisions = new EventEmitter<{
    phaseMethodDecisionId: string;
    update: MethodDecisionUpdate;
  }>();
  @Output() updateDecisionNumber = new EventEmitter<{
    decisionId: string;
    number: number;
  }>();
  @Output() removeDecision = new EventEmitter<string>();

  incompleteMethodDecisions: {
    id: string;
    phase: string;
    name: string;
  }[] = [];
  wrongNumbers = false;
  executionOrder?: PhaseMethodDecision[];

  lowWarnings: {
    id: string;
    phase: string;
    name: string;
    situationalFactors: string[];
  }[] = [];
  incorrectWarnings: {
    id: string;
    phase: string;
    name: string;
    situationalFactors: string[];
  }[] = [];
  missingArtifacts: {
    id: string;
    phase: string;
    name: string;
    artifacts: Artifact[];
  }[] = [];

  modalPhaseDecision?: PhaseDecision;
  validDevelopmentMethods?: DevelopmentMethodEntry[];
  modalPhaseMethodDecision?: PhaseMethodDecision;
  private modalReference?: NgbModalRef;

  @ViewChild(BmPhaseProcessBoardComponent)
  bmPhaseProcessBoardComponent?: BmPhaseProcessBoardComponent;
  @ViewChild('methodEditModal', { static: true }) methodEditModal: unknown;
  @ViewChild('phasesEditModal') phaseEditModal: unknown;
  @ViewChild('processBoard')
  processBoard?: ElementRef<HTMLDivElement>;
  @ViewChild('selectDevelopmentMethodModal')
  selectDevelopmentMethodModal: unknown;

  constructor(
    private bmPhaseProcessService: BmPhaseProcessService,
    private developmentMethodService: DevelopmentMethodService,
    private modalService: NgbModal
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.bmProcess) {
      if (this.modalPhaseDecision != null) {
        this.modalPhaseDecision = this.bmProcess.getPhaseDecision(
          this.modalPhaseDecision.phase.id
        );
        if (this.modalPhaseDecision == null && this.modalReference != null) {
          this.modalReference.dismiss();
        }
      }
      if (this.modalPhaseMethodDecision != null) {
        this.modalPhaseMethodDecision = this.bmProcess.getPhaseMethodDecision(
          this.modalPhaseMethodDecision.id
        );
        if (
          this.modalPhaseMethodDecision == null &&
          this.modalReference != null
        ) {
          this.modalReference.dismiss();
        }
      }
      this.checkWarnings();
      this.checkArtifacts();
      this.checkComplete();
    }
  }

  focus(nodeId: string): void {
    this.bmPhaseProcessBoardComponent?.focusElement(nodeId);
    this.processBoard?.nativeElement.scrollIntoView({ behavior: 'smooth' });
  }

  openEditPhasesModal(): void {
    this.modalService.open(this.phaseEditModal, {
      size: 'lg',
    });
  }

  async openSelectDevelopmentMethodModal(
    phaseDecision: PhaseDecision
  ): Promise<void> {
    this.modalPhaseDecision = phaseDecision;
    this.validDevelopmentMethods =
      await this.developmentMethodService.getValidPhaseDevelopmentMethods(
        phaseDecision.phase.id,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        this.bmProcess.situationalFactors.map((factor) => factor.element!)
      );
    this.modalReference = this.modalService.open(
      this.selectDevelopmentMethodModal,
      {
        size: 'lg',
        beforeDismiss: () => {
          this.modalPhaseDecision = undefined;
          this.validDevelopmentMethods = undefined;
          return true;
        },
      }
    );
  }

  resetSelectDevelopmentMethodModal(): void {
    this.modalPhaseDecision = undefined;
    this.validDevelopmentMethods = undefined;
    this.modalReference?.close();
  }

  openMethodEditModal(phaseMethodDecisionId: string): void {
    this.modalPhaseMethodDecision = this.bmProcess.getPhaseMethodDecision(
      phaseMethodDecisionId
    );
    this.modalReference = this.modalService.open(this.methodEditModal, {
      size: 'lg',
    });
  }

  openDevelopmentMethodSummary(phaseMethodDecisionId: string): void {
    this.modalPhaseMethodDecision = this.bmProcess.getPhaseMethodDecision(
      phaseMethodDecisionId
    );
    this.modalReference = this.modalService.open(
      DevelopmentMethodSummaryModalComponent,
      { size: 'lg' }
    );
    const developmentMethodSummaryModal: DevelopmentMethodSummaryModal =
      this.modalReference.componentInstance;
    developmentMethodSummaryModal.methodDecision =
      this.modalPhaseMethodDecision?.decision;
  }

  private checkComplete(): void {
    this.executionOrder = this.bmProcess.getSortedPhaseMethodDecisions();
    this.incompleteMethodDecisions = this.executionOrder
      .filter(
        (decision) =>
          !decision.isComplete() ||
          !this.bmPhaseProcessService.checkDecisionStepArtifacts(
            decision.decision
          )
      )
      .map((decision) => {
        return {
          id: decision.id,
          phase: decision.phaseDecision.phase.name,
          name: decision.decision.method.name,
        };
      });
    if (this.incompleteMethodDecisions.length === 0) {
      this.wrongNumbers = this.executionOrder.some(
        (phaseMethodDecision, index) =>
          (phaseMethodDecision.number ?? 0) - 1 !== index
      );
    } else {
      this.wrongNumbers = false;
    }
  }

  checkWarnings(): void {
    const lowWarnings: {
      id: string;
      phase: string;
      name: string;
      situationalFactors: string[];
    }[] = [];
    const incorrectWarnings: {
      id: string;
      phase: string;
      name: string;
      situationalFactors: string[];
    }[] = [];

    const generateWarnings = (
      id: string,
      phase: string,
      name: string,
      factors: SituationalFactor[]
    ): void => {
      const { low, incorrect } = this.bmPhaseProcessService.checkMatch(
        this.bmProcess,
        factors
      );
      if (low.length > 0) {
        lowWarnings.push({
          id,
          phase,
          name,
          situationalFactors: low.map((factor) => factor.factor.name),
        });
      }
      if (incorrect.length > 0) {
        incorrectWarnings.push({
          id,
          phase,
          name,
          situationalFactors: incorrect.map((factor) => factor.factor.name),
        });
      }
    };

    this.bmProcess.getAllPhaseMethodDecisions().forEach((phaseMethodDecision) =>
      generateWarnings(
        phaseMethodDecision.id,
        phaseMethodDecision.phaseDecision.phase.name,
        phaseMethodDecision.decision.method.name,
        phaseMethodDecision.decision.method.situationalFactors.map(
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          (factor) => factor.element!
        )
      )
    );

    this.lowWarnings = lowWarnings;
    this.incorrectWarnings = incorrectWarnings;
  }

  checkArtifacts(): void {
    const missingArtifacts = this.bmPhaseProcessService.checkArtifacts(
      this.bmProcess
    );
    this.missingArtifacts = missingArtifacts.map((missingArtifact) => {
      return {
        id: missingArtifact.phaseMethodDecision.id,
        phase: missingArtifact.phaseMethodDecision.phaseDecision.phase.name,
        name: missingArtifact.phaseMethodDecision.decision.method.name,
        artifacts: missingArtifact.missingArtifacts,
      };
    });
  }
}
