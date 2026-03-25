// render.js — Grid, meta bar, and filter rendering

import { plantas, categorias } from './data.js';
import { filtrar, getFiltroCategoria, getFiltroPeligrosidad, getFiltroStock,
         toggleCategoria, togglePeligro, toggleStock, setSearchText } from './filters.js';
import { openModal } from './modal.js';

// Expose openModal globally for onclick handlers
window._openModal = openModal;

function renderMeta() {
    const t = plantas.length;
    const h = plantas.filter(p => p.tenemos).length;
    const peligro = plantas.filter(p => p.peligrosidad === "alta").length;
    document.getElementById("meta-bar").innerHTML = `
        <div><div class="meta-num">${t}</div><div class="meta-label">Plantas</div></div>
        <div><div class="meta-num">${h}</div><div class="meta-label">En stock</div></div>
        <div><div class="meta-num">${t - h}</div><div class="meta-label">Por comprar</div></div>
        <div><div class="meta-num">${peligro}</div><div class="meta-label">Peligro alto</div></div>
    `;
}

function renderFilters() {
    const filtroCategoria = getFiltroCategoria();
    const filtroPeligrosidad = getFiltroPeligrosidad();
    const filtroStock = getFiltroStock();

    const cats = [...new Set(plantas.map(p => p.categoria))];
    let catBtns = `<button class="filter-btn ${!filtroCategoria ? 'active' : ''}" data-action="cat" data-val="">Todas</button>`;
    cats.forEach(c => {
        const info = categorias[c];
        catBtns += `<button class="filter-btn ${filtroCategoria === c ? 'active' : ''}" data-action="cat" data-val="${c}">
            <span class="filter-dot ${info.dot}"></span>${info.label}
        </button>`;
    });

    let statusBtns = `
        <button class="filter-btn ${filtroPeligrosidad === 'alta' ? 'active' : ''}" data-action="peligro" data-val="alta">
            <span class="filter-dot" style="background:var(--danger)"></span>Peligro alto
        </button>
        <button class="filter-btn ${filtroPeligrosidad === 'media' ? 'active' : ''}" data-action="peligro" data-val="media">
            <span class="filter-dot" style="background:var(--caution)"></span>Precaucion
        </button>
    `;

    let stockBtns = `
        <button class="filter-btn ${filtroStock === 'have' ? 'active' : ''}" data-action="stock" data-val="have">En stock</button>
        <button class="filter-btn ${filtroStock === 'want' ? 'active' : ''}" data-action="stock" data-val="want">Por comprar</button>
    `;

    document.getElementById("filter-bar").innerHTML = `
        <div class="filter-group">${catBtns}</div>
        <div class="filter-group">${statusBtns}</div>
        <div class="filter-group">${stockBtns}</div>
    `;
}

function renderGrid() {
    const list = filtrar();
    const grid = document.getElementById("grid");

    if (!list.length) {
        grid.innerHTML = `<div class="no-results"><h3>Sin resultados</h3><p>Prueba otra combinacion de filtros.</p></div>`;
        return;
    }

    grid.innerHTML = list.map(p => {
        const cat = categorias[p.categoria];
        const stampClass = p.peligrosidad === "alta" ? "stamp-danger" : p.peligrosidad === "media" ? "stamp-caution" : "stamp-safe";
        const stampText = p.peligrosidad === "alta" ? "peligro<br>alto" : p.peligrosidad === "media" ? "precau-<br>cion" : "segura";
        const stockClass = p.tenemos ? "stock-have" : "stock-want";
        const stockText = p.tenemos ? "En stock" : "Por comprar";
        const escapedName = p.nombre.replace(/'/g, "\\'");

        return `
        <div class="card" onclick="window._openModal('${escapedName}')">
            <div class="card-top-line" style="background:${cat.color}"></div>
            <div class="card-inner">
                <div class="card-stamp ${stampClass}">${stampText}</div>
                <div class="card-category-label">
                    <span class="cat-dot" style="background:${cat.color}"></span>
                    <span>${cat.label}</span>
                </div>
                <h2>${p.nombre}</h2>
                <p class="card-desc">${p.descripcion}</p>
                <div class="card-props">
                    ${p.propiedades.map(pr =>
                        `<span class="prop-tag">${pr.nombre} <span class="prop-dots"><span class="on">${'+'.repeat(pr.intensidad)}</span><span class="off">${'.'.repeat(3-pr.intensidad)}</span></span></span>`
                    ).join('')}
                </div>
            </div>
            <div class="card-footer">
                <span class="card-footer-cat">
                    <span class="cat-dot-sm" style="background:${cat.color}"></span>
                    ${cat.label}
                </span>
                <span class="card-stock ${stockClass}">${stockText}</span>
            </div>
        </div>`;
    }).join('');
}

export function renderAll() { renderMeta(); renderFilters(); renderGrid(); }

export function initControls() {
    // Search
    document.getElementById("search").addEventListener("input", e => {
        setSearchText(e.target.value);
        renderGrid();
    });

    // Filter buttons via event delegation
    document.getElementById("filter-bar").addEventListener("click", e => {
        const btn = e.target.closest(".filter-btn");
        if (!btn) return;
        const action = btn.dataset.action;
        const val = btn.dataset.val || null;
        if (action === "cat") toggleCategoria(val);
        else if (action === "peligro") togglePeligro(val);
        else if (action === "stock") toggleStock(val);
        renderAll();
    });
}
