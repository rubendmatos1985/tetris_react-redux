const initState = {
  frame: 0,
  xPosition: 6,
  yPosition: 0,
  figureInversion: 1,
  landed: false,
  figureType: "T",
  figuresKeys: ["Z", "L", "I", "O", "S", "J", "T"]
};

export default function(state = initState, action) {
  switch (action.type) {
    case "MOVE_FIGURE_DOWN":
      return {
        ...state,
        yPosition: !state.landed ? state.yPosition + 25 : 0
      };

    case "MOVE_ITEM_LEFT":
      return { ...state, xPosition: state.xPosition - 1 };

    case "MOVE_ITEM_RIGHT": {
      return { ...state, xPosition: state.xPosition + 1 };
    }
    case "COLLISION": {
      if (action.payload.where === "down") return { ...state, landed: true };
      else return state;
    }
    case "LAUNCH_NEW_FIGURE": {
      return {
        ...state,
        landed: false,
        yPosition: 0,
        xPosition: 7,
        figureInversion: 0,
        collisionLeft: false,
        collisionRight: false,
        figureType: state.figuresKeys[ randomNum(state.figuresKeys) ]
      };
    }
    case "ADD_STEP": {
      return { ...state, frame: state.frame + 1 };
    }
    case "INVERT_FIGURE": {
      return {
        ...state,
        figureInversion:
          action.payload.matrixLength - 1 > state.figureInversion
            ? state.figureInversion + 1
            : 0
      };
    }
    case 'START_GAME': {
     
      return {
        ...state,
        frame: 0,
        xPosition: 6,
        yPosition: 0,
        figureInversion: 0,
        landed: false,
        figureType: state.figuresKeys[ randomNum(state.figuresKeys) ]
      }
    }
    default:
      return state;
  }
}


/*   HELPER FUNCTIONS */

/*   ------> RANDOM NUMBER GENERATOR  [  RECURSIVE :) ] <-----   */

const randomNum = (arr)=> {
  const n = Math.round(Math.random() * (arr.length - 1));
  return n <= arr.length - 1
  ? n
  : randomNum(arr)
}