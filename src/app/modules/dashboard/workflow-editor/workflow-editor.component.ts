import {Component, ViewChild, ElementRef, HostListener} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {Subscription} from 'rxjs';
import {mergeMap} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import html2canvas from 'html2canvas';
// import jsPDF from 'jspdf';
import {DomSanitizer} from '@angular/platform-browser';
import { DocumentService } from '../../../services/document.service';

declare const Painterro: any;

@Component({
  selector: 'app-workflow-editor',
  templateUrl: './workflow-editor.component.html',
  styleUrls: ['./workflow-editor.component.scss'],
})
export class WorkflowEditorComponent {
  @ViewChild('pdfContent') pdfContent!: ElementRef;

  @HostListener('document:keyup.escape', ['$event'])
  onKeyUp(event: KeyboardEvent) {
    if (event.key === 'Escape' && this.imageEditor.shown == true) {
      this.imageEditor.hide();
    }
  }

  editor: boolean = false;
  reactionMenu: boolean = false;
  editText: boolean = false;
  moveTeamDialogue: boolean = false;
  commentDialogue: boolean = false;
  shareDialogue: boolean = false;
  reactionsMenu: string = 'comment';
  editorSubFolder: boolean = false;
  StatsSubMenu: boolean = false;
  stepToolbar: boolean = false;
  initialStepToolbar: boolean = false;
  documentId: any;
  documentData: any;
  index = -1;
  indexText = -1;
  chatBox: boolean = false;
  dotHover: any = {};
  previewModal: boolean = false;
  editModal: boolean = false;
  // eslint-disable-next-line @typescript-eslint/no-inferrable-types, @typescript-eslint/member-ordering
  previewEditor: boolean = true;
  previewImage: any;
  imageEditor: any;
  editTitle: boolean = false;
  download: boolean = false;
  actionPosition: any = {
    x: 0,
    y: 0,
  };
  reactions: any;

  subscription: Subscription;

  constructor(
    public route: ActivatedRoute,
    public documentService: DocumentService,
    private toastr: ToastrService,
    private http: HttpClient,
    public sanitizer: DomSanitizer,
    public router: Router,
    private elementRef: ElementRef
  ) {
    this.subscription = this.documentService.click$.subscribe((res: any) => {
      if (res == 'share') {
        this.shareDialogue = !this.shareDialogue;
        this.getDocumentDetails();
      } else if (res == 'exportAsPdf') {
        // this.captureAndDownloadPDF();
      } else if (res == 'move') {
        this.moveTeamDialogue = false;
      } else if (res == 'comment') {
        this.commentDialogue = false;
      } else if (res == 'editor') {
        this.chatBox = false;
        this.editor = !this.editor;
        this.index = -1;
      } else if (res == 'chatBox') {
        this.editor = false;
        this.chatBox = !this.chatBox;
        this.index = -1;
      }
    });
  }

  ngOnInit(): void {
    this.documentId = this.route.snapshot.params['document_id'];
    this.getDocumentDetails();
    this.getReactions();

  }

  getDocumentDetails(){
    if (this.documentId && /^\d+$/.test(this.documentId)) {
      this.getDocumentData();
      this.documentService.emitClickEvent(this.documentId);
    } else {
      this.getDocumentDataBySlug();
    }
  }


  indexFocus: any = -1;

  setFocusIndex(index: number) {
    this.indexText = index;
    const textareaId = `textareaRef${index}`;
    setTimeout(() => {
      const textareaElement = this.elementRef.nativeElement.querySelector(`#${textareaId}`);
      if (textareaElement) {
        textareaElement.focus();
      }
    }, 0);
  }


  getImage(image: any) {
    const data = {
      path: image,
    };
    this.documentService.getImage(data).subscribe({
      next: (res: any) => {
        return res.data;
      },
    });
  }

