import * as actionType from "./actions";

const initalState = {
	ingredients: {
		salad: 0,
		bacon: 0,
		cheese: 0,
		meat: 0,
	},
	totalPrice: 4,
};

const reducer = (state = initalState, action) => {
	switch (action.type) {
		case actionType.ADD_INGREDIENT:
			return {
				...state,
				ingredients: {
					...state.ingredients,
					[action.ingredientName]: state.ingredients[action.ingredientName] + 1,
				},
			};
		case actionType.REMOVE_INGREDIENTS:
			return {
				...state,
				ingredients: {
					...state.ingredients,
					[action.ingredientName]: state.ingredients[action.ingredientName] - 1,
				},
			};
		default:
			return state;
	}
	return state;
};

export default reducer;
