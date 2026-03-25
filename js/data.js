// data.js — Category definitions and data loading

export const categorias = {
    relajante:    { label: "Relajante",     color: "#8a9cc4", dot: "cat-relajante" },
    digestiva:    { label: "Digestiva",     color: "#c4a84e", dot: "cat-digestiva" },
    respiratoria: { label: "Respiratoria",  color: "#5aaa96", dot: "cat-respiratoria" },
    circulatoria: { label: "Circulatoria",  color: "#c07074", dot: "cat-circulatoria" },
    depurativa:   { label: "Depurativa",    color: "#6ea05a", dot: "cat-depurativa" },
    inmune:       { label: "Inmunológica",  color: "#9580ba", dot: "cat-inmune" },
    urinaria:     { label: "Urinaria",      color: "#5a9ab4", dot: "cat-urinaria" },
    hormonal:     { label: "Hormonal",      color: "#a85a96", dot: "cat-hormonal" },
    piel:         { label: "Piel / Tópica", color: "#b48a5a", dot: "cat-piel" },
    especias:     { label: "Especia",       color: "#c98a5a", dot: "cat-especias" },
    general:      { label: "General",       color: "#8a857c", dot: "cat-general" }
};

export let plantas = [];

export async function cargarPlantas() {
    const res = await fetch("data/plantas.json");
    plantas = await res.json();
    return plantas;
}
