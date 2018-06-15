import * as chai from 'chai';
import * as spies from 'chai-spies';

import { SplitLayout } from './split';


chai.use(spies);


// This does not look implemented by JSDOM, so we implement it here. It's quite straighforward.
// Implementation details: https://developer.mozilla.org/en-US/docs/Web/API/DOMRect/DOMRect
class DOMRect {
  public readonly left: number;
  public readonly top: number;

  constructor(
    public readonly x: number,
    public readonly y: number,
    public readonly width: number,
    public readonly height: number)
  {
    this.left = this.x;
    this.top = this.y;
  }
}


describe('SplitLayout', () => {
  describe('#constructor', () => {
    const container = document.createElement('div');
    const gutter = document.createElement('div');

    gutter.addEventListener = chai.spy();

    const layout = new SplitLayout(container, 'horizontal', 100, undefined, gutter);

    it('should add the appropriate classes to the SplitLayout container', () => {
      chai.assert.isTrue(container.classList.contains('split-layout-container'));
      chai.assert.isTrue(container.classList.contains('split-horizontal'));
    });

    it('should add the appropriate `mousedown` callback on the gutter', () => {
      chai.expect(gutter.addEventListener).to.have.been.called.once.with(
        'mousedown', <any>layout.startResize,
      );
    });
  });

  describe('#startResize', () => {
    const container = document.createElement('div');
    const layout = new SplitLayout(container, 'horizontal');
    const mouseDownEvent = document.createEvent('HTMLEvents');

    before(() => {
      chai.spy.on(container, 'addEventListener');
      chai.spy.on(window, 'addEventListener');

      // Dispatch the `mousedown` event, in order to trigger #startResize
      mouseDownEvent.initEvent('mousedown', false, true);
      layout.gutter.dispatchEvent(mouseDownEvent);
    });

    it('should set the appropriate `mousemove` callback on the container', () => {
      chai.expect(container.addEventListener).to.have.been.called.once.with(
        'mousemove', <any>layout.resize,
      );
    });

    it('should set the appropriate `mouseup` callback on the window', () => {
      chai.expect(window.addEventListener).to.have.been.called.once.with(
        'mouseup', <any>layout.stopResize,
      );
    });

    after(() => {
      const spy = <any>(chai.spy);
      spy.restore(window, 'addEventListener');
      spy.restore(container, 'addEventListener');
    });
  });

  describe('#resize', () => {
    const horizontalContainer = document.createElement('div');
    const horizontalLayout = new SplitLayout(horizontalContainer, 'horizontal');
    const verticalContainer = document.createElement('div');
    const verticalLayout = new SplitLayout(verticalContainer, 'vertical');
    const mouseDownEvent = new MouseEvent('mousedown', {});

    // HACK: We will reuse a single event to test two layouts, since `clientX` and `clientY`
    // do not interfere with each other.
    const mouseMoveEvent = new MouseEvent('mousemove', {
      clientX: 940, // Set clientX for the horizontal resizing
      clientY: 280, // Set clientY for the vertical resizing
    });

    // Create a 800px ⨉ 400px DOMRect with 100px distance from the top of the screen and
    // 600px distance from the left of the screen.
    const rect = new DOMRect(600, 100, 800, 400);

    before(() => {
      chai.spy.on(horizontalLayout, 'setSize');
      chai.spy.on(verticalLayout, 'setSize');

      // The `getBoundingClientRect` method of each layout's container should return the
      // `rect` object created above.
      chai.spy.on(horizontalLayout.container, 'getBoundingClientRect', <any>(() => rect));
      chai.spy.on(verticalLayout.container, 'getBoundingClientRect', <any>(() => rect));

      horizontalLayout.startResize(mouseDownEvent);
      verticalLayout.startResize(mouseDownEvent);
    });

    it('should call #setSize with the appropriate parameter', () => {
      horizontalLayout.resize(mouseMoveEvent);
      chai.expect(horizontalLayout.setSize).to.have.been.called.once.with(
        <any>340 // e.clientX .- rect.left
      );

      verticalLayout.resize(mouseMoveEvent);
      chai.expect(verticalLayout.setSize).to.have.been.called.once.with(
        <any>180 // e.clientY .- rect.top
      );
    });
  });

  describe('#setSize', () => {
    const horizontalContainer = document.createElement('div');
    const horizontalLayout = new SplitLayout(horizontalContainer, 'horizontal', 64);
    const verticalContainer = document.createElement('div');
    const verticalLayout = new SplitLayout(verticalContainer, 'vertical', 32);

    // Create a 800px ⨉ 400px DOMRect with 100px distance from the top of the screen and
    // 600px distance from the left of the screen.
    const rect = new DOMRect(600, 100, 800, 400);

    before(() => {
      const mouseDownEvent = new MouseEvent('mousedown', {});

      // The `getBoundingClientRect` method of each layout's container should return the
      // `rect` object created above.
      chai.spy.on(horizontalLayout.container, 'getBoundingClientRect', <any>(() => rect));
      chai.spy.on(verticalLayout.container, 'getBoundingClientRect', <any>(() => rect));

      horizontalLayout.startResize(mouseDownEvent);
      verticalLayout.startResize(mouseDownEvent);
    });

    it('should do nothing if the provided value exceeds min or max values', () => {
      const initialHorizontalStyle = horizontalLayout.container.style.gridTemplateColumns;
      const initialVerticalStyle = verticalLayout.container.style.gridTemplateRows;

      horizontalLayout.setSize(63);  // Too small
      chai.assert.equal(
        horizontalLayout.container.style.gridTemplateColumns, initialHorizontalStyle,
      );

      verticalLayout.setSize(31);  // Too small
      chai.assert.equal(
        verticalLayout.container.style.gridTemplateRows, initialVerticalStyle,
      );

      horizontalLayout.setSize(rect.width - 63);  // Too big
      chai.assert.equal(
        horizontalLayout.container.style.gridTemplateColumns, initialHorizontalStyle,
      );

      verticalLayout.setSize(rect.height - 31);  // Too big
      chai.assert.equal(
        verticalLayout.container.style.gridTemplateRows, initialVerticalStyle,
      );
    });

    it('should set the appropriate proportional grid dimensions', () => {
      horizontalLayout.setSize(160);  // 20% of 800px width
      chai.assert.equal(
        horizontalLayout.container.style.gridTemplateColumns,
        '20.000% 5px 5px auto',
      );

      verticalLayout.setSize(40);  // 10% of 400px height
      chai.assert.equal(
        verticalLayout.container.style.gridTemplateRows,
        '10.000% 5px 5px auto',
      );
    });
  });

  describe('#stopResize', () => {
    const container = document.createElement('div');
    const layout = new SplitLayout(container, 'horizontal');
    const mouseUpEvent = new MouseEvent('mouseup', {});

    before(() => {
      chai.spy.on(layout.container, 'removeEventListener');
      layout.stopResize(mouseUpEvent);
    });

    it('should remove the `resize` callback from the `mousemove` event on the container', () => {
      chai.expect(layout.container.removeEventListener).to.have.been.called.once.with(
        'mousemove', <any>layout.resize,
      );
    });
  });
});
