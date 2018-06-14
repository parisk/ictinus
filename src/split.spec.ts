import * as chai from 'chai';
import * as spies from 'chai-spies';

import { SplitLayout } from './split';


chai.use(spies);


describe('SplitLayout', () => {
  describe('#constructor', () => {
    const container = document.createElement('div');
    const elementA = document.createElement('div')
    const gutter = document.createElement('div');
    const elementB = document.createElement('div')

    elementA.classList.add('split-layout-element');
    gutter.classList.add('split-layout-gutter');
    elementB.classList.add('split-layout-element');

    container.appendChild(elementA);
    container.appendChild(gutter);
    container.appendChild(elementB);

    gutter.addEventListener = chai.spy();

    const layout = new SplitLayout(container, 'horizontal');

    it('should add the appropriate classes to the SplitLayout container', () => {
      chai.assert.isTrue(container.classList.contains('split-layout-container'));
      chai.assert.isTrue(container.classList.contains('split-horizontal'));
    });

    it('should add the appropriate mousedown callback to the gutter', () => {
      chai.expect(gutter.addEventListener).to.have.been.called.once.with(
        'mousedown', <any>layout.startResize,
      );
    });
  });
});
