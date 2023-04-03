import { Constructor, MixinOnLoaded } from '../../../../shared/utils';
import { Hypothesis } from '../../hypo-mo-map-meta-artifact/hypothesis';
import { HypoMoMap } from '../../hypo-mo-map-meta-artifact/hypo-mo-map';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { HypothesisModalComponent } from '../hypothesis/hypothesis-modal/hypothesis-modal.component';
import { HypothesisModal } from '../hypothesis/hypothesis-modal/hypothesis-modal';
import { UntypedFormGroup } from '@angular/forms';
import { HypoMoMapTree } from '../../hypo-mo-map-meta-artifact/hypo-mo-map-tree';
import { HypoMoMapTreeService } from '../../hypo-mo-map-meta-artifact/hypo-mo-map-tree.service';
import { HypothesisDeleteModalComponent } from '../hypothesis/hypothesis-delete-modal/hypothesis-delete-modal.component';
import { HypothesisDeleteModal } from '../hypothesis/hypothesis-delete-modal/hypothesis-delete-modal';

export interface HypothesesEditMixin {
  modalReference?: NgbModalRef;

  openAddHypothesisModal(id?: string): void;

  addHypothesis(hypothesis: UntypedFormGroup): Promise<void>;

  openUpdateHypothesisModal(id: string): void;

  updateHypothesis(
    hypothesis: Hypothesis,
    hypothesisForm: UntypedFormGroup
  ): Promise<void>;

  openDeleteHypothesisModal(id: string): void;

  removeHypothesis(id: string): Promise<void>;
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function HypothesesEditMixin<T extends Constructor<MixinOnLoaded>>(
  Base: T
) {
  abstract class HypothesesEditor extends Base implements HypothesesEditMixin {
    protected abstract get hypoMoMapTreeService(): HypoMoMapTreeService;

    protected abstract get modalService(): NgbModal;

    protected abstract get hypoMoMapTree(): HypoMoMapTree | undefined;

    protected abstract get hypoMoMap(): HypoMoMap | undefined;

    protected abstract get hypothesisList(): Hypothesis[] | undefined;

    modalReference?: NgbModalRef;

    openAddHypothesisModal(id?: string): void {
      if (this.hypoMoMap != null) {
        let hypothesis: Hypothesis | undefined;
        if (id != null) {
          // hypothesis only used to initialize form
          hypothesis = new Hypothesis(
            undefined,
            {
              name: '',
              id: '',
              priority: 1,
            },
            this.hypoMoMap.getHypothesis(id)
          );
        } else {
          hypothesis = undefined;
        }
        this.modalReference = this.modalService.open(HypothesisModalComponent, {
          size: 'lg',
        });
        const modal: HypothesisModal = this.modalReference.componentInstance;
        modal.add = true;
        modal.hypothesis = hypothesis;
        modal.hypothesisList = this.hypothesisList;
        modal.updateHypothesis.subscribe((formGroup) => {
          void this.addHypothesis(formGroup);
        });
      }
    }

    async addHypothesis(hypothesis: UntypedFormGroup): Promise<void> {
      if (this.hypoMoMapTree != null && this.hypoMoMap != null) {
        const parentId = hypothesis.get('subhypothesisOf')?.value ?? undefined;
        await this.hypoMoMapTreeService.addHypothesis(
          this.hypoMoMapTree._id,
          this.hypoMoMap.id,
          hypothesis.value,
          parentId
        );
        this.modalReference?.close();
      }
    }

    openUpdateHypothesisModal(id: string): void {
      if (this.hypoMoMap != null) {
        const hypothesis = this.hypoMoMap.getHypothesis(id);
        this.modalReference = this.modalService.open(HypothesisModalComponent, {
          size: 'lg',
        });
        const modal: HypothesisModal = this.modalReference.componentInstance;
        modal.add = false;
        modal.hypothesis = hypothesis;
        modal.hypothesisList = this.hypothesisList;
        modal.updateHypothesis.subscribe((formGroup) => {
          void this.updateHypothesis(hypothesis, formGroup);
        });
      }
    }

    async updateHypothesis(
      hypothesis: Hypothesis,
      hypothesisForm: UntypedFormGroup
    ): Promise<void> {
      if (this.hypoMoMapTree != null && this.hypoMoMap != null) {
        const parentId =
          hypothesisForm.get('subhypothesisOf')?.value ?? undefined;
        await this.hypoMoMapTreeService.updateHypothesis(
          this.hypoMoMapTree._id,
          this.hypoMoMap.id,
          hypothesis.id,
          parentId,
          hypothesisForm.value
        );
        this.modalReference?.close();
      }
    }

    openDeleteHypothesisModal(id: string): void {
      if (this.hypoMoMap != null) {
        const hypothesis = this.hypoMoMap.getHypothesis(id);
        this.modalReference = this.modalService.open(
          HypothesisDeleteModalComponent,
          {
            size: 'lg',
          }
        );
        const modal: HypothesisDeleteModal =
          this.modalReference.componentInstance;
        modal.hypothesis = hypothesis;
        modal.removeHypothesis.subscribe((hypothesisId) => {
          void this.removeHypothesis(hypothesisId);
        });
      }
    }

    async removeHypothesis(id: string): Promise<void> {
      if (this.hypoMoMapTree != null && this.hypoMoMap != null) {
        await this.hypoMoMapTreeService.removeHypothesis(
          this.hypoMoMapTree._id,
          this.hypoMoMap.id,
          id
        );
        this.modalReference?.close();
      }
    }

    onLoaded(): void {
      super.onLoaded?.();
      const reference = this.modalReference;
      if (reference != null && reference.componentInstance != null) {
        if (reference.componentInstance instanceof HypothesisModalComponent) {
          this.updateHypothesisModal(reference);
        } else if (
          reference.componentInstance instanceof HypothesisDeleteModalComponent
        ) {
          this.updateHypothesisDeleteModal(reference);
        }
      }
    }

    private updateHypothesisModal(reference: NgbModalRef): void {
      const modal: HypothesisModal = reference.componentInstance;
      if (modal.hypothesis != null) {
        const hypothesisId = modal.hypothesis.id;
        try {
          modal.hypothesis = this.hypoMoMap?.getHypothesis(hypothesisId);
        } catch (error) {
          if (
            error instanceof Error &&
            error.message ===
              'Hypothesis with id ' + hypothesisId + ' does not exist'
          ) {
            reference.dismiss();
          } else {
            throw error;
          }
        }
      }
      modal.hypothesisList = this.hypothesisList;
    }

    private updateHypothesisDeleteModal(reference: NgbModalRef): void {
      const modal: HypothesisDeleteModal = reference.componentInstance;
      if (modal.hypothesis != null) {
        const hypothesisId = modal.hypothesis.id;
        try {
          modal.hypothesis = this.hypoMoMap?.getHypothesis(hypothesisId);
        } catch (error) {
          if (
            error instanceof Error &&
            error.message ===
              'Hypothesis with id ' + hypothesisId + ' does not exist'
          ) {
            reference.dismiss();
          } else {
            throw error;
          }
        }
      }
    }
  }

  return HypothesesEditor;
}
