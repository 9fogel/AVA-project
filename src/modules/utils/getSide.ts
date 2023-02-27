import CanvasState from '../model/canvasState';

function getRightSide(side: string, value: number): number | undefined {
  if (side === 'width') {
    const result = Math.round(value * CanvasState.parameters.imageProportions);
    return result > 9999 ? 9999 : result;
  } else if (side === 'height') {
    const result = Math.round(value / CanvasState.parameters.imageProportions);
    return result > 9999 ? 9999 : result;
  } else {
    return;
  }
}

export default getRightSide;
