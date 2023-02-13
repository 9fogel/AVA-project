// import { IStateEditor } from './editorState-i';

class State {
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
  // static editor: IStateEditor = {
  //   selectedTool: [],
  //   openedList: [],
  //   openedOption: [],
  // };
}

export default State;
