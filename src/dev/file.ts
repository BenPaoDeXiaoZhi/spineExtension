import { Container } from '../util/storage';
const NAME = 'test';
if (customElements.get(NAME)) {
    customElements.define(NAME, Container);
}
const container = document.createElement(NAME);
document.body.appendChild(container);
