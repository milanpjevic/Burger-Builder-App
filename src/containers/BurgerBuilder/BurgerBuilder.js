import React, { Component } from "react";
import { connect } from "react-redux";
import * as burgerBuilderActions from "../../store/actions/index";

import Aux from "../../hoc/ReactAux";
import withErrorHandler from "../../hoc/withErrorHandler/withErrorHandler";
import axios from "../../axios-orders";
import Burger from "../../components/Burger/Burger";
import BuildControls from "../../components/Burger/BuildControls/BuildControls";
import Modal from "../../components/UI/Modal/Modal";
import OrderSummary from "../../components/Burger/OrderSummary/OrderSummary";
import Spinner from "../../components/UI/Spinner/Spinner";

class BurgerBuilder extends Component {
	state = {
		purchasing: false,
	};

	componentDidMount() {
		console.log(this.props);
		this.props.onInitIngredients();
	}

	purchaseHandler = () => {
		this.setState({ purchasing: true });
	};

	updatePurchaseState = ingredients => {
		const sum = Object.keys(ingredients)
			.map(ingredient => {
				return ingredients[ingredient];
			})
			.reduce((sum, val) => {
				return sum + val;
			}, 0);
		return sum > 0;
	};

	purchaseCancelledHandler = () => {
		this.setState({ purchasing: false });
	};

	purchaseContinueHandler = () => {
		this.props.history.push("/checkout");
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

		let burger = this.props.error ? <p>Ingredients can not be loaded.</p> : <Spinner />;
		if (this.props.ings) {
			burger = (
				<Aux>
					<Burger ingredients={this.props.ings} />
					<BuildControls
						ingredientAdded={this.props.onIngredientAdded}
						ingredientRemoved={this.props.onIngredientRemove}
						disabled={disabledInfo}
						price={this.props.price}
						purchasable={this.updatePurchaseState(this.props.ings)}
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
		error: state.error,
	};
};

const mapDispatchToProps = dispatch => {
	return {
		onIngredientAdded: ingName => dispatch(burgerBuilderActions.addIngredient(ingName)),
		onIngredientRemove: ingName => dispatch(burgerBuilderActions.removeIngredient(ingName)),
		onInitIngredients: () => dispatch(burgerBuilderActions.initIngredients()),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));
