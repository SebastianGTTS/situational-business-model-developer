import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { HypoMoMap } from '../../../hypo-mo-map-meta-artifact/hypo-mo-map';
import { ExperimentUsed } from '../../../hypo-mo-map-meta-artifact/experiment-used';
import { Hypothesis } from '../../../hypo-mo-map-meta-artifact/hypothesis';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';

enum SelectionMethod {
  HIGHESTPRIORITY = 'highestPriority',
  ESTIMATEDRATIO = 'estimatedRatio',
  DISCOUNTEDRATIO = 'discountedRatio',
}

@Component({
  selector: 'app-experiment-chooser',
  templateUrl: './experiment-chooser.component.html',
  styleUrls: ['./experiment-chooser.component.css'],
})
export class ExperimentChooserComponent
  implements OnInit, OnChanges, OnDestroy
{
  @Input() hypoMoMap?: HypoMoMap;

  @Output() executeExperiment = new EventEmitter<{
    experimentDefinitionId: string;
    experimentId: string;
    results: { hypothesisId: string; evidence: number; approved: boolean }[];
  }>();

  methodForm: UntypedFormGroup = this.fb.group({
    method: [null, Validators.required],
  });

  selectedHypothesis?: Hypothesis;
  possibleExperiments: ExperimentUsed[] = [];
  possibleExperimentsWithRatio: {
    experiment: ExperimentUsed;
    ratio: number;
  }[] = [];

  modalExperiment?: ExperimentUsed;
  modalHypothesisMappings?: { hypothesis: Hypothesis; metric: string }[];
  experimentExecutionForm?: UntypedFormGroup;
  private modalReference?: NgbModalRef;

  private methodFormSubscription?: Subscription;

  @ViewChild('experimentOverviewModal', { static: true })
  experimentOverviewModal: unknown;

  constructor(private fb: UntypedFormBuilder, private modalService: NgbModal) {}

  ngOnInit(): void {
    this.methodFormSubscription = this.methodForm
      .get('method')
      ?.valueChanges.subscribe(() => this.selectExperiments());
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.hypoMoMap) {
      this.selectExperiments();
    }
  }

  ngOnDestroy(): void {
    if (this.methodFormSubscription != null) {
      this.methodFormSubscription.unsubscribe();
    }
  }

  private selectExperiments(): void {
    this.possibleExperiments = [];
    this.selectedHypothesis = undefined;
    this.possibleExperimentsWithRatio = [];
    const selectedMethod = this.methodForm.get('method')?.value;
    if (selectedMethod === SelectionMethod.HIGHESTPRIORITY) {
      this.selectHighestPriority();
    } else if (selectedMethod === SelectionMethod.ESTIMATEDRATIO) {
      this.selectBestEstimatedRatio();
    } else if (selectedMethod === SelectionMethod.DISCOUNTEDRATIO) {
      this.selectBestDiscountedRatio();
    }
  }

  selectHighestPriority(): void {
    if (this.hypoMoMap != null) {
      const hypoMoMap = this.hypoMoMap;
      const hypothesesWithMappings = new Set(
        hypoMoMap.mappings.map((mapping) => mapping.hypothesisId)
      );
      const hypotheses = hypoMoMap
        .getHypothesisList()
        .filter((hypothesis) => hypothesesWithMappings.has(hypothesis.id));
      const selectedHypothesis = this.getHighestPriority(hypotheses);
      this.selectedHypothesis = selectedHypothesis;
      this.possibleExperiments = hypoMoMap.mappings
        .filter((mapping) => mapping.hypothesisId === selectedHypothesis?.id)
        .map((mapping) =>
          hypoMoMap.usedExperiments[
            mapping.experimentDefinitionId
          ].getExperiment(mapping.experimentId)
        ) as ExperimentUsed[];
    }
  }

  // noinspection JSMethodCanBeStatic
  private getHighestPriority(hypotheses: Hypothesis[]): Hypothesis | undefined {
    let hypothesis: Hypothesis | undefined = undefined;
    for (const h of hypotheses) {
      if (h.priority > (hypothesis != null ? hypothesis.priority : 0)) {
        hypothesis = h;
      }
    }
    return hypothesis;
  }

  selectBestEstimatedRatio(): void {
    const experimentsWithHypotheses = this.getExperimentsWithHypotheses();
    const experimentsWithRatio = experimentsWithHypotheses.map((experiment) => {
      const ratio =
        experiment.hypotheses
          .map(
            (hypothesis) =>
              // TODO
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              experiment.experiment.maxEvidence! -
              (hypothesis.evidenceScore ? hypothesis.evidenceScore : 0)
          )
          .filter((gain) => gain > 0)
          // TODO
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          .reduce((acc, gain) => acc + gain, 0) / experiment.experiment.costs!;
      return { experiment: experiment.experiment, ratio };
    });
    this.possibleExperimentsWithRatio = experimentsWithRatio.sort(
      (a, b) => b.ratio - a.ratio
    );
  }

  selectBestDiscountedRatio(): void {
    const experimentsWithHypotheses = this.getExperimentsWithHypotheses();
    const experimentsWithRatio = experimentsWithHypotheses.map((experiment) => {
      const ratio =
        experiment.hypotheses
          .map(
            (hypothesis) =>
              // TODO
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              (experiment.experiment.maxEvidence! -
                (hypothesis.evidenceScore ? hypothesis.evidenceScore : 0)) *
              (hypothesis.priority / 5)
          )
          .filter((gain) => gain > 0)
          // TODO
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          .reduce((acc, gain) => acc + gain, 0) / experiment.experiment.costs!;
      return { experiment: experiment.experiment, ratio };
    });
    this.possibleExperimentsWithRatio = experimentsWithRatio.sort(
      (a, b) => b.ratio - a.ratio
    );
  }

  /**
   * Get all experiments with their corresponding mapped hypotheses, but only experiments that have mappings
   */
  private getExperimentsWithHypotheses(): {
    experiment: ExperimentUsed;
    hypotheses: Hypothesis[];
  }[] {
    if (this.hypoMoMap == null) {
      throw new Error('HypoMoMap is not defined');
    }
    const hypoMoMap = this.hypoMoMap;
    const experiments = Object.values(hypoMoMap.usedExperiments).reduce(
      (acc: ExperimentUsed[], experiment) =>
        acc.concat(experiment.getExperimentList() as ExperimentUsed[]),
      []
    );
    return experiments
      .map((experiment) => {
        const experimentDefinitionId = experiment.getExperimentDefinitionId();
        const mappings = hypoMoMap.mappings.filter(
          (mapping) =>
            mapping.experimentDefinitionId === experimentDefinitionId &&
            mapping.experimentId === experiment.id
        );
        return { experiment, mappings };
      })
      .filter((experiment) => experiment.mappings.length > 0)
      .map((experiment) => {
        return {
          experiment: experiment.experiment,
          hypotheses: experiment.mappings.map((mapping) =>
            hypoMoMap.getHypothesis(mapping.hypothesisId)
          ),
        };
      });
  }

  openExperimentOverview(experiment: ExperimentUsed): void {
    if (this.hypoMoMap != null) {
      const hypoMoMap = this.hypoMoMap;
      this.modalExperiment = experiment;
      const experimentDefinitionId = experiment.getExperimentDefinitionId();
      this.modalHypothesisMappings = hypoMoMap.mappings
        .filter(
          (mapping) =>
            mapping.experimentDefinitionId === experimentDefinitionId &&
            mapping.experimentId === experiment.id
        )
        .map((mapping) => {
          return {
            hypothesis: hypoMoMap.getHypothesis(mapping.hypothesisId),
            metric: mapping.metric,
          };
        });
      this.experimentExecutionForm = this.fb.group({
        hypotheses: this.fb.array(
          this.modalHypothesisMappings.map(() =>
            this.fb.group({
              evidence: [undefined, Validators.required],
              approved: [undefined, Validators.required],
            })
          )
        ),
      });
      this.modalReference = this.modalService.open(
        this.experimentOverviewModal,
        {
          size: 'lg',
        }
      );
    }
  }

  submitExecuteExperiment(experimentExecutionForm: UntypedFormGroup): void {
    if (this.modalExperiment != null && this.modalHypothesisMappings != null) {
      const modalHypothesisMappings = this.modalHypothesisMappings;
      const results = experimentExecutionForm.value.hypotheses.map(
        (result: { evidence: number; approved: boolean }, index: number) => {
          return {
            ...result,
            hypothesisId: modalHypothesisMappings[index].hypothesis.id,
          };
        }
      );
      this.executeExperiment.emit({
        experimentDefinitionId:
          this.modalExperiment.getExperimentDefinitionId(),
        experimentId: this.modalExperiment.id,
        results,
      });
      this.modalReference?.close();
    }
  }
}
