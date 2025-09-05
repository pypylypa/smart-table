import {sortCollection, sortMap} from "../lib/sort.js";

export function initSorting(columns) {
  columns.forEach((c) => {
    if (!c.dataset.value) c.dataset.value = "none";
  });

  return (data, state, action) => {
    let field = null;
    let order = "none";

    if (action && action.name === "sort" && columns.includes(action)) {
      // @todo: #3.1 — запомнить выбранный режим сортировки
      action.dataset.value = sortMap[action.dataset.value];
      field = action.dataset.field;
      order = action.dataset.value;

      // @todo: #3.2 — сбросить сортировки остальных колонок
      columns.forEach((column) => {
        if (column !== action) column.dataset.value = "none";
      });
    } else {
      // @todo: #3.3 — получить выбранный режим сортировки (при последующих перерисовках)
      columns.forEach((column) => {
        if (column.dataset.value !== "none") {
          field = column.dataset.field;
          order = column.dataset.value;
        }
      });
    }
    // если сортировка не выбрана — возвращаем данные как есть
    if (!field || order === "none") return data;
    return sortCollection(data, field, order);
  };
}