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
            this.showToolOptionsList(toolName);
            this.updateElements();
          } else {
            const optionName = e.target.id;
            // console.log(optionName);
            this.showOptionControls(optionName);
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
    //TODO сюда добавятся методы и на другие опции
  }

  private showToolOptionsList(toolName: string): void {
    const options = document.querySelector(`.${toolName}-list`);
    const toolItem = document.querySelector(`.${toolName}-tool`);
    options?.classList.toggle('hidden');
    toolItem?.classList.toggle('selected');
  }

  private showOptionControls(optionName: string): void {
    const controls = document.querySelector(`.${optionName}-controls`);
    const toolOptionsList: Element | null | undefined = controls?.parentElement?.previousElementSibling;
    controls?.classList.remove('hidden');
    toolOptionsList?.classList.add('hidden');
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
}

export default Editor;
