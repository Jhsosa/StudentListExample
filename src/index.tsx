// Import React and ReactDOM
import React from "react";
import ReactDOM from "react-dom";

//Jquery
import "webpack-jquery-ui";
import "webpack-jquery-ui/css";
import "jquery-ui-touch-punch";
import "jquery.transit";

// Polyfills
import "babel-polyfill";

// Import main App component
import App from "./App";

// Styles
import "./styles.css";

// Mount React App
ReactDOM.render(<App />, document.getElementById("app"));
