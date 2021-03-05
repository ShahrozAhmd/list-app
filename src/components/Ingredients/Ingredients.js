import React, { useState, useEffect, useReducer, useCallback } from "react";
import IngredientList from "./IngredientList";
import IngredientForm from "./IngredientForm";
import Search from "./Search";
import ErrorModal from "../UI/ErrorModal";

const ingredientReducer = (state, action) => {
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

const requestReducer = (state, action) => {
  switch (action.type) {
    case "REQUEST":
      return { isLoading: true, isError: null };
    case "RESPONSE":
      return { isLoading: false, isError: null };
    case "ERROR":
      return { isLoading: false, isError: action.error };
    case "CLEAR_ERROR":
      return { isLoading: null, isError: null };
    default:
      throw new Error("Error");
  }
};

const Ingredients = () => {
  const [ingredients, ingDispatch] = useReducer(ingredientReducer, []);
  const [state, reqDispatch] = useReducer(requestReducer, {
    isLoading: null,
    isError: null,
  });

  const filteredIng = useCallback((filtIng) => {
    ingDispatch({ type: "SET", ing: filtIng });
  }, []);

  const addIngredientHandler = (ingredient) => {
    reqDispatch({ type: "REQUEST" });
    fetch("https://list-app-f6945-default-rtdb.firebaseio.com/lists.json", {
      method: "POST",
      body: JSON.stringify(ingredient),
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((resData) => {
        reqDispatch({ type: "RESPONSE" });

        ingDispatch({ type: "ADD", ing: { ...ingredient, id: resData.name } });
      })
      .catch((err) => {
        reqDispatch({ type: "ERROR", error: err.message });
      });
  };

  const removeIngredientHandler = (id) => {
    reqDispatch({ type: "REQUEST" });
    fetch(
      `https://list-app-f6945-default-rtdb.firebaseio.com/lists/${id}.json`,
      {
        method: "DELETE",
      }
    )
      .then(() => {
        ingDispatch({ type: "DELETE", id: id });
        reqDispatch({ type: "RESPONSE" });
      })
      .catch((err) => {
        reqDispatch({ type: "ERROR", error: err.message });
      });
  };

  const closeErrorModal = () => {
    reqDispatch({ type: "CLEAR_ERROR" });
  };

  return (
    <div className="App">
      {state.isError && (
        <ErrorModal onClose={closeErrorModal}>{state.isError}</ErrorModal>
      )}
      <IngredientForm
        onAddIngredient={addIngredientHandler}
        isloading={state.isLoading}
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
