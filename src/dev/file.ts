import { Container } from '../util/storage';
const NAME = 'container-test';
if (!customElements.get(NAME)) {
    customElements.define(NAME, Container);
}

const open = document.createElement('button');
open.innerText = 'open modal';
open.addEventListener('click', (e) => {
    const container = document.createElement(NAME) as Container;
    document.body.appendChild(container);
    container.showModal();
});
document.body.appendChild(open);
document.body.style.height = '100vh';
document.body.style.margin = '0';
