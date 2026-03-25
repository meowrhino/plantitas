// app.js — Entry point

import { cargarPlantas } from './data.js';
import { renderAll, initControls } from './render.js';
import { initModalListeners } from './modal.js';

async function init() {
    try {
        await cargarPlantas();
        renderAll();
        initControls();
        initModalListeners();
    } catch (err) {
        document.getElementById("grid").innerHTML = `
            <div class="no-results">
                <h3>Error al cargar las plantas</h3>
                <p>No se pudo cargar el catalogo. Recarga la pagina para intentarlo de nuevo.</p>
            </div>`;
    }
}

init();
