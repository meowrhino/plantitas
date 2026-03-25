// filters.js — Filter state and logic

import { plantas, categorias } from './data.js';

let filtroCategoria = null;
let filtroPeligrosidad = null;
let filtroStock = null;
let searchText = "";

export function getSearchText() { return searchText; }
export function setSearchText(val) { searchText = val; }

export function filtrar() {
    return plantas.filter(p => {
        if (filtroCategoria && p.categoria !== filtroCategoria) return false;
        if (filtroPeligrosidad && p.peligrosidad !== filtroPeligrosidad) return false;
        if (filtroStock === "have" && !p.tenemos) return false;
        if (filtroStock === "want" && p.tenemos) return false;
        if (searchText) {
            const s = searchText.toLowerCase();
            return p.nombre.toLowerCase().includes(s)
                || p.descripcion.toLowerCase().includes(s)
                || p.propiedades.some(pr => pr.nombre.toLowerCase().includes(s))
                || p.contraindicaciones.some(c => c.toLowerCase().includes(s))
                || (p.nombreCientifico && p.nombreCientifico.toLowerCase().includes(s))
                || (p.usosColoquiales && p.usosColoquiales.some(u => u.toLowerCase().includes(s)));
        }
        return true;
    });
}

export function toggleCategoria(c) {
    filtroCategoria = filtroCategoria === c ? null : c;
}
export function togglePeligro(p) {
    filtroPeligrosidad = filtroPeligrosidad === p ? null : p;
}
export function toggleStock(s) {
    filtroStock = filtroStock === s ? null : s;
}

export function getFiltroCategoria() { return filtroCategoria; }
export function getFiltroPeligrosidad() { return filtroPeligrosidad; }
export function getFiltroStock() { return filtroStock; }
