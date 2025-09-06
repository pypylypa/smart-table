import "./fonts/ys-display/fonts.css";
import "./style.css";

import { data as sourceData } from "./data/dataset_1.js";

import { initData } from "./data.js";

import { processFormData } from "./lib/utils.js";

import { initTable } from "./components/table.js";
// @todo: подключение
import { initPagination } from "./components/pagination.js";
import { initSorting } from "./components/sorting.js";
import { initFiltering } from "./components/filtering.js";
import { initSearching } from "./components/searching.js";

// Исходные данные используемые в render()
const api = initData();

/**
 * Сбор и обработка полей из таблицы
 * @returns {Object}
 */
function collectState() {
    const state = processFormData(new FormData(sampleTable.container));
    const rowsPerPage = parseInt(state.rowsPerPage);
    const page = parseInt(state.page ?? 1);

    return {
        ...state,
        rowsPerPage,
        page,
    };
}

/**
 * Перерисовка состояния таблицы при любых изменениях
 * @param {HTMLButtonElement?} action
 */
async function render(action) {
    let state = collectState(); // состояние полей из таблицы
    let query = {}; // копируем для последующего изменения
    // @todo: использование
    result = applySearching(query, state, action);
    result = applyFiltering(query, state, action);
    result = applySorting(query, state, action);
    result = applyPagination(query, state, action);

    const { total, items } = await api.getRecords(query);

    updatePagination(total, query);

    sampleTable.render(items);
}

const sampleTable = initTable(
    {
        tableTemplate: "table",
        rowTemplate: "row",
        before: [],
        after: [],
    },
    render
);

// @todo: инициализация
const { applyPagination, updatePagination } = initPagination(sampleTable.pagination.elements, (el, page, isCurrent) => {
    const input = el.querySelector("input");
    const label = el.querySelector("span");
    input.value = page;
    input.checked = isCurrent;
    label.textContent = page;
    return el;
});

const applySorting = initSorting([sampleTable.header.elements.sortByDate, sampleTable.header.elements.sortByTotal]);

const { applyFiltering, updateIndexes } = initFiltering(sampleTable.filter.elements, {});
const applySearching = initSearching("search");
const appRoot = document.querySelector("#app");
appRoot.appendChild(sampleTable.container);

async function init() {
    const indexes = await api.getIndexes();

    updateIndexes(sampleTable.filter.elements, {
        searchBySeller: indexes.sellers,
    });
}

init().then(render);