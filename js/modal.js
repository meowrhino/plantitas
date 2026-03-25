// modal.js — Modal rendering with all enriched fields

import { plantas, categorias } from './data.js';

export function openModal(nombre) {
    const p = plantas.find(pl => pl.nombre === nombre);
    if (!p) return;
    const cat = categorias[p.categoria];
    const safetyClass = p.peligrosidad === "alta" ? "safety-danger" : p.peligrosidad === "media" ? "safety-caution" : "safety-safe";
    const safetyBadge = p.peligrosidad === "alta" ? "mbadge-danger" : p.peligrosidad === "media" ? "mbadge-caution" : "mbadge-safe";
    const safetyLabel = p.peligrosidad === "alta" ? "Peligro alto" : p.peligrosidad === "media" ? "Precaucion" : "Segura";

    let html = `
        <button class="modal-close" id="modal-close-btn" aria-label="Cerrar">&times;</button>
        <div class="modal-top-line" style="background:${cat.color}"></div>
        <div class="modal-header">
            <div class="modal-category-bar">
                <span class="modal-cat-dot" style="background:${cat.color}"></span>
                <span class="modal-cat-label">${cat.label}</span>
            </div>
            <h2>${p.nombre}</h2>
            ${p.nombreCientifico ? `<div class="modal-scientific">${p.nombreCientifico}</div>` : ''}
            <div class="modal-badges">
                <span class="modal-badge ${safetyBadge}">${safetyLabel}</span>
                <span class="modal-badge ${p.tenemos ? 'mbadge-have' : 'mbadge-want'}">${p.tenemos ? 'En stock' : 'Por comprar'}</span>
            </div>
        </div>

        <div class="modal-section">
            <div class="modal-section-title">Descripcion</div>
            <p>${p.descripcion}</p>
        </div>`;

    // Detail grid (sabor, parte utilizada, momento, dosis, etc.)
    const details = [];
    if (p.parteUtilizada) details.push({ label: "Parte utilizada", value: p.parteUtilizada });
    if (p.sabor) details.push({ label: "Sabor", value: p.sabor });
    if (p.mejorMomento) details.push({ label: "Mejor momento", value: p.mejorMomento });
    if (p.temperatura) details.push({ label: "Temperatura", value: p.temperatura });
    if (p.tiempoInfusion) details.push({ label: "Tiempo de infusion", value: p.tiempoInfusion });
    if (p.dosisMaxima) details.push({ label: "Dosis maxima", value: p.dosisMaxima });
    if (p.duracionMaximaUso) details.push({ label: "Duracion maxima", value: p.duracionMaximaUso });

    if (details.length) {
        html += `
        <div class="modal-section">
            <div class="modal-section-title">Ficha tecnica</div>
            <div class="modal-detail-grid">
                ${details.map(d => `
                    <div class="modal-detail-item">
                        <div class="modal-detail-label">${d.label}</div>
                        <div class="modal-detail-value">${d.value}</div>
                    </div>
                `).join('')}
            </div>
        </div>`;
    }

    // Propiedades
    html += `
        <div class="modal-section">
            <div class="modal-section-title">Propiedades</div>
            <div class="modal-props-list">
                ${p.propiedades.map(pr => `
                    <div class="modal-prop-row">
                        <span class="modal-prop-name">${pr.nombre}</span>
                        <div class="modal-prop-dots">
                            ${[1,2,3].map(i => `<div class="modal-dot ${i <= pr.intensidad ? 'filled' : ''}"></div>`).join('')}
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>`;

    // Usos coloquiales
    if (p.usosColoquiales && p.usosColoquiales.length) {
        html += `
        <div class="modal-section">
            <div class="modal-section-title">Para que se usa</div>
            <div class="modal-usos">
                ${p.usosColoquiales.map(u => `<span class="modal-uso-tag">${u}</span>`).join('')}
            </div>
        </div>`;
    }

    // Combinaciones
    if (p.combinaciones && p.combinaciones.length) {
        html += `
        <div class="modal-section">
            <div class="modal-section-title">Combina bien con</div>
            <div class="modal-combos">
                ${p.combinaciones.map(c => `<span class="modal-combo-tag">${c}</span>`).join('')}
            </div>
        </div>`;
    }

    // Seguridad
    html += `
        <div class="modal-section">
            <div class="modal-section-title">Seguridad</div>
            <div class="modal-safety-box ${safetyClass}">${p.seguridad}</div>
        </div>`;

    // Contraindicaciones
    html += `
        <div class="modal-section">
            <div class="modal-section-title">Contraindicaciones</div>
            <ul class="modal-list">
                ${p.contraindicaciones.map(c => `<li>${c}</li>`).join('')}
            </ul>
        </div>`;

    // Interacciones
    if (p.interaccionesMedicamentos && p.interaccionesMedicamentos.length) {
        html += `
        <div class="modal-section">
            <div class="modal-section-title">Interacciones con medicamentos</div>
            <ul class="modal-list">
                ${p.interaccionesMedicamentos.map(i => `<li>${i}</li>`).join('')}
            </ul>
        </div>`;
    }

    // Preparacion
    html += `
        <div class="modal-section">
            <div class="modal-section-title">Preparacion</div>
            <div class="modal-prep-box">${p.preparacion}</div>
        </div>`;

    // Historia
    if (p.historia) {
        const h = p.historia;
        html += `
        <div class="modal-section">
            <div class="modal-section-title">Historia y curiosidades</div>
            <div class="modal-history-block">
                ${h.etimologia ? `<div class="modal-history-item"><h4>Etimologia</h4><p>${h.etimologia}</p></div>` : ''}
                ${h.origen ? `<div class="modal-history-item"><h4>Origen</h4><p>${h.origen}</p></div>` : ''}
                ${h.usoAntiguo ? `<div class="modal-history-item"><h4>Uso historico</h4><p>${h.usoAntiguo}</p></div>` : ''}
                ${h.datoCurioso ? `<div class="modal-history-item"><h4>Dato curioso</h4><p>${h.datoCurioso}</p></div>` : ''}
            </div>
        </div>`;
    }

    // Recomendacion (solo para las que no tenemos)
    if (p.recomendacion && !p.tenemos) {
        html += `
        <div class="modal-section">
            <div class="modal-reco-box">
                <strong>Por que tenerla</strong>
                <p>${p.recomendacion}</p>
            </div>
        </div>`;
    }

    document.getElementById("modal").innerHTML = html;
    document.getElementById("modal-overlay").classList.add("visible");
    document.body.style.overflow = "hidden";

    document.getElementById("modal-close-btn").addEventListener("click", closeModal);
}

export function closeModal() {
    document.getElementById("modal-overlay").classList.remove("visible");
    document.body.style.overflow = "";
}

export function initModalListeners() {
    document.getElementById("modal-overlay").addEventListener("click", e => {
        if (e.target.id === "modal-overlay") closeModal();
    });
    document.addEventListener("keydown", e => { if (e.key === "Escape") closeModal(); });
}
