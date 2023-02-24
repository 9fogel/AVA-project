import Model from '../model/model';
import getRightSide from '../utils/getSide';
import CanvasState from '../model/canvasState';
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
    // this.model.removeCropArea();
    const resizeWidthInput = <HTMLInputElement>document.getElementById('width-input');
    const resizeHeightInput = <HTMLInputElement>document.getElementById('height-input');
    const adjustRangeInput = <HTMLInputElement>document.querySelector('.adjust-range-input');
    const adjustNumberInput = <HTMLInputElement>document.querySelector('.adjust-number-input');
    const adjustNumberSign = <HTMLInputElement>document.querySelector('.percentage-sign');
    resizeWidthInput.value = String(CanvasState.parameters.imageWidth);
    resizeHeightInput.value = String(CanvasState.parameters.imageHeight);
    const drawInput = <HTMLInputElement>document.getElementById('draw-color-input');
    drawInput.value = '#00d0c3';
    const filters = document.querySelectorAll('.filter');
    document.querySelector('.filter.selected')?.classList.remove('selected');
    filters.forEach((filter, index) => {
      if (index === CanvasState.parameters.currentPreset) {
        filter.classList.add('selected');
      }
    });

    switch (CanvasState.parameters.currentAdjustment) {
      case 'blur':
        adjustRangeInput.value = String(CanvasState.parameters.blur);
        adjustNumberInput.value = String(CanvasState.parameters.blur);
        adjustRangeInput.max = '100';
        adjustNumberInput.max = '100';
        adjustNumberSign.innerText = 'px';
        break;
      case 'brightness':
        adjustRangeInput.value = String(CanvasState.parameters.brightness);
        adjustNumberInput.value = String(CanvasState.parameters.brightness);
        adjustRangeInput.max = '300';
        adjustNumberInput.max = '300';
        adjustNumberSign.innerText = '%';
        break;
      case 'contrast':
        adjustRangeInput.value = String(CanvasState.parameters.contrast);
        adjustNumberInput.value = String(CanvasState.parameters.contrast);
        adjustRangeInput.max = '200';
        adjustNumberInput.max = '200';
        adjustNumberSign.innerText = '%';
        break;
      case 'grayscale':
        adjustRangeInput.value = String(CanvasState.parameters.grayscale);
        adjustNumberInput.value = String(CanvasState.parameters.grayscale);
        adjustRangeInput.max = '100';
        adjustNumberInput.max = '100';
        adjustNumberSign.innerText = '%';
        break;
      case 'hue':
        adjustRangeInput.value = String(CanvasState.parameters.hue);
        adjustNumberInput.value = String(CanvasState.parameters.hue);
        adjustRangeInput.max = '360';
        adjustNumberInput.max = '360';
        adjustNumberSign.innerText = '°';
        break;
      case 'pixelate':
        adjustRangeInput.value = String(CanvasState.parameters.pixelate);
        adjustNumberInput.value = String(CanvasState.parameters.pixelate);
        break;
      case 'saturation':
        adjustRangeInput.value = String(CanvasState.parameters.saturation);
        adjustNumberInput.value = String(CanvasState.parameters.saturation);
        adjustRangeInput.max = '300';
        adjustNumberInput.max = '300';
        adjustNumberSign.innerText = '%';
        break;
      case 'sepia':
        adjustRangeInput.value = String(CanvasState.parameters.sepia);
        adjustNumberInput.value = String(CanvasState.parameters.sepia);
        adjustRangeInput.max = '200';
        adjustNumberInput.max = '200';
        adjustNumberSign.innerText = '%';
        break;
      case 'invert':
        adjustRangeInput.value = String(CanvasState.parameters.invert);
        adjustNumberInput.value = String(CanvasState.parameters.invert);
        adjustRangeInput.max = '100';
        adjustNumberInput.max = '100';
        adjustNumberSign.innerText = '%';
        break;
      case 'opacity':
        adjustRangeInput.value = String(CanvasState.parameters.opacity);
        adjustNumberInput.value = String(CanvasState.parameters.opacity);
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
    this.hideMessageWrap();
    //TODO: убирать слушатель draw?
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
    this.hideMessageWrap();
    this.model.removeCropArea();
    this.model.stopDrawOnCanvas();
    this.model.resetZoom();
  }

  private listenTools(): void {
    const tools: NodeListOf<HTMLLIElement> = document.querySelectorAll('.tool-item');
    tools?.forEach((tool: HTMLLIElement) => {
      tool?.addEventListener('click', (e) => {
        // console.log('event target', e.target);
        // console.log('current target', e.currentTarget);
        const toolName = tool.id;
        if (toolName && e.target instanceof HTMLLIElement) {
          if (e.target.classList.contains('tool-item')) {
            this.showToolOptionsList(toolName);
            this.updateElements();
          } else {
            const optionName = e.target.id;
            console.log(optionName, toolName);
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
    this.listenCrop();
    this.listenDraw();
    //TODO сюда добавятся методы и на другие опции
  }

  private showToolOptionsList(toolName: string): void {
    const options: HTMLElement | null = document.querySelector(`.${toolName}-list`);
    const toolItem: HTMLElement | null = document.querySelector(`.${toolName}-tool`);

    if (State.tools[toolName]) {
      options?.classList.add('hidden');
      toolItem?.classList.remove('selected');
      State.tools[toolName] = !State.tools[toolName];
      this.hideMessageWrap();
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
        // console.log(optionName);
        if (optionName === 'draw' || optionName === 'border') {
          //TODO: убирать слушатель с канваса после закрытия менюшки draw через стрелку?
          this.hideOpenedToolMenus();
        }
        this.hideOptionControls(optionName);
      });
    });
  }

  //________________________________________________CROP
  private listenCrop(): void {
    this.listenCropArea();
    this.listenCropDone();
    this.listenCropColorInput();
    this.listenCropBackArrow();
  }

  private listenCropArea(): void {
    document.getElementById('crop')?.addEventListener('click', () => {
      this.model.selectCropArea();
    });
  }

  private listenCropDone(): void {
    document.getElementById('crop-done')?.addEventListener('click', () => {
      this.model.cropImage();
    });
  }

  private listenCropColorInput(): void {
    document.getElementById('crop-color-input')?.addEventListener('input', () => {
      this.model.cropColorChange();
    });
  }

  private listenCropBackArrow(): void {
    document.getElementById('crop-arrow')?.addEventListener('click', () => {
      this.model.removeCropArea();
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
        if (input instanceof HTMLInputElement) {
          if (input.id === 'width-input' && heightInput instanceof HTMLInputElement) {
            if (input.value.length === 0) {
              input.value = String(CanvasState.parameters.imageWidth);
            } else if (input.value.length !== 0 && CanvasState.parameters.saveProportions === true) {
              heightInput.value = String(getRightSide('height', +input.value));
            }
          } else if (input.id === 'height-input' && widthInput instanceof HTMLInputElement) {
            if (input.value.length === 0) {
              input.value = String(CanvasState.parameters.imageHeight);
            } else if (input.value.length !== 0 && CanvasState.parameters.saveProportions === true) {
              widthInput.value = String(getRightSide('width', +input.value));
            }
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
      CanvasState.parameters.saveProportions = !CanvasState.parameters.saveProportions;
      console.log(`lockProportions: ${CanvasState.parameters.saveProportions}`);
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
    const messageWrap: HTMLElement | null = document.querySelector('.filters-message');
    filters.forEach((filter, index) => {
      filter.addEventListener('click', () => {
        if (
          index < 5 ||
          (index >= 5 && index < 10 && (State.userState === 'user' || State.userState === 'premium')) ||
          (index >= 10 && State.userState === 'premium')
        ) {
          document.querySelector('.filter.selected')?.classList.remove('selected');
          filter.classList.add('selected');
          this.model.applyFilter(index);
          this.updateElements();
        } else {
          console.log(`NO ACCESS TO Filter ${index}`);
          messageWrap?.classList.remove('hidden');
          this.listenMessageWrap();
          if (messageWrap && index >= 5 && index < 10) {
            messageWrap.innerText = 'Sorry, this filter is available for registered users only';
          }

          if (messageWrap && index >= 10) {
            messageWrap.innerText =
              'Sorry, this filter is available only for users with premium access. Please visit profile page to get your promo';
          }
        }
      });
    });
  }

  private listenMessageWrap() {
    const messageWrap = document.querySelector('.filters-message');
    messageWrap?.addEventListener('click', () => {
      this.hideMessageWrap();
      //TODO: прятать, когда закрываются все менюшки
    });
  }

  private hideMessageWrap() {
    const messageWrap = document.querySelector('.filters-message');
    messageWrap?.classList.add('hidden');
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

  // _______________________________________________________DRAW
  private listenDraw(): void {
    this.listenDrawArea();
    this.listenDrawColorInput();
    this.listenDrawBackArrow();
    this.listenDrawLineWidthInput();
    this.listenClearDrawing();
  }

  private listenDrawArea() {
    document.getElementById('draw')?.addEventListener('click', (event) => {
      if (event.target instanceof HTMLLIElement) {
        if (event.target.id === 'draw') {
          this.model.startDrawOnCanvas();
          event.stopPropagation();
        }
      }
    });
  }
  private listenClearDrawing(): void {
    document.querySelector('.draw-clear-btn')?.addEventListener('click', () => {
      this.model.clearDrawing();
    });
  }
  private listenDrawColorInput(): void {
    document.getElementById('draw-color-input')?.addEventListener('input', () => {
      this.model.drawColorChange();
    });
  }

  private listenDrawLineWidthInput(): void {
    document.getElementById('draw-width')?.addEventListener('input', (event) => {
      if (event.target instanceof HTMLInputElement) {
        event.target.value = event.target.value.replace(/[^0-9 ]+/g, '');
        if (event.target.value.startsWith('0')) {
          event.target.value = '1';
        }
      }
      this.model.drawLineWidthChange();
    });
  }

  private listenDrawBackArrow(): void {
    document.getElementById('draw-arrow')?.addEventListener('click', (event) => {
      this.model.stopDrawOnCanvas();
      event.stopPropagation();
    });
  }
}

export default Editor;
