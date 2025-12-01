import { Container } from '../util/storage';
const NAME = 'container-test';
if (!customElements.get(NAME)) {
    customElements.define(NAME, Container);
}

const open = document.createElement('button');
open.innerText = 'open modal';
open.addEventListener('click', (e) => {
    const container = document.createElement(NAME);
    document.body.appendChild(container);
});
document.body.appendChild(open);
document.body.style.height = '100vh';
document.body.style.margin = '0';
