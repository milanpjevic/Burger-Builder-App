import React, { Component } from "react";
import Button from "../../../components/UI/Button/Button";
import classes from "./ContactData.module.css"
import axios from "../../../axios-orders";
import Spinner from "../../../components/UI/Spinner/Spinner"

class ContactData extends Component {
  state = {
    name: "",
    email: "", 
    address: {
      street: "",
      postalCode: "",
    }
  }

  orderHandler = (e) => {
    e.preventDefault()
    this.setState({loading: true})
    const order = {
        ingredients: this.props.ingredients,
        price: this.props.price,
        customer: {
            name: "Milan Pjevic",
            address: {
                street: "React Street No.3", 
                zipCode: "11000", 
                counry: "Serbia",
            },
            email: "milanreacts@react.com",
        },
        deliveryMethod: "fast"
    }

    axios.post("/orders.json", order )
      .then(response => {
          this.setState({loading: false});
          this.props.history.push("/");
      })
      .catch(error => {
          this.setState({loading: false});
      });
  }

  render () {
    let form = (
      <form>
          <input type="text" name="name" placeholder="Your name"/>
          <input type="text" name="email" placeholder="Your email"/>
          <input type="text" name="street" placeholder="Street and number"/>
          <input type="text" name="postal" placeholder="Postal code"/>
          <Button btnType="Success" clicked={this.orderHandler}>ORDER</Button>
        </form>
    );
    if (this.state.loading) {
      form = <Spinner />
    }
    return (
      <div className={classes.ContactData}> 
        <h4>Enter your Contac Data</h4>
        {form}
      </div>
    )
  }

}

export default ContactData;