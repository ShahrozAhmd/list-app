import React, { useState } from "react";
import IngredientList from "./IngredientList";
import IngredientForm from "./IngredientForm";
import Search from "./Search";

const Ingredients = () => {
  const [ingredients, setIngredients] = useState("");

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

  console.log(ingredients);

  return (
    <div className="App">
      <IngredientForm onAddIngredient={addIngredientHandler} />

      <section>
        <Search />
        <IngredientList ingredients={ingredients} onRemoveItem={() => {}} />
      </section>
    </div>
  );
};

export default Ingredients;
