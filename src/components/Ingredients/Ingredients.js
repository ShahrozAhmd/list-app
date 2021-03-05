import React, { useState, useEffect, useReducer, useCallback } from "react";
import IngredientList from "./IngredientList";
import IngredientForm from "./IngredientForm";
import Search from "./Search";
import ErrorModal from "../UI/ErrorModal";

const reducer = (state, action) => {
  switch (action.type) {
    case "SET":
      return action.ing;
    case "ADD":
      return [...state, action.ing];
    case "DELETE":
      return state.filter((ing) => ing.id !== action.id);
    default:
      throw new Error("Error");
  }
};

const Ingredients = () => {
  const [ingredients, dispatch] = useReducer(reducer, []);

  const [isLoading, setLoading] = useState(false);
  const [isError, setError] = useState();

  const filteredIng = useCallback((filtIng) => {
    dispatch({ type: "SET", ing: filtIng });
  }, []);

  const addIngredientHandler = (ingredient) => {
    setLoading(true);
    fetch("https://list-app-f6945-default-rtdb.firebaseio.com/lists.json", {
      method: "POST",
      body: JSON.stringify(ingredient),
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((resData) => {
        setLoading(false);
        dispatch({ type: "ADD", ing: { ...ingredient, id: resData.name } });
      })
      .catch((err) => {
        setError(err.message);
      });
  };

  const removeIngredientHandler = (id) => {
    setLoading(true);
    fetch(
      `https://list-app-f6945-default-rtdb.firebaseio.com/lists/${id}.json`,
      {
        method: "DELETE",
      }
    )
      .then(() => {
        dispatch({ type: "DELETE", id: id });
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
      });
  };

  const closeErrorModal = () => {
    setError(false);
    setLoading(false);
  };

  return (
    <div className="App">
      {isError && <ErrorModal onClose={closeErrorModal}>{isError}</ErrorModal>}
      <IngredientForm
        onAddIngredient={addIngredientHandler}
        isloading={isLoading}
      />

      <section>
        <Search onLoadIngredients={filteredIng} />
        <IngredientList
          ingredients={ingredients}
          onRemoveItem={removeIngredientHandler}
        />
      </section>
    </div>
  );
};

export default Ingredients;
