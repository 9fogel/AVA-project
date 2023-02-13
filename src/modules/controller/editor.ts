import Model from '../model/model';
import getRightSide from '../utils/getSide';
import state from '../model/state';
import State from '../state.ts/editorState';

class Editor {
  private readonly model: Model;

  constructor() {
    this.model = new Model();
  }

  public handleEditor(): void {
    this.listenTools();
    this.listenToolOptions();
    this.listenBackArrows();
    this.updateElements();
  }

  public updateElements(): void {
    const resizeWidthInput = <HTMLInputElement>document.getElementById('width-input');
    const resizeHeightInput = <HTMLInputElement>document.getElementById('height-input');
    const adjustRangeInput = <HTMLInputElement>document.querySelector('.adjust-range-input');
    const adjustNumberInput = <HTMLInputElement>document.querySelector('.adjust-number-input');
    const adjustNumberSign = <HTMLInputElement>document.querySelector('.percentage-sign');
    resizeWidthInput.value = String(state.imageWidth);
    resizeHeightInput.value = String(state.imageHeight);
    switch (state.currentAdjustment) {
      case 'blur':
        adjustRangeInput.value = String(state.blur);
        adjustNumberInput.value = String(state.blur);
        adjustRangeInput.max = '100';
        adjustNumberInput.max = '100';
        adjustNumberSign.innerText = 'px';
        break;
      case 'brightness':
        adjustRangeInput.value = String(state.brightness);
        adjustNumberInput.value = String(state.brightness);
        adjustRangeInput.max = '300';
        adjustNumberInput.max = '300';
        adjustNumberSign.innerText = '%';
        break;
      case 'contrast':
        adjustRangeInput.value = String(state.contrast);
        adjustNumberInput.value = String(state.contrast);
        adjustRangeInput.max = '200';
        adjustNumberInput.max = '200';
        adjustNumberSign.innerText = '%';
        break;
      case 'grayscale':
        adjustRangeInput.value = String(state.grayscale);
        adjustNumberInput.value = String(state.grayscale);
        adjustRangeInput.max = '100';
        adjustNumberInput.max = '100';
        adjustNumberSign.innerText = '%';
        break;
      case 'hue':
        adjustRangeInput.value = String(state.hue);
        adjustNumberInput.value = String(state.hue);
        adjustRangeInput.max = '360';
        adjustNumberInput.max = '360';
        adjustNumberSign.innerText = '°';
        break;
      case 'pixelate':
        adjustRangeInput.value = String(state.pixelate);
        adjustNumberInput.value = String(state.pixelate);
        break;
      case 'saturation':
        adjustRangeInput.value = String(state.saturation);
        adjustNumberInput.value = String(state.saturation);
        adjustRangeInput.max = '300';
        adjustNumberInput.max = '300';
        adjustNumberSign.innerText = '%';
        break;
      case 'sepia':
        adjustRangeInput.value = String(state.sepia);
        adjustNumberInput.value = String(state.sepia);
        adjustRangeInput.max = '200';
        adjustNumberInput.max = '200';
        adjustNumberSign.innerText = '%';
        break;
      case 'invert':
        adjustRangeInput.value = String(state.invert);
        adjustNumberInput.value = String(state.invert);
        adjustRangeInput.max = '100';
        adjustNumberInput.max = '100';
        adjustNumberSign.innerText = '%';
        break;
      case 'opacity':
        adjustRangeInput.value = String(state.opacity);
        adjustNumberInput.value = String(state.opacity);
        adjustRangeInput.max = '100';
        adjustNumberInput.max = '100';
        adjustNumberSign.innerText = '%';
        break;
    }
  }

  public hideOpenedToolMenus(): void {
    const tools = Object.keys(State.tools);

    Object.values(State.tools).forEach((isOpened, index) => {
      if (isOpened) {
        const toolName = tools[index];
        const toolItem = document.querySelector(`.${toolName}-tool`);
        const optionsList = document.querySelector(`.${toolName}-list`);
        toolItem?.classList.remove('selected');
        optionsList?.classList.add('hidden');
        State.tools[toolName] = !State.tools[toolName];
      }
    });
  }

  public hideOpenedOptionControls(): void {
    const controls = Object.keys(State.controls);

    Object.values(State.controls).forEach((isOpened, index) => {
      if (isOpened) {
        const controlsName = controls[index];
        const controlsMenu = document.querySelector(`.${controlsName}-controls`);
        controlsMenu?.classList.add('hidden');
        State.controls[controlsName] = !State.controls[controlsName];
        if (controlsName === 'adjustments') {
          State.tools.adjustments = false;
          document.querySelector('.adjustments-tool')?.classList.remove('selected');
        } else if (controlsName === 'crop' || controlsName === 'resize' || controlsName === 'rotate') {
          State.tools.transform = false;
          document.querySelector('.transform-tool')?.classList.remove('selected');
        }
      }
    });
  }

