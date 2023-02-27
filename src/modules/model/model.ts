import CanvasState from './canvasState';
import Presets from './presets';
import checkSelectedTools from '../utils/checkTools';

class Model {
  private canvas: HTMLCanvasElement | null;
  private context: CanvasRenderingContext2D | null;
  private image: HTMLImageElement | null;
  private defaultImage: HTMLImageElement | null;
  private readonly presets: Presets;

  constructor() {
    this.canvas = document.getElementById('canvas') as HTMLCanvasElement | null;
    this.context = this.canvas?.getContext('2d') as CanvasRenderingContext2D | null;
    this.image = document.getElementById('sourceImage') as HTMLImageElement | null;
    this.defaultImage = document.getElementById('defaultImage') as HTMLImageElement | null;
    this.presets = new Presets();
  }

  public async uploadImage(): Promise<void> {
    const fileInput: HTMLElement | null = document.getElementById('fileInput');

    if (fileInput instanceof HTMLInputElement) {
      const files: FileList | null = fileInput.files;

      if (files && this.image && this.canvas && this.defaultImage) {
        this.image.src = URL.createObjectURL(files[0]);
        this.defaultImage.src = URL.createObjectURL(files[0]);
        await this.image.decode();
        if (this.image) {
          CanvasState.resetState();
          CanvasState.parameters.imageWidth = this.image.naturalWidth;
          CanvasState.parameters.imageHeight = this.image.naturalHeight;
          this.applyСhanges();
          this.setFilterPreviews();
        }
      }
    }
  }

