import { HTMLReport } from '../util/htmlReport';
console.log(new HTMLReport('report', { a: 'b' }, 'monitor'));
Object.assign(window, {
    HTMLReport,
});
