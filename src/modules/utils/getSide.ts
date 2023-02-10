import state from '../model/state';

function getRightSide(side: string, value: number) {
  if (side === 'width') {
    const result = Math.round(value * state.imageProportions);
    return result > 9999 ? 9999 : result;
  } else if (side === 'height') {
    const result = Math.round(value / state.imageProportions);
    return result > 9999 ? 9999 : result;
  } else {
    return;
  }
}

export default getRightSide;
