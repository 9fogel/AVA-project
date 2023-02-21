import CanvasState from './canvasState';
import Presets from './presets';

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

  private mouseEvents = {
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
      this.canvas.addEventListener('mouseover', this.mouseEvents.mouseover);
      this.canvas.addEventListener('mousedown', this.mouseEvents.mousedown);
      this.canvas.addEventListener('mouseup', this.mouseEvents.mouseup);
      this.canvas.addEventListener('mousemove', this.mouseEvents.mousemove);
    }
    CanvasState.parameters.imageCrop = true;
  }

  public removeCropArea(): void {
    if (this.canvas && CanvasState.parameters.selection) {
      this.canvas.removeEventListener('mouseover', this.mouseEvents.mouseover);
      this.canvas.removeEventListener('mousedown', this.mouseEvents.mousedown);
      this.canvas.removeEventListener('mouseup', this.mouseEvents.mouseup);
      this.canvas.removeEventListener('mousemove', this.mouseEvents.mousemove);
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

  public resetChanges(): void {
    CanvasState.resetState();
    if (this.image && this.defaultImage) {
      CanvasState.parameters.imageWidth = this.defaultImage.naturalWidth;
      CanvasState.parameters.imageHeight = this.defaultImage.naturalHeight;
      this.image.src = this.defaultImage.src;
    }

    this.applyСhanges();
  }

  private async applyСhanges(): Promise<void> {
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

        await this.image.decode();
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

          await changes.updateImage();

          CanvasState.parameters.imageflipVertical = 1;
          CanvasState.parameters.imageflipHorizontal = 1;
          CanvasState.parameters.imageRotateDegree = 0;

          CanvasState.parameters.imageWidth = this.canvas.width = this.image.naturalWidth;
          CanvasState.parameters.imageHeight = this.canvas.height = this.image.naturalHeight;

          changes.applyFilter();
          changes.drawImage();
          changes.applyColor();
        }
      } else if (CanvasState.parameters.imageRotate === true) {
        if (CanvasState.parameters.imageCrop === false) {
          changes.applyFilter();
          changes.drawImageAfterRotate();
          changes.applyColorAfterRotate();
        } else if (CanvasState.parameters.imageCrop === true) {
          changes.drawImageAfterRotate();

          await changes.updateImage();

          CanvasState.parameters.imageflipVertical = 1;
          CanvasState.parameters.imageflipHorizontal = 1;
          CanvasState.parameters.imageRotateDegree = 0;
          CanvasState.parameters.imageRotate = !CanvasState.parameters.imageRotate;

          CanvasState.parameters.imageWidth = this.canvas.width = this.image.naturalWidth;
          CanvasState.parameters.imageHeight = this.canvas.height = this.image.naturalHeight;

          changes.applyFilter();

          changes.drawImage();

          changes.applyColor();
        }
      }
    }
  }
}

export default Model;
