// app.js — Entry point

import { cargarPlantas } from './data.js';
import { renderAll, initControls } from './render.js';
import { initModalListeners } from './modal.js';

async function init() {
    await cargarPlantas();
    renderAll();
    initControls();
    initModalListeners();
}

init();
