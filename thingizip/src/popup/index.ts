import "../app.css";
import Card from '../components/card.svelte';

const target = document.getElementById('app');


async function render() {
    new Card({target});
}

document.addEventListener('DOMContentLoaded', render);