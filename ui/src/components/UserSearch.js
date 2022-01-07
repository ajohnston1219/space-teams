import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Dropdown } from "semantic-ui-react";
import { userSearch, clearUserSearch } from "../actions/search";

const UserSearch = ({
    initialValue,
    onResultSelect,
    onChange
}) => {

    const dispatch = useDispatch();

    const user = useSelector((state) => state.user);
    const results = useSelector((state) => state.search.users.results);

    const [query, setQuery] = React.useState("");
    const [selection, setSelection] = React.useState(initialValue);
    const [hasLoaded, setHasLoaded] = React.useState(false);

    const handleSearchChange = (e, { searchQuery }) => {
        setQuery(searchQuery);
        onChange(searchQuery);
        if (searchQuery === "")
            dispatch(clearUserSearch());
        else
            dispatch(userSearch(searchQuery));
    };

    const handleResultSelect = (e, { value }) => {
        const user = results.find(r => r.username === value);
        setSelection(value);
        setQuery(value);
        onResultSelect(user);
    };

    React.useEffect(() => {
        if (initialValue && !hasLoaded) {
            setHasLoaded(true);
            dispatch(userSearch(initialValue));
        }
    }, [hasLoaded, initialValue]);

    const getUserOptions = opts => opts
          .filter(o => o.id !== user.id)
          .map(r => ({
              key: r.id,
              text: r.username,
              value: r.username
          }));

    return (
        <Dropdown
            selection
            search
            placeholder="Start typing to see results"
            value={selection}
            searchQuery={query}
            onChange={handleResultSelect}
            onSearchChange={handleSearchChange}
            options={getUserOptions(results)}
        />
    );
};

export default UserSearch;