  convertBase64ToDataURL(base64: string): string {
    const type = 'image/png'; // Set the appropriate MIME type according to your base64 data
    const dataURL = `data:${type};base64,${base64}`;
    return dataURL;
  }

  captureAndDownloadPDF() {
    let image = 1;
    this.download = true;
    for (
      let index = 1;
      index < this.documentData.doument_steps.length;
      index++
    ) {
      const data = {
        path: this.documentData.doument_steps[index].image,
      };
      this.documentService.getImage(data).subscribe({
        next: (res: any) => {
          image++;
          if (this.documentData.doument_steps.length == image) {
            setTimeout(() => {
              // this.downloadPdf();
            }, 2000);
          }
          this.documentData.doument_steps[index].image = res.data;
        },
      });
    }
  }

  // downloadPdf() {
  //   html2canvas(this.pdfContent.nativeElement).then((canvas) => {
  //     let documentHeight = 100 * this.documentData.doument_steps.length;
  //     const contentDataURL = canvas.toDataURL('image/png');
  //     const pdf = new jsPDF('p', 'mm', [200, documentHeight]); // Create PDF object
  //     const imgWidth = 210; // A4 width in mm
  //     const imgHeight = (canvas.height * imgWidth) / canvas.width;
  //     // Calculate image height based on aspect ratio
  //     pdf.addImage(contentDataURL, 'PNG', 0, 0, imgWidth, imgHeight); // Add captured image to PDF
  //     pdf.save('capture.pdf'); // Save PDF
  //   });
  // }

  downloadImage(blobUrl: string) {
    this.http.get(blobUrl, {responseType: 'blob'}).subscribe((blob) => {
      const file = new File([blob], 'screenshot.png', {type: 'image/png'});
      const blobUrl = URL.createObjectURL(file);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = 'image.png';
      link.click();
      URL.revokeObjectURL(blobUrl);
    });
  }

  getDocumentData() {
    this.documentService.getDocument(this.documentId).subscribe({
      next: (res) => {
        this.documentData = res.data;
        this.toastr.success(res.message);
        setTimeout(() => {
          this.positioning();
        }, 2000);
      },
      error: (err) => {
        this.toastr.error(err.message);
      },
    });
  }

  getDocumentDataBySlug() {
    this.documentService.getDocumentBySlug(this.documentId).subscribe({
      next: (res) => {
        this.documentData = res.data;
        this.documentId = res.data.id;
        this.documentService.emitClickEvent(res.data.id);
        this.toastr.success(res.message);
        setTimeout(() => {
          this.positioning();
        }, 2000);
      },
      error: (err) => {
        this.toastr.error(err.message);
      },
    });
  }

  getOwnerName(data: any) {
    if (data) {
      let ownerData = data.find((arr: any) => arr.is_owner === 'Yes');
      return ownerData.users.first_name;
    }
  }

  addStep(i: number, type?: any) {
    this.initialStepToolbar = false;
    this.index = -1;
    let form: any = new FormData();
    form.append('document_id', this.documentId);
    form.append('name', 'New Step');
    form.append('action', 'Edit');
    if (type) {
      form.append('step_type', type);
    }

    this.documentService.createStep(form).pipe(
      mergeMap((res: any) => {
        this.toastr.success(res.message);
        this.documentData?.doument_steps.splice(i, 0, {
          name: 'New Step',
          action: 'Edit',
          document_id: this.documentId,
          order: res.data.order,
          id: res.data.id,
          step_type: res.data?.step_type
        });

        const newArray: any = this.documentData?.doument_steps.map((obj: any, index: any) => {
          return {
            step_id: obj.id,
            order: index + 1
          };
        });

        const orderData = {
          steps: newArray
        }
        // Replace 'anotherApiCall()' with your actual API call that accepts the 'newArray'
        return this.changeOrderDocument(orderData);
      })
    ).subscribe({
      next: (response) => {
        // Handle the response from the second API call
        console.log(response)
      },
      error: (error) => {
        this.toastr.error(error.message);
      }
    });
  }

