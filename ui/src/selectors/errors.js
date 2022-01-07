export const getTaggedErrors = (errors, tag) => {
    if (!errors)
        return null;
    const taggedErrors = errors.filter(e => e.tag === tag);
    return taggedErrors.length !== 0
        ? taggedErrors
        : null;
};
