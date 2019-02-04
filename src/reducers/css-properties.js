const initState = {
  figuresInArena: {
    doScoreAnimation: false,
    rowWhereMakeEffect: []
  }
};

const cssProperties = (state = initState, action) => {
  switch (action.type) {
    case "CSS_SCORE_EFFECT": {
      return {
        ...state,
        figuresInArena: {
          ...state.figuresInArena,
          doScoreAnimation: true,
          rowWhereMakeEffect: action.payload
        }
      };
    }
    case "SCORE":{
      return {
        ...state,
        figuresInArena: {
          ...state.figuresInArena,
          doScoreAnimation: false,
          rowWhereMakeEffect:[]
        }
      }
    }
    case "ADD_STEP": {
      return state.figuresInArena.doAnimation
        ? {
            ...state,
            figuresInArena: {
              ...state.figuresInArena,
              doAnimation: false,
              animationIndex: false
            }
          }
        : state;
    }

    default:
      return state;
  }
};

export default cssProperties;