  changeOrderDocument(data: any) {
    return this.documentService.changeOrderOfSteps(data);
  }


  updateStep(index: number, id: number, stepText?: any, imageInput?: any) {
    let form: any = new FormData();
    form.append('document_id', this.documentId);
    if (imageInput) {
      const file: File = imageInput.files ? imageInput.files[0] : imageInput;
      form.append('image', file);
    } else {
      form.append('name', stepText);
    }

    this.documentService.updateStep(form, id).subscribe({
      next: (res) => {
        this.toastr.success(res.message);
        this.indexText = -1;
        this.editText = false;
        this.documentData.doument_steps[index].image = res.data.image;
      },
      error: (err) => {
        this.toastr.error(err.message);
      },
    });
  }

  deleteStep(i: number, id: number) {
    if (i || i == 0) {
      this.documentData?.doument_steps.splice(i, 1);
      this.documentService.deleteStep(id).subscribe({
        next: (res) => {
          this.toastr.success(res.message);
        },
        error: (err) => {
          this.toastr.error(err.message);
        },
      });
    }
  }

  deleteDocuments(id: number) {
    this.documentService.deleteDocument(id).subscribe({
      next: (res) => {
        this.toastr.success(res.message);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.toastr.error(err.message);
      },
    });
  }

  duplicateDocument(id: any) {
    this.documentService.duplicateDocument(id).subscribe({
      next: (res) => {
        this.toastr.success(res.message);
      },
      error: (err) => {
        this.toastr.error(err.message);
      },
    });
  }

  // positioning() {
  //   setTimeout(() => {
  //     for (let i = 0; i < this.documentData?.doument_steps.length; i++) {
  //       let image = document.getElementById(
  //         'screenshot-' + i
  //       ) as HTMLImageElement;
  //       if (image && this.documentData?.doument_steps[i].position_x) {
  //         let renderedLeft =
  //           this.documentData?.doument_steps[i].position_x *
  //           (image?.clientWidth / image?.naturalWidth);
  //         let renderedTop =
  //           this.documentData?.doument_steps[i].position_y *
  //           (image?.clientHeight / image?.naturalHeight);
  //         if (renderedLeft > 700) {
  //           if (renderedLeft - 700 > 700) {
  //             let imageLeft = renderedLeft - 700 + 100 + 22;
  //             let dotLeft = renderedLeft - imageLeft;
  //             this.documentData.doument_steps[i]['dotLeft'] = dotLeft;
  //             this.documentData.doument_steps[i]['imageLeft'] = -imageLeft;
  //           } else {
  //             let dotLeft = renderedLeft - 700;
  //             this.documentData.doument_steps[i]['dotLeft'] = dotLeft;
  //             this.documentData.doument_steps[i]['imageLeft'] =
  //               dotLeft - renderedLeft;
  //           }
  //         } else {
  //           let dotLeft = renderedLeft;
  //           this.documentData.doument_steps[i]['dotLeft'] = dotLeft - 66;
  //         }

  //         // if (renderedTop > 400) {
  //         //   if ((renderedTop - 400) > 400) {
  //         //     let imageTop = (renderedTop - 400);
  //         //     let dotTop = (renderedTop - imageTop);
  //         //     this.workflowData.workFlow[i]['dotTop'] = dotTop ;
  //         //      this.workflowData.workFlow[i]['imageTop'] = -imageTop ;
  //         //     }
  //         //     else {
  //         //       let dotTop = (renderedTop - 400) ;
  //         //        this.workflowData.workFlow[i]['dotTop'] = dotTop ;
  //         //         this.workflowData.workFlow[i]['imageTop'] =( dotTop  - renderedTop )
  //         //       }
  //         //     } else {
  //         //       let dotTop = (renderedTop);
  //         //        this.workflowData.workFlow[i]['dotTop'] = dotTop - 66 ;
  //         //     }
  //       }
  //     }
  //   }, 1000);
  // }

