import * as chai from 'chai';
import * as spies from 'chai-spies';

import { SplitLayout } from './split';


chai.use(spies);

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

    chai.spy.on(container, 'addEventListener');
    chai.spy.on(window, 'addEventListener');

    // Dispatch the `mousedown` event, in order to trigger #startResize
    const mouseDownEvent = document.createEvent('HTMLEvents')
    mouseDownEvent.initEvent('mousedown', false, true);
    layout.gutter.dispatchEvent(mouseDownEvent);

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
  })
});
