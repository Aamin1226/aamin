import { Component, Input } from '@angular/core';
import { DocumentService } from '../../../services/document.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent {
  @Input() docId:any
  comment:any
  constructor(public documentService: DocumentService,private toastr: ToastrService){}

  ngOnInit() {

  }

  closeModal() {
    this.documentService.emitClickEvent('comment');
  }

  newComment(){
    const data = {
      document_id: this.docId,
      description:this.comment
    }
    this.documentService.postComment(data).subscribe({
      next: (res:any) => {
        this.toastr.success(res.message);
        this.closeModal();
      },
      error: (err) => {
        console.log(err)
        this.toastr.error(err.error.message);
      },
    });
  }

  // editComment(){
  //   const commentId = 0
  //   const data = {
  //     document_id: this.docId,
  //     description:this.comment
  //   }
  //   this.documentService.updateComment(commentId,data).subscribe({
  //     next: (res:any) => {
  //       this.toastr.success(res.message);
  //       this.closeModal();
  //     },
  //     error: (err) => {
  //       this.toastr.error(err.message);
  //     },
  //   });
  // }
}