  // positioning() {
  //   setTimeout(() => {
  //     for (let i = 0; i < this.documentData?.doument_steps.length; i++) {
  //       const image = document.getElementById('screenshot-' + i) as HTMLImageElement;
  //       const data = this.documentData?.doument_steps[i];

  //       if (image && data.position_x && data.position_y) {
  //         const container = image.parentElement;
  //         const containerWidth:any = container?.clientWidth;
  //         const containerHeight:any = container?.clientHeight;

  //         // Calculate the position of the image within the container
  //         const clickX = data.position_x;
  //         const clickY = data.position_y;
  //         const newX = (containerWidth / 2) - clickX;
  //         const newY = (containerHeight / 2) - clickY;

  //         // Apply the new position to the image element
  //         image.style.left = `${newX}px`;
  //         image.style.top = `${newY}px`;
  //       }
  //     }
  //   }, 1000);
  // }
  positioning() {
    setTimeout(() => {
      for (let i = 0; i < this.documentData?.doument_steps.length; i++) {
        const image = document.getElementById('screenshot-' + i) as HTMLImageElement;
        const data = this.documentData?.doument_steps[i];

        if (image && data.position_x && data.position_y) {
          const container = image.parentElement;
          const containerWidth: any = container?.clientWidth;
          const containerHeight: any = container?.clientHeight;
          const imageWidth = image.width;
          const imageHeight = image.height;

          // Calculate the position of the image within the container
          const clickX = data.position_x;
          const clickY = data.position_y;
          let newX = (containerWidth / 2) - clickX;
          let newY = (containerHeight / 2) - clickY;

          // Adjust newX and newY to keep the image within the visible range
          if (newX > 0) {
            newX = 0;
          } else if (newX < containerWidth - imageWidth) {
            newX = containerWidth - imageWidth;
          }

          if (newY > 0) {
            newY = 0;
          } else if (newY < containerHeight - imageHeight) {
            newY = containerHeight - imageHeight;
          }

          // Apply the new position to the image element
          image.style.left = `${newX}px`;
          image.style.top = `${newY}px`;
        }
      }
    }, 1000);
  }


  ngOnDestroy() {
    this.subscription.unsubscribe();
    if (this.imageEditor && this.imageEditor.shown == true) {
      this.imageEditor.hide();
    }
  }

  expandView(imageUrl: any, x: number, y: number) {
    this.previewImage = imageUrl;
    // this.dialog.open(ImageModalComponent, {
    //   panelClass: 'image-modal',
    //   data: {
    //     imageUrl: imageUrl,
    //     x: x,
    //     y: y,
    //   },
    // });

    this.previewModal = true;
    this.positioningPreview(x, y);
  }

  positioningPreview(x: number, y: number) {
    setTimeout(() => {
      let image = document.getElementById('image-expanded') as HTMLImageElement;
      let renderedLeft = x * (image?.clientWidth / image?.naturalWidth);
      let renderedTop = y * (image?.clientHeight / image?.naturalHeight);
      this.actionPosition.x = renderedLeft - 20;
      this.actionPosition.y = renderedTop - 20;
    }, 1000);
  }

  closeModal() {
    this.previewModal = false;
  }

  insertIntoString(str: string, pos: number, fragment: string) {
    return str.slice(0, pos) + fragment + str.slice(pos + 1, str.length);
  }

