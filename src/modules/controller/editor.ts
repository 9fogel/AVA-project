import Model from '../model/model';
import getRightSide from '../utils/getSide';
import state from '../model/state';

class Editor {
  private readonly model: Model;

  constructor() {
    this.model = new Model();
  }

  public handleEditor(): void {
    this.listenTools();
    this.listenToolOptions();
    this.listenBackArrows();
  }

  public updateElements() {
    const widthInput = document.getElementById('width-input');
    const heightInput = document.getElementById('height-input');
    if (widthInput instanceof HTMLInputElement && heightInput instanceof HTMLInputElement) {
      widthInput.value = String(state.imageWidth);
      heightInput.value = String(state.imageHeight);
    }
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
    const options = document.querySelector(`.${toolName}-list`);
    const toolItem = document.querySelector(`.${toolName}-tool`);
    options?.classList.toggle('hidden');
    toolItem?.classList.toggle('selected');
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
    }
  }

  private hideOptionControls(optionName: string): void {
    const controls = document.querySelector(`.${optionName}-controls`);
    const toolOptionsList: Element | null | undefined = controls?.parentElement?.previousElementSibling;
    controls?.classList.add('hidden');
    toolOptionsList?.classList.remove('hidden');
  }

  private listenBackArrows(): void {
    const backArrows = document.querySelectorAll('.back-arrow');
    // console.log(backArrows);
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
      input.addEventListener('input', (event) => {
        if (event.target instanceof HTMLInputElement) {
          event.target.value = event.target.value.replace(/[^0-9 ]+/g, '');
        }
        if (input instanceof HTMLInputElement && state.saveProportions === true) {
          if (input.id === 'width-input' && heightInput instanceof HTMLInputElement) {
            heightInput.value = String(getRightSide('height', +input.value));
          } else if (input.id === 'height-input' && widthInput instanceof HTMLInputElement) {
            widthInput.value = String(getRightSide('width', +input.value));
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
      const widthInput = document.getElementById('width-input');
      const heightInput = document.getElementById('height-input');
      if (widthInput instanceof HTMLInputElement && heightInput instanceof HTMLInputElement) {
        state.imageWidth = +widthInput.value;
        state.imageHeight = +heightInput.value;
      }
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
      //TODO: метод модели, который отражает по вертикали
    });

    flipHor?.addEventListener('click', () => {
      console.log('flip horizontally');
      //TODO: метод модели, который отражает по горизонтали
    });

    rotateLeft?.addEventListener('click', () => {
      console.log('rotate left');
      state.imageRotateDegree -= 90;
      if (state.imageRotateDegree === -360) {
        state.imageRotateDegree = 0;
      }
      this.model.rotateImage();
    });

    rotateRight?.addEventListener('click', () => {
      console.log('rotate right');
      state.imageRotateDegree += 90;
      if (state.imageRotateDegree === 360) {
        state.imageRotateDegree = 0;
      }
      this.model.rotateImage();
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
        //TODO: метод модели, который применяет фильтр
      });
    });
  }

  //_______________________________________________ADJUSTMENTS
  private updateAgjustControls(optionName: string) {
    const option: HTMLElement | null = document.querySelector(`.adjust-title`);
    if (option) {
      option.innerText = optionName;
    }
    //TODO: заполнить в adjust-range-input value значение из стейта (по optionName?)
    //TODO: заполнить в adjust-number-input value значение из стейта (по optionName?)
    console.log('optionName', optionName);
    const inputRange: HTMLInputElement | null = document.querySelector('.adjust-range-input');
    const inputPercentage: HTMLInputElement | null = document.querySelector('.adjust-number-input');
    console.log(inputRange?.value, inputPercentage?.value);
  }

  private showAdjustControls() {
    const adjustControls = document.querySelector('.adjustments-controls');
    adjustControls?.classList.remove('hidden');
  }

  private hideAdjustOptionsList() {
    const toolOptionsList = document.querySelector('.adjustments-list');
    toolOptionsList?.classList.add('hidden');
  }

  private listenAdjustments() {
    const range: HTMLInputElement | null = document.querySelector('.adjust-range-input');
    const inputNum: HTMLInputElement | null = document.querySelector('.adjust-number-input');
    const adjustmentTitle: HTMLElement | null = document.querySelector('.adjust-title');
    const adjustmentName = adjustmentTitle?.innerText;

    //Здесь специально отлавливается событие change, а не input
    range?.addEventListener('change', () => {
      if (inputNum) {
        inputNum.value = range.value;
        //TODO: метод модели, который применяет изменения adjustments
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
        //TODO: метод модели, который применяет изменения adjustments
        console.log(`${adjustmentName} выставлен на уровень ${range.value}`);
      }
    });
  }
}

export default Editor;
