import React, { Component } from "react";
import "./App.css";

class App extends Component {
  state = {
    greeting: "fun"
  };

  helloWorld = () => {
    return fetch("/greet", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      }
    })
      .then(response => {
        return response.json();
      })
      .then(response => {
        let message = response.message;
        this.setState({ greeting: message });
        //console.log(message);
        return message;
      });
  };

  render() {
    this.helloWorld();
    return <div className="App">{this.state.greeting}</div>;
  }
}

export default App;
