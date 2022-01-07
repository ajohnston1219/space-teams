export const getFieldError = (field, errors) => {
    if (!errors) return null;
    let err = null;
    for (let e of errors) {
        if (e.field === field) {
            err = e.message || "Unknown error";
            break;
        }
    }
    return err;
};

export const getFormError = errors => {
    if (!errors) return null;
    let err = null;
    for (let e of errors) {
        if (!e.field) {
            err = e.message || "Unknown error";
            break;
        }
    }
    return err;
};
