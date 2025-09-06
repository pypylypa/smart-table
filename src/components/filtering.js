export function initFiltering(elements) {
    const updateIndexes = (elements, indexes) => {
        Object.keys(indexes).forEach((elementName) => {
            elements[elementName].append(
                ...Object.values(indexes[elementName]).map((name) => {
                    const el = document.createElement("option");
                    el.textContent = name;
                    el.value = name;
                    return el;
                })
            );
        });
    };

    const applyFiltering = (query, state, action) => {
        if (action && action.name === "clear") {
            const parent = action.closest(".filter-wrapper");
            const input = parent.querySelector("input");
            const field = input.dataset.field;

            input.value = "";
            state[field] = "";
        }

        const filter = {};
        Object.keys(elements).forEach((key) => {
            if (elements[key]) {
                if (["INPUT", "SELECT"].includes(elements[key].tagName) && elements[key].value) {
                    filter[`filter[${elements[key].name}]`] = elements[key].value;
                }
            }
        });

        return Object.keys(filter).length ? Object.assign({}, query, filter) : query;
    };

    return {
        updateIndexes,
        applyFiltering,
    };
}