import { HTMLReport } from '../util/htmlReport';
const container = document.createElement("div")
container.innerText="report"
console.log(new HTMLReport(container, { a: 'b' }, 'monitor'));
Object.assign(window, {
    HTMLReport,
});
