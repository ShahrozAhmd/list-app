import React, { useState, useEffect, useCallback } from "react";
import IngredientList from "./IngredientList";
import IngredientForm from "./IngredientForm";
import Search from "./Search";
import ErrorModal from "../UI/ErrorModal";

const Ingredients = () => {
  const [ingredients, setIngredients] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [isError, setError] = useState();

  const filteredIng = useCallback((filtIng) => {
    setIngredients(filtIng);
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
        setIngredients((prevState) => [
          ...prevState,
          { ...ingredient, id: resData.name, ...ingredient },
        ]);
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
        setIngredients((prevState) => prevState.filter((ing) => ing.id !== id));
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