  private listenTools(): void {
    const tools: NodeListOf<HTMLLIElement> = document.querySelectorAll('.tool-item');
    tools?.forEach((tool: HTMLLIElement) => {
      tool?.addEventListener('click', (e) => {
        // console.log('event target', e.target);
        // console.log('current target', e.currentTarget);
        const toolName = tool.id;
        if (toolName && e.target instanceof HTMLLIElement) {
          // console.log(toolName);
          if (e.target.classList.contains('tool-item')) {
            //TODO: спрятать другие открытые менюхи и убрать .selected с.tool-item с открытым меню
            //TODO: если открыты подменю, то закрывать их
            this.showToolOptionsList(toolName);
            this.updateElements();
          } else {
            const optionName = e.target.id;
            // console.log(optionName, toolName);
            this.showOptionControls(optionName, toolName);
            this.updateElements();
          }
        }
      });
    });
  }

  private listenToolOptions(): void {
    this.listenResize();
    this.listenFlipAndRotate();
    this.listenFilters();
    this.listenAdjustments();
    //TODO сюда добавятся методы и на другие опции
  }

  private showToolOptionsList(toolName: string): void {
    const options: HTMLElement | null = document.querySelector(`.${toolName}-list`);
    const toolItem: HTMLElement | null = document.querySelector(`.${toolName}-tool`);

    if (State.tools[toolName]) {
      options?.classList.add('hidden');
      toolItem?.classList.remove('selected');
      State.tools[toolName] = !State.tools[toolName];
    } else {
      if (toolName === 'adjustments' && State.controls.adjustments) {
        const adjustBackArr = document.getElementById('adjustments-arrow');
        adjustBackArr?.click();
      } else {
        this.hideOpenedToolMenus();
        this.hideOpenedOptionControls();
        options?.classList.remove('hidden');
        toolItem?.classList.add('selected');
        State.tools[toolName] = !State.tools[toolName];
      }
    }
  }

  private showOptionControls(optionName: string, toolName: string): void {
    const controls = document.querySelector(`.${optionName}-controls`);
    if (toolName === 'adjustments') {
      this.updateAgjustControls(optionName);
      this.showAdjustControls();
      this.hideAdjustOptionsList();
    } else {
      const toolOptionsList: Element | null | undefined = controls?.parentElement?.previousElementSibling;
      controls?.classList.remove('hidden');
      toolOptionsList?.classList.add('hidden');
      State.controls[optionName] = true;
      State.tools[toolName] = false;
    }
  }

  private hideOptionControls(optionName: string): void {
    const controls = document.querySelector(`.${optionName}-controls`);
    const toolOptionsList: Element | null | undefined = controls?.parentElement?.previousElementSibling;
    controls?.classList.add('hidden');
    toolOptionsList?.classList.remove('hidden');
    State.controls[optionName] = false;

    if (optionName === 'adjustments') {
      State.tools.adjustments = true;
    } else {
      State.tools.transform = true;
    }
  }

  private listenBackArrows(): void {
    const backArrows = document.querySelectorAll('.back-arrow');

    backArrows.forEach((arrow) => {
      arrow.addEventListener('click', () => {
        const optionName: string = arrow.id.slice(0, -6);
        this.hideOptionControls(optionName);
      });
    });
  }

  //_______________________________________________RESIZE
  private listenResize(): void {
    this.listenResizeDoneBtn();
    this.listenResizeInputs();
    this.listenLockProportions();
  }

  private listenResizeInputs(): void {
    const inputs = document.querySelectorAll('.resize-input');
    const widthInput = document.getElementById('width-input');
    const heightInput = document.getElementById('height-input');
    inputs.forEach((input) => {
      input.addEventListener('change', (event) => {
        if (event.target instanceof HTMLInputElement) {
          event.target.value = event.target.value.replace(/[^0-9 ]+/g, '');
          if (event.target.value.startsWith('0')) {
            event.target.value = '';
          }
        }
        if (input instanceof HTMLInputElement && state.saveProportions === true) {
          if (input.id === 'width-input' && heightInput instanceof HTMLInputElement) {
            if (input.value.length === 0) {
              input.value = String(state.imageWidth);
            } else {
              heightInput.value = String(getRightSide('height', +input.value));
            }
          } else if (input.id === 'height-input' && widthInput instanceof HTMLInputElement) {
            if (input.value.length === 0) {
              input.value = String(state.imageHeight);
            } else {
              widthInput.value = String(getRightSide('width', +input.value));
            }
          } else {
            return;
          }
        }
        console.log('Input changed!!');
        this.enableDoneBtn();
      });
    });
  }

