import * as actionType from "../actions/actionType";

const initialState = {
	orders: [],
	loading: false,
};

const reducer = (state = initialState, action) => {
	switch (actionType) {
		case actionType.PURCHASE_BURGER_START:
			return {
				...state.orders,
				loading: true,
			};
		case actionType.PURCHASE_BURGER_SUCCESS:
			const newOrder = {
				...action.orderData,
				id: action.orderId,
			};
			return {
				...state,
				loading: false,
				odreds: state.orders.concat(newOrder),
			};
		case actionType.PURCHASE_BURGER_FAIL:
			return {
				...state,
				loading: false,
			};
		default:
			return state;
	}
};

export default reducer;
