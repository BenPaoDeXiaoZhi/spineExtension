import { Container } from '../util/storage';
const NAME = 'container-test';
if (!customElements.get(NAME)) {
    customElements.define(NAME, Container);
}
const container = document.createElement(NAME);
document.body.appendChild(container);
document.body.style.height = '100vh';
document.body.style.margin = '0';
