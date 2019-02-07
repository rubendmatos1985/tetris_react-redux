const initState = {
  figuresInArena: {
    scoreAnimationStarted: false,
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
          rowWhereMakeEffect: action.payload
        }
      };
    }
    case "SCORE_ANIMATION_STARTED":{
      return {
        ...state,
        figuresInArena: {
          ...state.figuresInArena,
          scoreAnimationStarted: true,
        }
      }
    }
    case "SCORE": {
      return {
        ...state,
        figuresInArena: {
          ...state.figuresInArena,
          scoreAnimationStarted: false
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
