import React, { Component } from "react";
import Aux from "../../hoc/ReactAux";
import Burger from "../../components/Burger/Burger";
import BuildControls from "../../components/Burger/BuildControls/BuildControls";
import Modal from "../../components/UI/Modal/Modal";
import OrderSummary from "../../components/Burger/OrderSummary/OrderSummary";
import axios from "../../axios-orders";
import Spinner from "../../components/UI/Spinner/Spinner";
import withErrorHandler from "../../hoc/withErrorHandler/withErrorHandler";

const INGREDIENT_PRICES = {
  salad: 0.5,
  cheese: 0.4,
  meat: 1.3,
  bacon: 0.7,
};

class BurgerBuilder extends Component {
  state = {
    ingredients: null,
    totalPrice: 4,
    purchasable: false,
    purchasing: false,
    loading: false,
    error: false,
  };

  componentDidMount ()  {
    console.log(this.props)
      axios.get("https://react-burgerbuilderapp-6195d.firebaseio.com/ingredients.json")
      .then(response => {
          this.setState({ingredients: response.data})
      })
      .catch(error=> {
          this.setState({error: true})
      } )
  }

  purchaseHandler = () => {
    this.setState({ purchasing: true });
  };

  updatePurchasestate = (ingredients) => {
    const sum = Object.keys(ingredients)
      .map((ingredient) => {
        return ingredients[ingredient];
      })
      .reduce((sum, val) => {
        return sum + val;
      }, 0);

    this.setState({ purchasable: sum > 0 });
  };

  addIngredientHandler = (type) => {
    const oldCount = this.state.ingredients[type];
    const updatedCount = oldCount + 1;
    const updatedIngredients = { ...this.state.ingredients };
    updatedIngredients[type] = updatedCount;

    const priceAddition = INGREDIENT_PRICES[type];
    const oldPrice = this.state.totalPrice;
    const newPrice = oldPrice + priceAddition;

    this.setState({ ingredients: updatedIngredients, totalPrice: newPrice });
    this.updatePurchasestate(updatedIngredients);
  };

  removeIngredientHandler = (type) => {
    const oldCount = this.state.ingredients[type];
    if (oldCount <= 0) {
      return;
    }
    const updatedCount = oldCount - 1;
    const updatedIngredients = { ...this.state.ingredients };
    updatedIngredients[type] = updatedCount;

    const priceDeduction = INGREDIENT_PRICES[type];
    const oldPrice = this.state.totalPrice;
    const newPrice = oldPrice - priceDeduction;

    this.setState({ ingredients: updatedIngredients, totalPrice: newPrice });
    this.updatePurchasestate(updatedIngredients);
  };

  purchaseCancelledHandler = () => {
    this.setState({ purchasing: false });
  };

  purchaseContinueHandler = () => {
    // this.setState({loading: true})
    // const order = {
    //     ingredients: this.state.ingredients,
    //     price: this.state.totalPrice,
    //     customer: {
    //         name: "Milan Pjevic",
    //         address: {
    //             street: "React Street No.3", 
    //             zipCode: "11000", 
    //             counry: "Serbia",
    //         },
    //         email: "milanreacts@react.com",
    //     },
    //     deliveryMethod: "fast"
    // }

    // axios.post("/orders.json", order )
    //   .then(response => {
    //       this.setState({loading: false, purchasing: false})
    //   })
    //   .catch(error => {
    //       this.setState({loading: false, purchasing: false})
    //   });
    const queryParms = [];
    for (let i in this.state.ingredients) {
      queryParms.push(encodeURIComponent(i) + "=" + encodeURIComponent(this.state.ingredients[i]));
    }

    const queryString = queryParms.join("&");
    this.props.history.push({
      pathname: "/checkout",
      search: "?" + queryString
    })
  };

  render() {
    const disabledInfo = { ...this.state.ingredients };
    for (let key in disabledInfo) {
      disabledInfo[key] = disabledInfo[key] <= 0;
    }

    let orderSummary = null;
    if(this.state.ingredients) {
        orderSummary = 
            <OrderSummary
                ingredients={this.state.ingredients}
                purchaseCancelled={this.purchaseCancelledHandler}
                purchaseContinue={this.purchaseContinueHandler}
                price={this.state.totalPrice}
            />
    }
    
    if(this.state.loading) {
        orderSummary = <Spinner />
    }

    let burger = this.state.error ? <p>Ingredients can not be loaded.</p> : <Spinner />
    if(this.state.ingredients) {
        burger = (
        <Aux>
            <Burger ingredients={this.state.ingredients} />
            <BuildControls
                ingredientAdded={this.addIngredientHandler}
                ingredientRemoved={this.removeIngredientHandler}
                disabled={disabledInfo}
                price={this.state.totalPrice}
                purchasable={this.state.purchasable}
                ordered={this.purchaseHandler}
            />
        </Aux>)
    }
     

    return (
      <Aux>
        <Modal
          show={this.state.purchasing}
          modalClosed={this.purchaseCancelHandler}
        >
        {orderSummary}
        </Modal>
        {burger}
      </Aux>
    );
  }
}

export default withErrorHandler(BurgerBuilder, axios);
