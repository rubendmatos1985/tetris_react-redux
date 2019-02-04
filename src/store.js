import { createStore, applyMiddleware, compose } from "redux";
//import { composeWithDevTools } from 'redux-devtools-extension';
import mainReducer from "./reducers";
import thunk from "redux-thunk";

const store = createStore(mainReducer, compose(applyMiddleware(thunk)));

export default store;
