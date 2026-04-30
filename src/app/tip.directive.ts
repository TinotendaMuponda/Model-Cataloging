import {
  Directive, ElementRef, HostListener, Input,
  OnDestroy, Renderer2
} from '@angular/core';

/**
 * [tip]="'Your text'"
 *
 * Appends the bubble directly to <body> with position:fixed so it
 * always floats above every stacking context, overflow:hidden container,
 * and table element.
 */
@Directive({ selector: '[tip]' })
export class TipDirective implements OnDestroy {
  @Input() tip = '';

  private bubble: HTMLElement | null = null;
  private arrow: HTMLElement | null = null;

  constructor(private el: ElementRef<HTMLElement>, private renderer: Renderer2) {}

  @HostListener('mouseenter') onEnter() { this.show(); }
  @HostListener('mouseleave') onLeave() { this.hide(); }
  @HostListener('focusin')    onFocus() { this.show(); }
  @HostListener('focusout')   onBlur()  { this.hide(); }

  private show() {
    if (!this.tip || this.bubble) return;

    // ── Arrow ──────────────────────────────────────────────
    this.arrow = this.renderer.createElement('div');
    this.renderer.addClass(this.arrow, 'tip-arrow');

    // ── Bubble ─────────────────────────────────────────────
    this.bubble = this.renderer.createElement('div');
    this.renderer.addClass(this.bubble, 'tip-bubble');
    this.renderer.setProperty(this.bubble, 'textContent', this.tip);

    this.renderer.appendChild(document.body, this.arrow);
    this.renderer.appendChild(document.body, this.bubble);

    this.position();

    // Trigger CSS fade-in on next frame
    requestAnimationFrame(() => {
      if (this.bubble) this.renderer.addClass(this.bubble, 'tip-visible');
      if (this.arrow)  this.renderer.addClass(this.arrow,  'tip-visible');
    });
  }

  private hide() {
    if (this.bubble) { this.renderer.removeChild(document.body, this.bubble); this.bubble = null; }
    if (this.arrow)  { this.renderer.removeChild(document.body, this.arrow);  this.arrow  = null; }
  }

  private position() {
    if (!this.bubble || !this.arrow) return;

    const GAP    = 8;   // px between trigger bottom and bubble top
    const MARGIN = 10;  // min distance from viewport edges

    const rect   = this.el.nativeElement.getBoundingClientRect();
    const bw     = this.bubble.offsetWidth  || 240;
    const bh     = this.bubble.offsetHeight || 60;
    const vw     = window.innerWidth;
    const vh     = window.innerHeight;

    // Preferred: above the trigger
    let top = rect.top - bh - GAP;
    const arrowBelow = top >= MARGIN; // arrow points down when bubble is above

    // Flip below if not enough space above
    if (top < MARGIN) {
      top = rect.bottom + GAP;
    }

    // Horizontal: centre on trigger, clamp to viewport
    let left = rect.left + rect.width / 2 - bw / 2;
    left = Math.max(MARGIN, Math.min(left, vw - bw - MARGIN));

    this.renderer.setStyle(this.bubble, 'top',  `${top}px`);
    this.renderer.setStyle(this.bubble, 'left', `${left}px`);

    // Position arrow
    const arrowSize = 6;
    const arrowLeft = rect.left + rect.width / 2;
    this.renderer.setStyle(this.arrow, 'left', `${arrowLeft}px`);

    if (arrowBelow) {
      // Bubble is above — arrow sits between bubble bottom and trigger top
      this.renderer.setStyle(this.arrow, 'top',       `${rect.top - GAP + 1}px`);
      this.renderer.setStyle(this.arrow, 'transform', 'translateX(-50%)');
      this.renderer.removeClass(this.arrow, 'tip-arrow-up');
      this.renderer.addClass(this.arrow, 'tip-arrow-down');
    } else {
      // Bubble is below — arrow sits between trigger bottom and bubble top
      this.renderer.setStyle(this.arrow, 'top',       `${rect.bottom + 1}px`);
      this.renderer.setStyle(this.arrow, 'transform', 'translateX(-50%)');
      this.renderer.removeClass(this.arrow, 'tip-arrow-down');
      this.renderer.addClass(this.arrow, 'tip-arrow-up');
    }
  }

  ngOnDestroy() { this.hide(); }
}