  addAnchorsToText(text: any) {
    const regexp: any =
      /((?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+%,;=.]+)/gim;
    const map: any = {};
    return text.replace(regexp, (_: any, match: any, __: any, pos: any) => {
      // This map helps us to keep a count of the duplicate matches.
      if (map[match] !== undefined) map[match]++;
      else map[match] = 0;

      // These next few lines handle duplicates. We want to handle cases like this:
      // <a href="myurl.com">foo</a> bar baz myurl.com.
      let testString = text.replace(new RegExp(escapeRegExp(match), 'ig'), '$');
      let newPos = pos - map[match] * (match.length - 1);
      testString = this.insertIntoString(testString, newPos, match);

      // Detect if the url was found here -> <a href="#here#">
      const hrefRegex = new RegExp(
        `<a[^>]*href="${escapeRegExp(match)}"[^>]*>[^<]*<\/a>`,
        'ig'
      );
      const isHref = hrefRegex.test(testString);

      // Detect if the url was found here -> <a href="...">#here#</a>
      const anchoredRegex = new RegExp(
        `<a[^>]*>[^<]*${escapeRegExp(match)}[^<]*<\/a>`,
        'ig'
      );
      const isAnchored = anchoredRegex.test(testString);

      // If the url is found in href or anchor, then do nothing with it, it needs no further treatment.
      if (isAnchored || isHref) return match;
      const hasProtocol = /^http[s]?:\/\/.*$/gim.test(match);
      return `<a class='text-[#517DEF]' href="${
        hasProtocol ? '' : 'http://'
      }${match}" target="_blank" rel="noopener noreferrer">${match}</a>`;
    });

    function escapeRegExp(text: any) {
      return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
    }
  }

  getReactions() {
    this.documentService.getReactionEmoji().subscribe({
      next: (res: any) => {
        this.reactions = res.data;
      },
      error: (err: any) => {
      },
    });
  }

  reactOnDoc(emojiId: any) {
    const data = {
      document_id: this.documentId,
      emoji_id: emojiId,
    };
    this.documentService.reactionOnDocument(data).subscribe({
      next: (res: any) => {
        console.log(res);

      },
      error: (err: any) => {
        console.log(err);

      },
    });
  }

  editScreenshot(index: any, id: any, blobUrl: string) {
    this.imageEditor = Painterro({
      saveByEnter: true,
      extraFonts: ['Poppins'],
      activeColor: '#5B61F3',
      hiddenTools: ['clear'],
      colorScheme: {
        main: '#F6F8FF',
        control: '#FFFFFF',
        controlContent: '#5B61F3',
        activeControl: '#5B61F3',
        activeControlContent: '#FFFFFF',
        hoverControl: '#5B61F3',
        hoverControlContent: '#FFFFFF',
        inputBackground: '#FFFFFF',
        dragOverBarColor: '#5B61F3',
      },
      saveHandler: (image: any, done: any) => {
        this.updateStep(index, id, undefined, image.asBlob())
        done(true);
      }
    })
    this.imageEditor.show(blobUrl);
  }

  updateDocument(id: number, docTitle: any) {
    let form: any = new FormData();
    form.append('name', docTitle);
    this.documentService.updateDocument(form, id).subscribe({
      next: (res) => {
        this.toastr.success(res.message);
      },
      error: (err) => {
        this.toastr.error(err.message);
      },
    });
  }

  downloadPageAsHtml() {
    const htmlString = document.documentElement.outerHTML;
    const blob = new Blob([htmlString], {type: 'text/html'});
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'page.html';
    link.click();
    URL.revokeObjectURL(url);
  }

  getReactionsCunt(){
    console.log(this.documentData.reactions)
    console.log(this.reactions)
  }

  reactionOccurrences: { name: string, count: any, image: any }[] = [];


  countreactionOccurrences() {
    const occurrences:any = {};

    for (const item of this.documentData.reactions) {
      const name:any = item.emoji.name;
      occurrences[name] = occurrences[name] + 1 || 1;
    }

    this.reactionOccurrences = Object.entries(occurrences).map(([name, count]) => ({
      name,
      count,
      image: this.documentData.reactions.find((item:any) => item.emoji.name === name)?.emoji.image || ''
    }));

    console.log(this.reactionOccurrences)
  }

}
