//https://stackoverflow.com/questions/1960473/get-all-unique-values-in-a-javascript-array-remove-duplicates
export const uniqueById = (array) => {
    const unique = (id, index, arr) => arr.indexOf(id) === index;
    return array.filter((item, idx) => unique(item.id, idx, array.map(item => item.id)));
};
export const uniqueByField = (array, field) => {
    const unique = (val, index, arr) => arr.indexOf(val) === index;
    return array.filter((item, idx) => unique(item[field], idx, array.map(item => item[field])));
};
