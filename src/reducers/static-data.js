const R = require("ramda");
const staticData = {
  gameOver: false,
  colors: {
    T: { key: 1, color: "#c53cff" },
    Z: { key: 2, color: "#fc0367" },
    S: { key: 3, color: "#67fc03" },
    O: { key: 4, color: "#ffe23c" },
    I: { key: 5, color: "#3a71f0" },
    L: { key: 6, color: "#a8822f" },
    J: { key: 7, color: "#5a2fa8" }
  },
  score: 0,
  record: 0,
  arena: [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  ],
  matrices: {
    T: {
      0: [[1, 1, 1], [0, 1, 0], [0, 0, 0], [0, 0, 0]],
      1: [[0, 0, 1], [0, 1, 1], [0, 0, 1], [0, 0, 0]],
      2: [[0, 1, 0], [1, 1, 1], [0, 0, 0], [0, 0, 0]],
      3: [[0, 1, 0], [0, 1, 1], [0, 1, 0], [0, 0, 0]]
    },
    Z: {
      0: [[0, 0, 2], [0, 2, 2], [0, 2, 0], [0, 0, 0]],
      1: [[0, 0, 0], [2, 2, 0], [0, 2, 2], [0, 0, 0]]
    },
    S: {
      0: [[0, 3, 3], [3, 3, 0], [0, 0, 0]],
      1: [[3, 0, 0], [3, 3, 0], [0, 3, 0]]
    },
    O: {
      0: [[4, 4, 0], [4, 4, 0], [0, 0, 0]]
    },
    I: {
      0: [[0, 5, 0], [0, 5, 0], [0, 5, 0], [0, 5, 0]],
      1: [[0, 0, 0, 0], [5, 5, 5, 5], [0, 0, 0, 0]]
    },
    L: {
      0: [[0, 6, 0], [0, 6, 0], [0, 6, 6]],
      1: [[0, 0, 0], [6, 6, 6], [6, 0, 0]],
      2: [[6, 6, 0], [0, 6, 0], [0, 6, 0]],
      3: [[0, 0, 6], [6, 6, 6], [0, 0, 0]]
    },
    J: {
      0: [[0, 7, 0], [0, 7, 0], [7, 7, 0]],
      1: [[7, 0, 0], [7, 7, 7], [0, 0, 0]],
      2: [[0, 7, 7], [0, 7, 0], [0, 7, 0]],
      3: [[7, 7, 7], [0, 0, 7], [0, 0, 0]]
    }
  }
};
export default function(state = staticData, action) {
  switch (action.type) {
    case "COLLISION": {
      if (action.payload.where === "down") {
        const type = action.payload.figureType;
        const figureMatrix = state.matrices[type];
        const figure = figureMatrix[action.payload.figureInversion].map(arr =>
          arr.filter(val => val > 0)
        );

        const numberToDraw = figure
          .reduce((acc, arr) => acc.concat(arr))
          .reduce((acc, num) => (acc >= num ? acc : num));
        const yAxisToStartDraw = action.payload.y;
        const figurePoints = getAxesPointsFromPayload(
          action.payload.children,
          yAxisToStartDraw
        );
        const aboveFigure = state.arena.slice(0, yAxisToStartDraw);
        const matrixToDraw = state.arena.slice(
          yAxisToStartDraw,
          yAxisToStartDraw + figure.length
        );
        const bellowFigure = state.arena.slice(
          yAxisToStartDraw + figure.length
        );
        const matrixWithPicture = drawInMatrix(
          matrixToDraw,
          figurePoints,
          numberToDraw
        );
        return bellowFigure
          ? {
              ...state,
              arena: [...aboveFigure, ...matrixWithPicture, ...bellowFigure]
            }
          : { ...state, arena: [...aboveFigure, ...matrixWithPicture] };
      } else {
        return state;
      }
    }
    case "GAME_OVER": {
      return { ...state, gameOver: true };
    }
    case "SCORE": {
      const indexes = action.payload;
      const removeFromArr = (index, arr) => {
        const aboveArr = arr.slice(0, index);
        const bellowArr = arr[index + 1] ? arr.slice(index + 1) : [];
        return bellowArr.length > 0
          ? [...aboveArr, ...bellowArr]
          : [...aboveArr];
      };

      const deleteLines = indexes => (arena, counter = 0) =>  
        counter === indexes.length
          ? arena
          : deleteLines(indexes)(
              removeFromArr(indexes[counter], arena),
              counter + 1
            );

      const addEmptyLines = indexes => (arena, counter = 0) =>
        counter === indexes.length
          ? arena
          : addEmptyLines(indexes)(
              [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], ...arena],
              counter + 1
            );

      const newArena = (indexes, arena) =>
        R.compose(
          addEmptyLines(indexes),
          deleteLines(indexes)
        )(arena);
      return {
        ...state,
        arena: newArena(indexes, state.arena),
        score: state.score + 25
      };
    }
    case "START_GAME": {
      return {
        ...state,
        arena: [
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        ],
        gameOver: false,
        record: state.score > state.record ? state.score : state.record,
        score: 0
      };
    }
    default:
      return state;
  }
}

/*---------------------------------------  HELPER FUNCTIONS  ------------------------------------------------------------------*/

const drawInMatrix = (matrixToDraw, figure, numberToDraw) =>
  matrixToDraw.map((arr, yAxis) =>
    arr.map((num, xAxis) =>
      R.includes({ x: xAxis, y: yAxis }, figure) ? numberToDraw : num
    )
  );

const getAxesPointsFromPayload = (children, yAxisToStartDraw) =>
  children
    .map(arr => arr.filter(val => val))
    .filter(arr => arr.length > 0)
    .reduce((acc, arr) => acc.concat(arr))
    .map(item => ({
      x: item.props.x / 25,
      y: item.props.y / 25 - yAxisToStartDraw
    }))
    .sort((a, b) => (a.y < b.y ? -1 : 1));
