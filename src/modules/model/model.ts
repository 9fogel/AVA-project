import CanvasState from './canvasState';
import Presets from './presets';

class Model {
  private canvas: HTMLCanvasElement | null;
  private context: CanvasRenderingContext2D | null;
  private image: HTMLImageElement | null;
  private readonly presets: Presets;

  constructor() {
    this.canvas = document.getElementById('canvas') as HTMLCanvasElement | null;
    this.context = this.canvas?.getContext('2d') as CanvasRenderingContext2D | null;
    this.image = document.getElementById('sourceImage') as HTMLImageElement | null;
    this.presets = new Presets();
  }

  public async uploadImage(): Promise<void> {
    const fileInput: HTMLElement | null = document.getElementById('fileInput');

    if (fileInput instanceof HTMLInputElement) {
      const files: FileList | null = fileInput.files;

      if (files && this.image && this.canvas) {
        this.image.src = URL.createObjectURL(files[0]);
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

  public downloadImage(): void {
    if (this.canvas) {
      const link = document.createElement('a');
      link.download = 'image';
      link.href = this.canvas.toDataURL();
      //toDataURL(type, imageQuality)
      //type = image/png(default), image/jpeg, image/webp
      //imageQuality = between 0 and 1
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

  private applyСhanges(): void {
    if (this.image && this.canvas && this.context) {
      // this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.canvas.width = CanvasState.parameters.imageWidth;
      this.canvas.height = CanvasState.parameters.imageHeight;
      CanvasState.parameters.imageProportions = CanvasState.parameters.imageWidth / CanvasState.parameters.imageHeight;
      this.context.filter = `blur(${CanvasState.parameters.blur}px) brightness(${
        CanvasState.parameters.brightness
      }%) contrast(${CanvasState.parameters.contrast}%) grayscale(${CanvasState.parameters.grayscale}%) hue-rotate(${
        CanvasState.parameters.hue
      }deg) saturate(${CanvasState.parameters.saturation}%)  sepia(${CanvasState.parameters.sepia}%) invert(${
        CanvasState.parameters.invert / 100
      }) opacity(${CanvasState.parameters.opacity / 100})`;
      this.context.translate(this.canvas.width / 2, this.canvas.height / 2);
      this.context.scale(CanvasState.parameters.imageflipVertical, CanvasState.parameters.imageflipHorizontal);
      this.context.rotate((CanvasState.parameters.imageRotateDegree * Math.PI) / 180);
      if (CanvasState.parameters.imageRotate === false) {
        this.context.drawImage(
          this.image,
          -this.canvas.width / 2,
          -this.canvas.height / 2,
          this.canvas.width,
          this.canvas.height,
        );
        this.context.globalCompositeOperation = 'color';
        this.context.fillStyle = CanvasState.parameters.color;
        this.context.fillRect(-this.canvas.width / 2, -this.canvas.height / 2, this.canvas.width, this.canvas.height);
        this.context.globalCompositeOperation = 'source-over';
      } else {
        this.context.drawImage(
          this.image,
          -this.canvas.height / 2,
          -this.canvas.width / 2,
          this.canvas.height,
          this.canvas.width,
        );
        this.context.globalCompositeOperation = 'color';
        this.context.fillStyle = CanvasState.parameters.color;
        this.context.fillRect(-this.canvas.height / 2, -this.canvas.width / 2, this.canvas.height, this.canvas.width);
        this.context.globalCompositeOperation = 'source-over';
      }
    }
  }
}

export default Model;
