import React, {Component} from "react";
import CheckoutSummary from "../../components/Order/CheckoutSummary/CheckoutSummary";
import { Route } from "react-router-dom";
import ContactData from "../Checkout/ContactData/ContactData";

class Checkout extends Component {
  state = {
    ingredients: {
      salad: 1,
      meat: 1,
      cheese: 1, 
      bacon: 1,
    }
  }

  componentDidMount() {
    const query = new URLSearchParams(this.props.location.search);
    const ingredients = {};
    for (let parm of query.entries()) {
      // ["salad", "1"]
      ingredients[parm[0]] = +parm[1];
    }
    this.setState({ingredients: ingredients})
  }

  checkoutCancelledHandler = () => {
    this.props.history.goBack();
  }

  checkoutContinuedHandler = () => {
    this.props.history.replace("/checkout/contact-data");
  }

  render () {
    return (
      <div>
        <CheckoutSummary 
          ingredients={this.state.ingredients} 
          checkoutCancelled={this.checkoutCancelledHandler}
          checkoutContinued={this.checkoutContinuedHandler} />
        <Route path={this.props.match.url + "/contact-data"} component={ContactData}/>
      </div>
    )
  }
}

export default Checkout;
