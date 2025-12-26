import { HTMLReport } from '../util/htmlReport';
import { ObjectKVReport } from '../util/spineReports';

const container = document.createElement('div');
container.innerHTML = '<a>report';
const hr = new HTMLReport(container, { a: 'b' }, 'monitor');
console.log(hr);

const kvr = new ObjectKVReport(
    () => Date.name,
    'green',
    () => {
        return { [Date.now()]: 'a' };
    },
    'hello',
    'monitor'
);
console.log(kvr);

setInterval(() => {
    console.log(hr.replace());
    console.log(kvr.replace());
}, 1000);

Object.assign(window, {
    HTMLReport,
    ObjectKVReport,
});
