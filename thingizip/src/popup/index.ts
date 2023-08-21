import '../app.css';
import Main from '../components/main.svelte';

const target = document.getElementById('app');

async function render() {
  new Main({ target });
}

document.addEventListener('DOMContentLoaded', render);