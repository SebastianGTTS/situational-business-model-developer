import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { Comment } from '../../development-process-registry/running-process/comment';
import { FormGroup } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-running-process-method-comments',
  templateUrl: './running-process-method-comments.component.html',
  styleUrls: ['./running-process-method-comments.component.css'],
})
export class RunningProcessMethodCommentsComponent {
  @Input() comments!: Comment[];
  @Input() editable = true;

  @Output() addComment = new EventEmitter<Comment>();
  @Output() updateComment = new EventEmitter<Comment>();
  @Output() removeComment = new EventEmitter<string>();

  modalComment?: Comment;
  private modalReference?: NgbModalRef;

  @ViewChild('editCommentModal', { static: true }) editCommentModal: unknown;

  constructor(private modalService: NgbModal) {}

  _addComment(formGroup: FormGroup): void {
    this.addComment.emit(new Comment(undefined, formGroup.getRawValue()));
    formGroup.reset();
  }

  _editComment(comment: Comment): void {
    this.modalComment = comment;
    this.modalReference = this.modalService.open(this.editCommentModal, {
      size: 'lg',
    });
  }

  _updateComment(formGroup: FormGroup): void {
    this.modalComment?.update(formGroup.value);
    this.updateComment.emit(this.modalComment);
    this.modalReference?.close();
  }
}
