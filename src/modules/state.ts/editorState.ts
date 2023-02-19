class State {
  static userState = 'default';
  static userName = '';
  static userEmail = '';

  static tools: { [key: string]: boolean } = {
    transform: false,
    filters: false,
    adjustments: false,
    text: false,
    border: false,
    draw: false,
  };

  static controls: { [key: string]: boolean } = {
    crop: false,
    resize: false,
    rotate: false,
    filters: false,
    adjustments: false,
  };
}

export default State;