  private listenLockProportions(): void {
    const propControl = document.querySelector('.proportions');
    propControl?.addEventListener('click', () => {
      propControl.classList.toggle('locked');
      state.saveProportions = !state.saveProportions;
      console.log(`lockProportions: ${state.saveProportions}`);
    });
  }

  private enableDoneBtn(): void {
    const doneBtn = document.querySelector('.done-btn');
    doneBtn?.removeAttribute('disabled');
  }

  private listenResizeDoneBtn(): void {
    const doneBtn = document.querySelector('.done-btn');
    doneBtn?.addEventListener('click', () => {
      console.log('resize - click done');
      this.model.resizeImage();
      //TODO: подумать нужно ли после применения изменений закрывать все менюшки и выдавать какое-то уведомление, что Image has been resized
      //TODO: если всё закрываем, то в resize переписываем инпуты на новые размеры и лочим кнопку Готово?
    });
  }

  //_______________________________________________FLIP & ROTATE
  private listenFlipAndRotate(): void {
    const flipVert = document.querySelector('.flip-vert');
    const flipHor = document.querySelector('.flip-hor');
    const rotateLeft = document.querySelector('.rotate-left');
    const rotateRight = document.querySelector('.rotate-right');

    flipVert?.addEventListener('click', () => {
      console.log('flip vertically');
      this.model.flipImage('vertical');
    });

    flipHor?.addEventListener('click', () => {
      console.log('flip horizontally');
      this.model.flipImage('horizontal');
    });

    rotateLeft?.addEventListener('click', () => {
      console.log('rotate left');
      this.model.rotateImage('left');
    });

    rotateRight?.addEventListener('click', () => {
      console.log('rotate right');
      this.model.rotateImage('right');
    });
  }

  //_______________________________________________FILTERS
  private listenFilters(): void {
    const filters = document.querySelectorAll('.filter');
    filters.forEach((filter, index) => {
      filter.addEventListener('click', () => {
        document.querySelector('.filter.selected')?.classList.remove('selected');
        filter.classList.add('selected');
        console.log(`filter with index ${index} was chosen`);
        this.model.applyFilter(index);
        this.updateElements();
      });
    });
  }

  //_______________________________________________ADJUSTMENTS
  private updateAgjustControls(optionName: string): void {
    const option: HTMLElement | null = document.querySelector(`.adjust-title`);
    if (option) {
      option.innerText = optionName;
      this.model.setAdjustment(optionName);
      this.updateElements();
    }
    //TODO: заполнить в adjust-range-input value значение из стейта (по optionName?)
    //TODO: заполнить в adjust-number-input value значение из стейта (по optionName?)
    console.log('optionName', optionName);
    const inputRange: HTMLInputElement | null = document.querySelector('.adjust-range-input');
    const inputPercentage: HTMLInputElement | null = document.querySelector('.adjust-number-input');
    console.log(inputRange?.value, inputPercentage?.value);
  }

  private showAdjustControls(): void {
    const adjustControls = document.querySelector('.adjustments-controls');
    adjustControls?.classList.remove('hidden');
    State.controls.adjustments = true;
  }

  private hideAdjustOptionsList(): void {
    const toolOptionsList = document.querySelector('.adjustments-list');
    toolOptionsList?.classList.add('hidden');
    State.tools.adjustments = false;
  }

  private listenAdjustments(): void {
    const range: HTMLInputElement | null = document.querySelector('.adjust-range-input');
    const inputNum: HTMLInputElement | null = document.querySelector('.adjust-number-input');
    const adjustmentTitle: HTMLElement | null = document.querySelector('.adjust-title');
    const adjustmentName = adjustmentTitle?.innerText;

    //Здесь специально отлавливается событие change, а не input
    range?.addEventListener('change', () => {
      if (inputNum) {
        inputNum.value = range.value;
        this.model.useAdjustment(range.value);
        console.log(`${adjustmentName} выставлен на уровень ${inputNum.value}`);
      }
    });

    inputNum?.addEventListener('input', () => {
      if (range) {
        if (+inputNum.value < 0) {
          inputNum.value = inputNum.value.replace(/[^0-9 ]+/g, '');
        }
        if (inputNum.value.startsWith('00') || inputNum.value.startsWith('-0')) {
          inputNum.value = '0';
        }
        if (+inputNum.value > 100) {
          inputNum.value = '100';
        }
        range.value = inputNum.value;
        this.model.useAdjustment(range.value);
        console.log(`${adjustmentName} выставлен на уровень ${range.value}`);
      }
    });
  }
}

export default Editor;
