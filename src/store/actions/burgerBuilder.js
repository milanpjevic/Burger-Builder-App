import * as actionType from "./actionType";
import axios from "../../axios-orders";

export const addIngredient = name => {
	return {
		type: actionType.ADD_INGREDIENT,
		ingredientName: name,
	};
};

export const removeIngredient = name => {
	return {
		type: actionType.REMOVE_INGREDIENT,
		ingredientName: name,
	};
};

export const setIngredients = ingredients => {
	return {
		type: actionType.SET_INGREDIENTS,
		ingredients: ingredients,
	};
};

export const fetchIngredientsFaild = () => {
	return {
		type: actionType.FETCH_INGREDIENTS_FAILD,
	};
};

export const initIngredients = () => {
	return dispatch => {
		axios
			.get("https://react-burgerbuilderapp-6195d.firebaseio.com/ingredients.json")
			.then(response => {
				dispatch(setIngredients(response.data));
			})
			.catch(error => {
				dispatch(fetchIngredientsFaild());
			});
	};
};
