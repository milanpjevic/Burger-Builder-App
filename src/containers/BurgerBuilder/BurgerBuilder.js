import React, { Component } from "react";
import { connect } from "react-redux";
import * as actionType from "../../store/actions";

import Aux from "../../hoc/ReactAux";
import axios from "../../axios-orders";
import withErrorHandler from "../../hoc/withErrorHandler/withErrorHandler";

import Burger from "../../components/Burger/Burger";
import BuildControls from "../../components/Burger/BuildControls/BuildControls";
import Modal from "../../components/UI/Modal/Modal";
import OrderSummary from "../../components/Burger/OrderSummary/OrderSummary";
import Spinner from "../../components/UI/Spinner/Spinner";

class BurgerBuilder extends Component {
	state = {
		purchasable: false,
		purchasing: false,
		loading: false,
		error: false,
	};

	componentDidMount() {
		console.log(this.props);
		// axios
		// 	.get("https://react-burgerbuilderapp-6195d.firebaseio.com/ingredients.json")
		// 	.then(response => {
		// 		this.setState({ ingredients: response.data });
		// 	})
		// 	.catch(error => {
		// 		this.setState({ error: true });
		// 	});
	}

	purchaseHandler = () => {
		this.setState({ purchasing: true });
	};

	updatePurchasestate = ingredients => {
		const sum = Object.keys(ingredients)
			.map(ingredient => {
				return ingredients[ingredient];
			})
			.reduce((sum, val) => {
				return sum + val;
			}, 0);

		this.setState({ purchasable: sum > 0 });
	};

	purchaseCancelledHandler = () => {
		this.setState({ purchasing: false });
	};

	purchaseContinueHandler = () => {
		const queryParms = [];
		for (let i in this.state.ingredients) {
			queryParms.push(
				encodeURIComponent(i) + "=" + encodeURIComponent(this.state.ingredients[i])
			);
		}
		queryParms.push("price=" + this.props.price);
		const queryString = queryParms.join("&");
		this.props.history.push({
			pathname: "/checkout",
			search: "?" + queryString,
		});
	};

	render() {
		const disabledInfo = { ...this.props.ings };
		for (let key in disabledInfo) {
			disabledInfo[key] = disabledInfo[key] <= 0;
		}

		let orderSummary = null;
		if (this.props.ings) {
			orderSummary = (
				<OrderSummary
					ingredients={this.props.ings}
					purchaseCancelled={this.purchaseCancelledHandler}
					purchaseContinue={this.purchaseContinueHandler}
					price={this.props.price}
				/>
			);
		}

		if (this.state.loading) {
			orderSummary = <Spinner />;
		}

		let burger = this.state.error ? <p>Ingredients can not be loaded.</p> : <Spinner />;
		if (this.props.ings) {
			burger = (
				<Aux>
					<Burger ingredients={this.props.ings} />
					<BuildControls
						ingredientAdded={this.props.onIngredientAdded}
						ingredientRemoved={this.props.onIngredientRemove}
						disabled={disabledInfo}
						price={this.props.price}
						purchasable={this.state.purchasable}
						ordered={this.purchaseHandler}
					/>
				</Aux>
			);
		}

		return (
			<Aux>
				<Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
					{orderSummary}
				</Modal>
				{burger}
			</Aux>
		);
	}
}

const mapStateToProps = state => {
	return {
		ings: state.ingredients,
		price: state.totalPrice,
	};
};

const mapDispatchToProps = dispatch => {
	return {
		onIngredientAdded: ingName =>
			dispatch({ type: actionType.ADD_INGREDIENT, ingredientName: ingName }),
		onIngredientRemove: ingName =>
			dispatch({ type: actionType.REMOVE_INGREDIENT, ingredientName: ingName }),
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withErrorHandler(BurgerBuilder, axios));