  public deleteImage(): void {
    if (this.image && this.canvas && this.context) {
      this.image.src = '';
      this.applyСhanges();
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }

  public downloadImage(format: string, quality: number): void {
    if (this.canvas) {
      const link = document.createElement('a');
      link.download = 'image';
      link.href = this.canvas.toDataURL(`image/${format}`, quality);
      link.click();
    }
  }

  public resizeImage(): void {
    const widthInput = document.getElementById('width-input');
    const heightInput = document.getElementById('height-input');
    if (widthInput instanceof HTMLInputElement && heightInput instanceof HTMLInputElement) {
      CanvasState.parameters.imageWidth = +widthInput.value;
      CanvasState.parameters.imageHeight = +heightInput.value;
    }
    this.applyСhanges();
  }

  public rotateImage(side: string): void {
    if (CanvasState.parameters.imageflipVertical == -1 && CanvasState.parameters.imageflipHorizontal == 1) {
      side === 'right' ? (side = 'left') : (side = 'right');
    } else if (CanvasState.parameters.imageflipVertical == 1 && CanvasState.parameters.imageflipHorizontal == -1) {
      side === 'right' ? (side = 'left') : (side = 'right');
    }
    if (side === 'right') {
      CanvasState.parameters.imageRotateDegree += 90;
      if (CanvasState.parameters.imageRotateDegree === 360) {
        CanvasState.parameters.imageRotateDegree = 0;
      }
    } else if (side === 'left') {
      CanvasState.parameters.imageRotateDegree -= 90;
      if (CanvasState.parameters.imageRotateDegree === -360) {
        CanvasState.parameters.imageRotateDegree = 0;
      }
    }

    if (this.image && this.canvas && this.context) {
      const currentHeight = CanvasState.parameters.imageHeight;
      const currentWidth = CanvasState.parameters.imageWidth;
      CanvasState.parameters.imageWidth = currentHeight;
      CanvasState.parameters.imageHeight = currentWidth;
      this.canvas.width = CanvasState.parameters.imageWidth;
      this.canvas.height = CanvasState.parameters.imageHeight;
      CanvasState.parameters.imageProportions = CanvasState.parameters.imageWidth / CanvasState.parameters.imageHeight;
      CanvasState.parameters.imageRotate = !CanvasState.parameters.imageRotate;
      this.applyСhanges();
    }
  }

  public flipImage(flip: string): void {
    if (flip === 'vertical') {
      CanvasState.parameters.imageflipVertical = CanvasState.parameters.imageflipVertical === 1 ? -1 : 1;
    } else if (flip === 'horizontal') {
      CanvasState.parameters.imageflipHorizontal = CanvasState.parameters.imageflipHorizontal === 1 ? -1 : 1;
    }
    this.applyСhanges();
  }

  public setAdjustment(option: string): void {
    CanvasState.parameters.currentAdjustment = option;
  }

  public useAdjustment(value: string): void {
    switch (CanvasState.parameters.currentAdjustment) {
      case 'blur':
        CanvasState.parameters.blur = +value;
        break;
      case 'brightness':
        CanvasState.parameters.brightness = +value;
        break;
      case 'contrast':
        CanvasState.parameters.contrast = +value;
        break;
      case 'grayscale':
        CanvasState.parameters.grayscale = +value;
        break;
      case 'hue':
        CanvasState.parameters.hue = +value;
        break;
      case 'pixelate':
        CanvasState.parameters.pixelate = +value;
        break;
      case 'saturation':
        CanvasState.parameters.saturation = +value;
        break;
      case 'sepia':
        CanvasState.parameters.sepia = +value;
        break;
      case 'invert':
        CanvasState.parameters.invert = +value;
        break;
      case 'opacity':
        CanvasState.parameters.opacity = +value;
        break;
    }
    this.applyСhanges();
  }

  private resetAdjustments(): void {
    CanvasState.parameters.color = 'rgba(0, 0, 0, 0)';
    CanvasState.parameters.blur = 0;
    CanvasState.parameters.brightness = 100;
    CanvasState.parameters.contrast = 100;
    CanvasState.parameters.grayscale = 0;
    CanvasState.parameters.hue = 0;
    CanvasState.parameters.pixelate = 50;
    CanvasState.parameters.saturation = 100;
    CanvasState.parameters.invert = 0;
    CanvasState.parameters.sepia = 0;
    CanvasState.parameters.opacity = 100;
  }

  public applyFilter(index: number): void {
    this.resetAdjustments();
    CanvasState.parameters.currentPreset = index;
    this.presets.usePreset(index);
    this.applyСhanges();
  }

  private setFilterPreviews(): void {
    const filterImage = document.querySelectorAll('.filter');
    filterImage.forEach((image) => {
      if (image instanceof HTMLDivElement) {
        image.style.backgroundImage = `url(${this.image?.src})`;
        image.style.backgroundBlendMode = 'overlay';
        image.style.backgroundPosition = 'center';
        image.style.backgroundSize = 'cover';
      }
    });
  }

  private mouseCropEvents = {
    mouseover(): void {
      if (CanvasState.parameters.selection) {
        const canvas = document.getElementById('canvas') as HTMLCanvasElement | null;
        if (canvas) {
          canvas.style.cursor = 'crosshair';
        }
      }
    },

    mousedown(): void {
      const { clientX, clientY, offsetX, offsetY } = event as MouseEvent;
      CanvasState.parameters.startX = clientX;
      CanvasState.parameters.startY = clientY;
      CanvasState.parameters.relativeStartX = offsetX;
      CanvasState.parameters.relativeStartY = offsetY;
      CanvasState.parameters.startSelection = true;
      const cropDone = document.getElementById('crop-done') as HTMLButtonElement;
      cropDone.disabled = false;
    },

    mousemove(): void {
      const { clientX, clientY } = event as MouseEvent;

      CanvasState.parameters.endX = clientX;
      CanvasState.parameters.endY = clientY;

      if (CanvasState.parameters.startSelection && CanvasState.parameters.selection) {
        CanvasState.parameters.selection.style.display = 'initial';
        CanvasState.parameters.selection.style.top = `${CanvasState.parameters.startY}px`;
        CanvasState.parameters.selection.style.left = `${CanvasState.parameters.startX}px`;
        CanvasState.parameters.selection.style.width = `${
          CanvasState.parameters.endX - CanvasState.parameters.startX
        }px`;
        CanvasState.parameters.selection.style.height = `${
          CanvasState.parameters.endY - CanvasState.parameters.startY
        }px`;

        const canvas = document.getElementById('canvas') as HTMLCanvasElement | null;

        if (canvas && CanvasState.parameters.selection) {
          const toolWidth = document.getElementById('selection-tool-width') as HTMLSpanElement;
          toolWidth.innerText = `${Math.ceil(
            (canvas.width / canvas.offsetWidth) *
              Number(CanvasState.parameters.selection.style.width.replace('px', '')),
          )}`;

          const toolHeigth = document.getElementById('selection-tool-height') as HTMLSpanElement;
          toolHeigth.innerText = `${Math.ceil(
            (canvas.height / canvas.offsetHeight) *
              Number(CanvasState.parameters.selection.style.height.replace('px', '')),
          )}`;
        }
      }
    },

    mouseup(): void {
      CanvasState.parameters.startSelection = false;
      const { offsetX, offsetY } = event as MouseEvent;
      CanvasState.parameters.relativeEndX = offsetX;
      CanvasState.parameters.relativeEndY = offsetY;
    },
  };

  public selectCropArea(): void {
    CanvasState.parameters.startSelection = false;
    if (this.canvas) {
      this.canvas.addEventListener('mouseover', this.mouseCropEvents.mouseover);
      this.canvas.addEventListener('mousedown', this.mouseCropEvents.mousedown);
      this.canvas.addEventListener('mouseup', this.mouseCropEvents.mouseup);
      this.canvas.addEventListener('mousemove', this.mouseCropEvents.mousemove);
    }
    CanvasState.parameters.imageCrop = true;
  }

  public removeCropArea(): void {
    if (this.canvas && CanvasState.parameters.selection) {
      this.canvas.removeEventListener('mouseover', this.mouseCropEvents.mouseover);
      this.canvas.removeEventListener('mousedown', this.mouseCropEvents.mousedown);
      this.canvas.removeEventListener('mouseup', this.mouseCropEvents.mouseup);
      this.canvas.removeEventListener('mousemove', this.mouseCropEvents.mousemove);
      CanvasState.parameters.selection.style.display = 'none';
      this.canvas.style.cursor = 'auto';
    }
    const cropDone = document.getElementById('crop-done');
    cropDone?.setAttribute('disabled', 'true');
    CanvasState.parameters.imageCrop = false;
  }

  public cropColorChange(): void {
    const selectionTool = document.getElementById('selection-tool');
    const selectionSpanWidth = document.getElementById('selection-tool-width');
    const selectionSpanHeight = document.getElementById('selection-tool-height');
    const inputColor = document.getElementById('crop-color-input') as HTMLInputElement;
    if (selectionTool && selectionSpanWidth && selectionSpanHeight) {
      selectionTool.style.border = `2px dashed ${inputColor.value}`;
      selectionSpanHeight.style.color = inputColor.value;
      selectionSpanWidth.style.color = inputColor.value;
    }
  }

  public cropImage(): void {
    if (this.canvas && this.context && CanvasState.parameters.selection) {
      const widthFactor = this.canvas.width / this.canvas.offsetWidth;
      const heightFactor = this.canvas.height / this.canvas.offsetHeight;

      const selectionWidth = Number(CanvasState.parameters.selection.style.width.replace('px', ''));
      const selectionHeight = Number(CanvasState.parameters.selection.style.height.replace('px', ''));

      CanvasState.parameters.croppedWidth = selectionWidth * widthFactor;
      CanvasState.parameters.croppedHeight = selectionHeight * heightFactor;

      CanvasState.parameters.actualX = CanvasState.parameters.relativeStartX * widthFactor;
      CanvasState.parameters.actualY = CanvasState.parameters.relativeStartY * heightFactor;

      this.applyСhanges();

      CanvasState.parameters.selection.style.display = 'none';
      const cropDone = document.getElementById('crop-done') as HTMLButtonElement;
      cropDone.disabled = true;
    }
  }

  public async resetChanges(): Promise<void> {
    CanvasState.resetState();
    if (this.image && this.defaultImage) {
      CanvasState.parameters.imageWidth = this.defaultImage.naturalWidth;
      CanvasState.parameters.imageHeight = this.defaultImage.naturalHeight;
      this.image.src = this.defaultImage.src;
      await this.image.decode();
    }

    this.applyСhanges();
  }

  private mouseDrawEvents = {
    mousedown(e: { offsetY: number; offsetX: number; clientX: number; clientY: number }): void {
      const drawCanvas = document.getElementById('canvas2') as HTMLCanvasElement;
      const context = drawCanvas?.getContext('2d') as CanvasRenderingContext2D;

      CanvasState.parameters.isDrawing = true;
      context.beginPath();
      context.lineWidth = CanvasState.parameters.lineWidth;
      context.strokeStyle = CanvasState.parameters.strokeStyle;
      context.lineJoin = 'round';
      context.lineCap = 'round';
      const widthFactor = drawCanvas.width / drawCanvas.offsetWidth;
      const heightFactor = drawCanvas.height / drawCanvas.offsetHeight;
      context.moveTo(
        -drawCanvas.width / 2 + e.offsetX * widthFactor,
        -drawCanvas.height / 2 + e.offsetY * heightFactor,
      );

      const doneBtn = document.querySelector('.draw-done-btn') as HTMLButtonElement;
      doneBtn.disabled = false;
      const clearBtn = document.querySelector('.draw-clear-btn') as HTMLButtonElement;
      clearBtn.disabled = false;
    },
    mousemove(e: { offsetY: number; offsetX: number; clientX: number; clientY: number }): void {
      const drawCanvas = document.getElementById('canvas2') as HTMLCanvasElement;
      const context = drawCanvas?.getContext('2d') as CanvasRenderingContext2D;
      if (CanvasState.parameters.isDrawing === true) {
        const widthFactor = drawCanvas.width / drawCanvas.offsetWidth;
        const heightFactor = drawCanvas.height / drawCanvas.offsetHeight;
        context.lineTo(
          -drawCanvas.width / 2 + e.offsetX * widthFactor,
          -drawCanvas.height / 2 + e.offsetY * heightFactor,
        );
        context.stroke();
      }
    },
    mouseup(): void {
      const drawCanvas = document.getElementById('canvas2') as HTMLCanvasElement;
      const context = drawCanvas?.getContext('2d') as CanvasRenderingContext2D;
      CanvasState.parameters.isDrawing = false;
      context.closePath();
    },
  };

  public startDrawOnCanvas() {
    if (this.canvas && this.context && this.image) {
      const drawCanvas = document.getElementById('canvas2') as HTMLCanvasElement;
      const context = drawCanvas?.getContext('2d') as CanvasRenderingContext2D;

      drawCanvas.style.display = 'block';
      drawCanvas.width = this.canvas?.width;
      drawCanvas.height = this.canvas?.height;
      context.translate(drawCanvas.width / 2, drawCanvas.height / 2);
      context.save();
      context.scale(CanvasState.parameters.imageflipVertical, CanvasState.parameters.imageflipHorizontal);
      context.rotate((CanvasState.parameters.imageRotateDegree * Math.PI) / 180);
      context.restore();

      drawCanvas.addEventListener('mousedown', this.mouseDrawEvents.mousedown);
      drawCanvas.addEventListener('mouseup', this.mouseDrawEvents.mouseup);
      drawCanvas.addEventListener('mousemove', this.mouseDrawEvents.mousemove);
      drawCanvas.style.cursor = 'crosshair';

      document.querySelector('.draw-done-btn')?.addEventListener('click', async (e) => {
        e.stopPropagation();

        if (this.image && this.canvas) {
          const newCanvas = document.createElement('canvas') as HTMLCanvasElement;
          const newContext = newCanvas?.getContext('2d') as CanvasRenderingContext2D;

          newCanvas.width = this.canvas.width;
          newCanvas.height = this.canvas.height;

          newContext.translate(this.canvas.width / 2, this.canvas.height / 2);
          newContext.save();
          newContext.scale(CanvasState.parameters.imageflipVertical, CanvasState.parameters.imageflipHorizontal);
          newContext.rotate((CanvasState.parameters.imageRotateDegree * Math.PI) / 180);

          if (CanvasState.parameters.imageRotate === false) {
            newContext.drawImage(
              this.image,
              -this.canvas.width / 2,
              -this.canvas.height / 2,
              this.canvas.width,
              this.canvas.height,
            );
          } else if (CanvasState.parameters.imageRotate === true) {
            newContext.drawImage(
              this.image,
              -this.canvas.height / 2,
              -this.canvas.width / 2,
              this.canvas.height,
              this.canvas.width,
            );
          }
          newContext.restore();

          if (CanvasState.parameters.imageRotate === true) {
            newContext.drawImage(
              drawCanvas,
              -drawCanvas.width / 2,
              -drawCanvas.height / 2,
              drawCanvas.width,
              drawCanvas.height,
            );
          } else if (CanvasState.parameters.imageRotate === false) {
            newContext.drawImage(
              drawCanvas,
              -drawCanvas.width / 2,
              -drawCanvas.height / 2,
              drawCanvas.width,
              drawCanvas.height,
            );
          }

          this.image.src = newCanvas.toDataURL();

          if (CanvasState.parameters.imageRotate === false) {
            CanvasState.parameters.imageflipVertical = 1;
            CanvasState.parameters.imageflipHorizontal = 1;
            CanvasState.parameters.imageRotateDegree = 0;
          } else {
            CanvasState.parameters.imageflipVertical = 1;
            CanvasState.parameters.imageflipHorizontal = 1;
            CanvasState.parameters.imageRotateDegree = 0;
            CanvasState.parameters.imageRotate = !CanvasState.parameters.imageRotate;
          }

          this.image.onload = () => {
            this.applyСhanges();
          };
        }
        const doneBtn = document.querySelector('.draw-done-btn') as HTMLButtonElement;
        doneBtn.disabled = true;
        const clearBtn = document.querySelector('.draw-clear-btn') as HTMLButtonElement;
        clearBtn.disabled = true;
      });
      if (!document.getElementById('draw')?.classList.contains('selected')) {
        this.stopDrawOnCanvas();
      }
    }
  }

  public stopDrawOnCanvas() {
    if (this.canvas && this.context) {
      const drawCanvas = document.getElementById('canvas2') as HTMLCanvasElement;
      const context = drawCanvas?.getContext('2d') as CanvasRenderingContext2D;

      context.clearRect(-drawCanvas.height / 2, -drawCanvas.width / 2, drawCanvas.height, drawCanvas.width);
      drawCanvas.style.display = 'none';
      drawCanvas.style.cursor = 'auto';

      drawCanvas.removeEventListener('mousedown', this.mouseDrawEvents.mousedown);
      drawCanvas.removeEventListener('mouseup', this.mouseDrawEvents.mouseup);
      drawCanvas.removeEventListener('mousemove', this.mouseDrawEvents.mousemove);
    }
    const doneBtn = document.querySelector('.draw-done-btn') as HTMLButtonElement;
    doneBtn.disabled = true;
    const clearBtn = document.querySelector('.draw-clear-btn') as HTMLButtonElement;
    clearBtn.disabled = true;

    CanvasState.parameters.strokeStyle = '#00d0c3';
    CanvasState.parameters.lineWidth = 10;
  }

  public clearDrawing() {
    const drawCanvas = document.getElementById('canvas2') as HTMLCanvasElement;
    const context = drawCanvas?.getContext('2d') as CanvasRenderingContext2D;

    context.clearRect(-drawCanvas.height / 2, -drawCanvas.width / 2, drawCanvas.height, drawCanvas.width);

    this.startDrawOnCanvas();

    const doneBtn = document.querySelector('.draw-done-btn') as HTMLButtonElement;
    doneBtn.disabled = true;
    const clearBtn = document.querySelector('.draw-clear-btn') as HTMLButtonElement;
    clearBtn.disabled = true;
  }

  public drawColorChange() {
    const inputColor = document.getElementById('draw-color-input') as HTMLInputElement;
    CanvasState.parameters.strokeStyle = `${inputColor.value}`;
  }

  public drawLineWidthChange() {
    const inputLineWidth = document.getElementById('draw-width') as HTMLInputElement;
    CanvasState.parameters.lineWidth = Number(inputLineWidth.value);
  }

  public setZoom = (): void => {
    const zoomValue = document.querySelector('.zoom-value') as HTMLSpanElement;
    if (this.canvas) {
      zoomValue.innerHTML = `${Math.round(this.canvas.getBoundingClientRect().width / (this.canvas.width / 100))}%`;
    }
  };

  public zoomIn = (): void => {
    if (checkSelectedTools() && this.canvas) {
      CanvasState.parameters.zoom += 0.2;
      if (CanvasState.parameters.canvasTransformX === 0 && CanvasState.parameters.canvasTransformY === 0) {
        this.canvas.style.transform = `translate(-50%, -50%) scale(${CanvasState.parameters.zoom})`;
      } else {
        this.canvas.style.transform = `translate(${CanvasState.parameters.canvasTransformX}px, ${CanvasState.parameters.canvasTransformY}px) scale(${CanvasState.parameters.zoom})`;
      }
    }
    this.setZoom();
  };

  public zoomOut = (): void => {
    if (checkSelectedTools() && this.canvas) {
      if (CanvasState.parameters.zoom - 0.2 >= 0) {
        CanvasState.parameters.zoom -= 0.2;
        if (CanvasState.parameters.canvasTransformX === 0 && CanvasState.parameters.canvasTransformY === 0) {
          this.canvas.style.transform = `translate(-50%, -50%) scale(${CanvasState.parameters.zoom})`;
        } else {
          this.canvas.style.transform = `translate(${CanvasState.parameters.canvasTransformX}px, ${CanvasState.parameters.canvasTransformY}px) scale(${CanvasState.parameters.zoom})`;
        }
      } else {
        return;
      }
    }
    this.setZoom();
  };

  public resetZoom() {
    if (this.canvas) {
      CanvasState.parameters.zoom = 1;
      this.canvas.style.transform = `translate(-50%, -50%) scale(${CanvasState.parameters.zoom})`;
      this.setZoom();
    }
  }

  public mouseDragEvents = {
    mousedown(e: MouseEvent): void {
      if (checkSelectedTools()) {
        const canvas = document.getElementById('canvas') as HTMLCanvasElement;

        canvas.style.cursor = 'grabbing';

        const style = getComputedStyle(canvas);
        const transform = new DOMMatrixReadOnly(style.transform);

        const translateX = transform.m41;
        const translateY = transform.m42;

        CanvasState.parameters.canvasDragging = true;
        CanvasState.parameters.canvasStartX = e.pageX - translateX;
        CanvasState.parameters.canvasStartY = e.pageY - translateY;
      }
    },
    mousemove(e: MouseEvent): void {
      if (checkSelectedTools()) {
        const canvas = document.getElementById('canvas') as HTMLCanvasElement;
        if (CanvasState.parameters.canvasDragging === true) {
          const x = e.pageX - CanvasState.parameters.canvasStartX;
          const y = e.pageY - CanvasState.parameters.canvasStartY;

          CanvasState.parameters.canvasTransformX = x;
          CanvasState.parameters.canvasTransformY = y;

          canvas.style.transform = `translate(${x}px, ${y}px) scale(${CanvasState.parameters.zoom})`;
        }
      }
    },
    mouseup(): void {
      const canvas = document.getElementById('canvas') as HTMLCanvasElement;
      if (checkSelectedTools()) {
        CanvasState.parameters.canvasDragging = false;
        canvas.style.cursor = 'grab';
      }
    },
    mouseover(): void {
      const canvas = document.getElementById('canvas') as HTMLCanvasElement;
      if (checkSelectedTools()) {
        canvas.style.cursor = 'grab';
      } else {
        canvas.style.cursor = 'auto';
      }
    },
  };

  public drawBorder() {
    if (this.canvas && this.context && this.image) {
      const drawCanvas = document.getElementById('canvas2') as HTMLCanvasElement;
      const context = drawCanvas?.getContext('2d') as CanvasRenderingContext2D;

      drawCanvas.style.display = 'block';
      drawCanvas.width = this.canvas?.width;
      drawCanvas.height = this.canvas?.height;
      context.translate(drawCanvas.width / 2, drawCanvas.height / 2);
      context.save();
      context.scale(CanvasState.parameters.imageflipVertical, CanvasState.parameters.imageflipHorizontal);
      context.rotate((CanvasState.parameters.imageRotateDegree * Math.PI) / 180);
      context.restore();

      context.beginPath();
      context.strokeStyle = CanvasState.parameters.canvasBorderColor;
      context.lineWidth = CanvasState.parameters.canvasBorderWidth;
      context.strokeRect(-drawCanvas.width / 2, -drawCanvas.height / 2, drawCanvas.width, drawCanvas.height);

      document.querySelector('.border-done-btn')?.addEventListener('click', async (e) => {
        e.stopPropagation();
        if (this.image && this.canvas) {
          const newCanvas = document.createElement('canvas') as HTMLCanvasElement;
          const newContext = newCanvas?.getContext('2d') as CanvasRenderingContext2D;

          newCanvas.width = this.canvas.width;
          newCanvas.height = this.canvas.height;

          newContext.translate(this.canvas.width / 2, this.canvas.height / 2);
          newContext.save();
          newContext.scale(CanvasState.parameters.imageflipVertical, CanvasState.parameters.imageflipHorizontal);
          newContext.rotate((CanvasState.parameters.imageRotateDegree * Math.PI) / 180);

          if (CanvasState.parameters.imageRotate === false) {
            newContext.drawImage(
              this.image,
              -this.canvas.width / 2,
              -this.canvas.height / 2,
              this.canvas.width,
              this.canvas.height,
            );
          } else if (CanvasState.parameters.imageRotate === true) {
            newContext.drawImage(
              this.image,
              -this.canvas.height / 2,
              -this.canvas.width / 2,
              this.canvas.height,
              this.canvas.width,
            );
          }
          newContext.restore();

          if (CanvasState.parameters.imageRotate === true) {
            newContext.drawImage(
              drawCanvas,
              -drawCanvas.width / 2,
              -drawCanvas.height / 2,
              drawCanvas.width,
              drawCanvas.height,
            );
          } else if (CanvasState.parameters.imageRotate === false) {
            newContext.drawImage(
              drawCanvas,
              -drawCanvas.width / 2,
              -drawCanvas.height / 2,
              drawCanvas.width,
              drawCanvas.height,
            );
          }

          this.image.src = newCanvas.toDataURL();

          if (CanvasState.parameters.imageRotate === false) {
            CanvasState.parameters.imageflipVertical = 1;
            CanvasState.parameters.imageflipHorizontal = 1;
            CanvasState.parameters.imageRotateDegree = 0;
          } else {
            CanvasState.parameters.imageflipVertical = 1;
            CanvasState.parameters.imageflipHorizontal = 1;
            CanvasState.parameters.imageRotateDegree = 0;
            CanvasState.parameters.imageRotate = !CanvasState.parameters.imageRotate;
          }

          this.image.onload = () => {
            this.applyСhanges();
          };
        }
        const doneBtn = document.querySelector('.border-done-btn') as HTMLButtonElement;
        doneBtn.disabled = true;
      });
    }

    const doneBtn = document.querySelector('.border-done-btn') as HTMLButtonElement;
    doneBtn.disabled = false;

    if (!document.getElementById('border')?.classList.contains('selected')) {
      this.stopDrawBorder();
    }
  }

  public borderColorChange() {
    const inputColor = document.getElementById('border-color-input') as HTMLInputElement;
    CanvasState.parameters.canvasBorderColor = `${inputColor.value}`;
    this.drawBorder();
  }

  public borderLineWidthChange() {
    const inputLineWidth = document.getElementById('border-width') as HTMLInputElement;
    CanvasState.parameters.canvasBorderWidth = Number(inputLineWidth.value);
    this.drawBorder();
  }

  public stopDrawBorder() {
    if (this.canvas && this.context) {
      const drawCanvas = document.getElementById('canvas2') as HTMLCanvasElement;
      const context = drawCanvas?.getContext('2d') as CanvasRenderingContext2D;

      context.clearRect(-drawCanvas.height / 2, -drawCanvas.width / 2, drawCanvas.height, drawCanvas.width);
      drawCanvas.style.display = 'none';
    }
    const doneBtn = document.querySelector('.border-done-btn') as HTMLButtonElement;
    doneBtn.disabled = true;

    CanvasState.parameters.canvasBorderColor = '#00d0c3';
    CanvasState.parameters.canvasBorderWidth = 10;
  }

  public async applyСhanges(): Promise<void> {
    const changes = {
      canvas: document.getElementById('canvas') as HTMLCanvasElement,
      context: this.canvas?.getContext('2d') as CanvasRenderingContext2D,
      image: document.getElementById('sourceImage') as HTMLImageElement,

      applyFilter() {
        this.context.filter = `blur(${CanvasState.parameters.blur}px) brightness(${
          CanvasState.parameters.brightness
        }%) contrast(${CanvasState.parameters.contrast}%) grayscale(${CanvasState.parameters.grayscale}%) hue-rotate(${
          CanvasState.parameters.hue
        }deg) saturate(${CanvasState.parameters.saturation}%)  sepia(${CanvasState.parameters.sepia}%) invert(${
          CanvasState.parameters.invert / 100
        }) opacity(${CanvasState.parameters.opacity / 100})`;
      },

      drawImage() {
        this.context.translate(this.canvas.width / 2, this.canvas.height / 2);
        this.context.scale(CanvasState.parameters.imageflipVertical, CanvasState.parameters.imageflipHorizontal);
        this.context.rotate((CanvasState.parameters.imageRotateDegree * Math.PI) / 180);

        this.context.drawImage(
          this.image,
          -this.canvas.width / 2,
          -this.canvas.height / 2,
          this.canvas.width,
          this.canvas.height,
        );
      },

      drawImageAfterRotate() {
        this.context.translate(this.canvas.width / 2, this.canvas.height / 2);
        this.context.scale(CanvasState.parameters.imageflipVertical, CanvasState.parameters.imageflipHorizontal);
        this.context.rotate((CanvasState.parameters.imageRotateDegree * Math.PI) / 180);

        this.context.drawImage(
          this.image,
          -this.canvas.height / 2,
          -this.canvas.width / 2,
          this.canvas.height,
          this.canvas.width,
        );
      },

      applyColor() {
        this.context.globalCompositeOperation = 'color';
        this.context.fillStyle = CanvasState.parameters.color;
        this.context.fillRect(-this.canvas.width / 2, -this.canvas.height / 2, this.canvas.width, this.canvas.height);
        this.context.globalCompositeOperation = 'source-over';
      },

      applyColorAfterRotate() {
        this.context.globalCompositeOperation = 'color';
        this.context.fillStyle = CanvasState.parameters.color;
        this.context.fillRect(-this.canvas.height / 2, -this.canvas.width / 2, this.canvas.height, this.canvas.width);
        this.context.globalCompositeOperation = 'source-over';
      },

      async updateImage() {
        const croppedImage = this.context.getImageData(
          CanvasState.parameters.actualX,
          CanvasState.parameters.actualY,
          CanvasState.parameters.croppedWidth,
          CanvasState.parameters.croppedHeight,
        );

        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        CanvasState.parameters.imageWidth = this.canvas.width = Math.round(CanvasState.parameters.croppedWidth);
        CanvasState.parameters.imageHeight = this.canvas.height = Math.round(CanvasState.parameters.croppedHeight);

        CanvasState.parameters.imageProportions =
          CanvasState.parameters.imageWidth / CanvasState.parameters.imageHeight;

        this.context.putImageData(croppedImage, 0, 0);

        this.image.src = this.canvas.toDataURL();
      },
    };

    if (this.image && this.canvas && this.context) {
      this.canvas.width = CanvasState.parameters.imageWidth;
      this.canvas.height = CanvasState.parameters.imageHeight;
      CanvasState.parameters.imageProportions = CanvasState.parameters.imageWidth / CanvasState.parameters.imageHeight;

      if (CanvasState.parameters.imageRotate === false) {
        if (CanvasState.parameters.imageCrop === false) {
          changes.applyFilter();
          changes.drawImage();
          changes.applyColor();
        } else if (CanvasState.parameters.imageCrop === true) {
          changes.drawImage();

          changes.updateImage();

          CanvasState.parameters.imageflipVertical = 1;
          CanvasState.parameters.imageflipHorizontal = 1;
          CanvasState.parameters.imageRotateDegree = 0;

          this.image.onload = () => {
            if (this.canvas && this.image) {
              CanvasState.parameters.imageWidth = this.canvas.width = this.image.naturalWidth;
              CanvasState.parameters.imageHeight = this.canvas.height = this.image.naturalHeight;

              changes.applyFilter();
              changes.drawImage();
              changes.applyColor();
            }
          };
        }
      } else if (CanvasState.parameters.imageRotate === true) {
        if (CanvasState.parameters.imageCrop === false) {
          changes.applyFilter();
          changes.drawImageAfterRotate();
          changes.applyColorAfterRotate();
        } else if (CanvasState.parameters.imageCrop === true) {
          changes.drawImageAfterRotate();

          changes.updateImage();

          CanvasState.parameters.imageflipVertical = 1;
          CanvasState.parameters.imageflipHorizontal = 1;
          CanvasState.parameters.imageRotateDegree = 0;
          CanvasState.parameters.imageRotate = !CanvasState.parameters.imageRotate;

          this.image.onload = () => {
            if (this.canvas && this.image) {
              CanvasState.parameters.imageWidth = this.canvas.width = this.image.naturalWidth;
              CanvasState.parameters.imageHeight = this.canvas.height = this.image.naturalHeight;

              changes.applyFilter();
              changes.drawImage();
              changes.applyColor();
            }
          };
        }
      }
    }
    setTimeout(() => {
      this.setZoom();
    }, 1);
  }
}

export default Model;
