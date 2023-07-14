import {Directive, ElementRef, EventEmitter, HostListener, Input, Output} from '@angular/core';

@Directive({
  selector: '[appClickOutside]'
})
export class ClickOutsideDirective {
  @Input('appClickOutside') targetId!: any;
  @Output() clickOutside = new EventEmitter<Event>();

  constructor(private elementRef: ElementRef) {
  }

  @HostListener('document:click', ['$event'])
  onClick(event: Event) {
    const target = event.target as HTMLElement;
    const isClickedInside = this.elementRef.nativeElement.contains(target);
    const isClickedOnToggle = target.closest(`#${this.targetId}`) !== null;

    if (!isClickedInside && !isClickedOnToggle) {
      this.clickOutside.emit(event);
    }
  }
}
