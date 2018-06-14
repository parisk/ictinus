export class SplitLayout {
  public readonly elementA: HTMLElement;
  public readonly gutter: HTMLElement;
  public readonly elementB: HTMLElement;
  private readonly dimension: 'width' | 'height';
  private readonly axis: 'clientX' | 'clientY';
  private readonly rectAxis: 'left' | 'top';
  private max: number;
  private rect: DOMRect;

  constructor(
  public readonly container: HTMLElement,
   public readonly orientation: 'horizontal' | 'vertical',
   public readonly min: number = 100)
  {
    this.dimension = (this.orientation == 'horizontal') ? 'width' : 'height';
    this.axis = (this.orientation == 'horizontal') ? 'clientX' : 'clientY';
    this.rectAxis = (this.orientation == 'horizontal') ? 'left' : 'top';

    this.container.classList.add('split-layout-container', `split-${this.orientation}`);
    this.gutter = this.container.querySelector('.split-layout-gutter');

    this.gutter.addEventListener('mousedown', this.startResize);
  }

  public resize = e => {
    const pos = e[this.axis] - this.rect[this.rectAxis];

    if (pos < this.min || pos > this.max) {
      return;
    }

    const ratio = pos / this.rect[this.dimension] * 100;

    if (this.orientation == 'horizontal') {
      const gridTemplateColumns = `${ratio.toFixed(3)}% 5px 5px auto`;
      this.container.style.gridTemplateColumns = gridTemplateColumns;
    } else {
      const gridTemplateRows = `${ratio.toFixed(3)}% 5px 5px auto`;
      this.container.style.gridTemplateRows = gridTemplateRows;
    }
  }

  public startResize = e => {
    e.stopPropagation();
    this.rect = <DOMRect>this.container.getBoundingClientRect();
    this.max = this.rect[this.dimension] - this.min;
    this.container.addEventListener('mousemove', this.resize);
    window.addEventListener('mouseup', this.stopResize);
  }

  public stopResize = e => {
    e.stopPropagation();
    this.container.removeEventListener('mousemove', this.resize);
  }
}
