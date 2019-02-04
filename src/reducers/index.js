import { combineReducers } from 'redux'
import figureReducer from './current-figure'
import staticDataReducer from './static-data'
import cssPropertiesReducer from './css-properties';

const mainReducer = combineReducers({
  currentFigure: figureReducer,
  staticData: staticDataReducer,
  cssProperties: cssPropertiesReducer  
})

export default mainReducer