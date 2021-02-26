import React, { useState, useEffect } from "react";

import Card from "../UI/Card";
import "./Search.css";

const Search = React.memo((props) => {
  const { onLoadIngredients } = props;
  const [enteredStr, setStr] = useState("");

  useEffect(() => {
    const query =
      enteredStr.length === 0
        ? " "
        : `?orderBy="title"&equalTo="${enteredStr}"`;
    fetch(
      "https://list-app-f6945-default-rtdb.firebaseio.com/lists.json" + query
    )
      .then((res) => res.json())
      .then((getdata) => {
        const arr = [];
        for (const key in getdata) {
          arr.push({ ...getdata[key], id: key });
        }
        onLoadIngredients(arr);
      });
  }, [enteredStr, onLoadIngredients]);

  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          <input
            type="text"
            value={enteredStr}
            onChange={(e) => {
              setStr(e.target.value);
            }}
          />
        </div>
      </Card>
    </section>
  );
});

export default Search;
