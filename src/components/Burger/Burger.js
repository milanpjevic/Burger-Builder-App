import React from "react";
import classes from "./Burger.module.css";
import BurgerIngredient from "./BurgerIngredient/BurgerIngredient";
// import {withRouter} from "react-router-dom"

const burger = (props) => {
  console.log(props);
  let transformedIngredients = Object.keys(props.ingredients)
    .map((ingredient) => {
      return [...Array(props.ingredients[ingredient])].map((_, i) => {
        return <BurgerIngredient type={ingredient} key={ingredient + i} />;
      });
    })
    .reduce((arr, el) => {
      return arr.concat(el);
    }, []);

  if (transformedIngredients.length === 0) {
    transformedIngredients = <p>Please start adding ingredients!</p>;
  }

  return (
    <div className={classes.Burger}>
      <BurgerIngredient type='bread-top' />
      {transformedIngredients}
      <BurgerIngredient type='bread-bottom' />
    </div>
  );
};

export default burger;
