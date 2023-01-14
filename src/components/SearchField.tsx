import * as React from "react";

export interface SearchFieldProps {
  query: string;
  setQuery: (query: string) => void;
  onSubmit: () => void;
  onBlur: () => void;
}

const SearchField = (props: SearchFieldProps) => {
  const [tooShort, setTooShort] = React.useState(false);

  return (
    <div className="search-bar">
      <input
        type="search"
        placeholder="Search..."
        value={props.query}
        onChange={(event) => {
          props.setQuery(event.target.value);
          setTooShort(false);
        }}
        onKeyPress={(event) => {
          if (event.key == "Enter") {
            if (props.query.trim().length >= 3) {
              props.onSubmit();
            } else {
              setTooShort(true);
            }
          }
        }}
        autoFocus
        onBlur={props.onBlur}
      />
      {tooShort ? (
        <div className="search-bar-error">Query is too short</div>
      ) : null}
    </div>
  );
};

export default SearchField;
