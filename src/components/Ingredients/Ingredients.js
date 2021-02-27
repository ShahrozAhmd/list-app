import React, { useState, useEffect, useCallback } from "react";
import IngredientList from "./IngredientList";
import IngredientForm from "./IngredientForm";
import Search from "./Search";

const Ingredients = () => {
  const [ingredients, setIngredients] = useState("");

  const filteredIng = useCallback((filtIng) => {
    setIngredients(filtIng);
  }, []);

  const addIngredientHandler = (ingredient) => {
    fetch("https://list-app-f6945-default-rtdb.firebaseio.com/lists.json", {
      method: "POST",
      body: JSON.stringify(ingredient),
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((resData) => {
        setIngredients((prevState) => [
          ...prevState,
          { ...ingredient, id: resData.name, ...ingredient },
        ]);
      });
  };

  const removeIngredientHandler = (id) => {
    fetch(
      `https://list-app-f6945-default-rtdb.firebaseio.com/lists/${id}.json`,
      {
        method: "DELETE",
      }
    ).then(
      setIngredients((prevState) => prevState.filter((ing) => ing.id !== id))
    );
  };

  return (
    <div className="App">
      <IngredientForm onAddIngredient={addIngredientHandler} />

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
