import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Comment } from '../../development-process-registry/running-process/comment';

@Component({
  selector: 'app-running-process-method-comment-form',
  templateUrl: './running-process-method-comment-form.component.html',
  styleUrls: ['./running-process-method-comment-form.component.css']
})
export class RunningProcessMethodCommentFormComponent implements OnChanges {

  @Input() comment: Comment = null;

  @Output() submitCommentForm = new EventEmitter<FormGroup>();

  commentForm: FormGroup = this.fb.group({
    userName: ['', Validators.required],
    title: ['', Validators.required],
    comment: ['', Validators.required],
  });

  constructor(
    private fb: FormBuilder,
  ) {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.comment) {
      this.commentForm.patchValue(changes.comment.currentValue);
    }
  }

  submit() {
    this.submitCommentForm.emit(this.commentForm);
  }

}
