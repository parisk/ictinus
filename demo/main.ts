///<amd-module name='dist/main'/>

import { SplitLayout } from '../src/split';


console.debug('a');

new SplitLayout(document.querySelector('#horizontal-example'), 'horizontal');
new SplitLayout(document.querySelector('#vertical-example'), 'vertical', 20);
