import Model from '../model/model';

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
          } else {
            const optionName = e.target.id;
            // console.log(optionName);
            this.showOptionControls(optionName);
          }
        }
      });
    });
  }

  private listenToolOptions(): void {
    this.listenResize();
    //TODO сюда добавятся методы и на другие опции (flip/rotate, brightness и т.д)
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
    inputs.forEach((input) => {
      input.addEventListener('change', () => {
        console.log('Input changed!!');
        //разлочиваем кнопку Готово, а потом по клику на кнопку пойдёт запрос на изменения в listenResizeDoneBtn()
        this.enableDoneBtn();
      });
    });
  }

  private listenLockProportions() {
    const propControl = document.querySelector('.proportions');
    propControl?.addEventListener('click', () => {
      propControl.classList.toggle('locked');
      //TODO: передать в модель инфу, что пропорции для resize разлочены/залочены
    });
    console.log('listen proportions');
  }

  private enableDoneBtn(): void {
    const doneBtn = document.querySelector('.done-btn');
    doneBtn?.removeAttribute('disabled');
  }

  private listenResizeDoneBtn(): void {
    const doneBtn = document.querySelector('.done-btn');
    doneBtn?.addEventListener('click', () => {
      console.log('resize - click done');
      //TODO: метод модели, который применяет изменения resize
      //TODO: отсюда передавать значения инпутов или потом в модели их тянуть?)
      //TODO: подумать нужно ли после применения изменений закрывать все менюшки и выдавать какое-то уведомление, что Image has been resized
      //TODO: если всё закрываем, то в resize переписываем инпуты на новые размеры и лочим кнопку Готово?
    });
  }
}

export default Editor;
