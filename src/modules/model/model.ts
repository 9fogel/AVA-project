import state from './state';

class Model {
  private canvas: HTMLCanvasElement | null;
  private context: CanvasRenderingContext2D | null;
  private image: HTMLImageElement | null;

  constructor() {
    this.canvas = document.getElementById('canvas') as HTMLCanvasElement | null;
    this.context = this.canvas?.getContext('2d') as CanvasRenderingContext2D | null;
    this.image = document.getElementById('sourceImage') as HTMLImageElement | null;
  }

  public async uploadImage(): Promise<void> {
    const fileInput: HTMLElement | null = document.getElementById('fileInput');

    if (fileInput instanceof HTMLInputElement) {
      const files: FileList | null = fileInput.files;

      if (files && this.image && this.canvas) {
        this.image.src = URL.createObjectURL(files[0]);
        await this.image.decode();
        if (this.image) {
          state.imageWidth = this.image.naturalWidth;
          state.imageHeight = this.image.naturalHeight;
          state.imageRotate = false;
          state.imageRotateDegree = 0;
          this.applyСhanges();
          const filterImage = document.querySelectorAll('.filter');
          filterImage.forEach((image) => {
            if (image instanceof HTMLDivElement) {
              image.style.backgroundImage = `url(${URL.createObjectURL(files[0])})`;
              image.style.backgroundBlendMode = 'overlay';
            }
          });
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
      state.imageWidth = +widthInput.value;
      state.imageHeight = +heightInput.value;
    }
    this.applyСhanges();
  }

  public rotateImage(side: string) {
    if (side === 'right') {
      state.imageRotateDegree += 90;
      if (state.imageRotateDegree === 360) {
        state.imageRotateDegree = 0;
      }
    } else if (side === 'left') {
      state.imageRotateDegree -= 90;
      if (state.imageRotateDegree === -360) {
        state.imageRotateDegree = 0;
      }
    }

    if (this.image && this.canvas && this.context) {
      const currentHeight = state.imageHeight;
      const currentWidth = state.imageWidth;
      state.imageWidth = currentHeight;
      state.imageHeight = currentWidth;
      this.canvas.width = state.imageWidth;
      this.canvas.height = state.imageHeight;
      state.imageProportions = state.imageWidth / state.imageHeight;
      state.imageRotate = !state.imageRotate;
      this.applyСhanges();
    }
  }

  public flipImage(flip: string) {
    if (flip === 'vertical') {
      state.imageflipVertical = state.imageflipVertical === 1 ? -1 : 1;
    } else if (flip === 'horizontal') {
      state.imageflipHorizontal = state.imageflipHorizontal === 1 ? -1 : 1;
    }
    this.applyСhanges();
  }

  public setAdjustment(option: string) {
    state.currentAdjustment = option;
  }

  public useAdjustment(value: string) {
    switch (state.currentAdjustment) {
      case 'blur':
        state.blur = +value;
        break;
      case 'brightness':
        state.brightness = +value;
        break;
      case 'contrast':
        state.contrast = +value;
        break;
      case 'grayscale':
        state.grayscale = +value;
        break;
      case 'hue':
        state.hue = +value;
        break;
      case 'pixelate':
        state.pixelate = +value;
        break;
      case 'saturation':
        state.saturation = +value;
        break;
      case 'sepia':
        state.sepia = +value;
        break;
      case 'invert':
        state.invert = +value;
        break;
      case 'opacity':
        state.opacity = +value;
        break;
    }
    this.applyСhanges();
  }

  private resetAdjustments() {
    state.color = 'rgba(0, 0, 0, 0)';
    state.blur = 0;
    state.brightness = 100;
    state.contrast = 100;
    state.grayscale = 0;
    state.hue = 0;
    state.pixelate = 50;
    state.saturation = 100;
    state.sepia = 0;
    state.opacity = 100;
  }

  public applyFilter(index: number) {
    switch (index) {
      case 0:
        this.resetAdjustments();
        this.applyСhanges();
        break;
      case 1:
        this.resetAdjustments();
        state.brightness = 110;
        state.contrast = 110;
        state.saturation = 130;
        state.color = 'rgba(243, 106, 188, 0.3)';
        this.applyСhanges();
        break;
      case 2:
        this.resetAdjustments();
        state.brightness = 120;
        state.contrast = 90;
        state.saturation = 85;
        state.hue = 20;
        state.color = 'rgba(62, 162, 253, 0.5)';
        this.applyСhanges();
        break;
      case 3:
        this.resetAdjustments();
        state.brightness = 110;
        state.contrast = 90;
        state.saturation = 150;
        state.hue = -10;
        state.color = 'rgba(243, 106, 188, 0.3)';
        this.applyСhanges();
        break;
      case 4:
        this.resetAdjustments();
        state.brightness = 120;
        state.sepia = 50;
        state.color = 'rgba(161, 44, 199, 0.31)';
        this.applyСhanges();
        break;
      case 5:
        this.resetAdjustments();
        state.brightness = 110;
        state.contrast = 90;
        state.color = 'rgba(168, 223, 193, 0.4)';
        this.applyСhanges();
        break;
      case 6:
        this.resetAdjustments();
        state.contrast = 120;
        state.saturation = 125;
        state.color = 'rgba(127, 187, 227, 0.2)';
        this.applyСhanges();
        break;
      case 7:
        this.resetAdjustments();
        state.contrast = 90;
        state.sepia = 20;
        state.color = 'rgba(208, 186, 142, 0.5)';
        this.applyСhanges();
        break;
      case 8:
        this.resetAdjustments();
        state.brightness = 105;
        state.hue = 350;
        state.color = 'rgba(66, 10, 14, 0.2)';
        this.applyСhanges();
        break;
      case 9:
        this.resetAdjustments();
        state.brightness = 120;
        state.contrast = 90;
        state.saturation = 110;
        state.color = 'rgba(255, 177, 166, 0.5)';
        this.applyСhanges();
        break;
      case 10:
        this.resetAdjustments();
        state.brightness = 110;
        state.contrast = 110;
        state.sepia = 30;
        state.grayscale = 100;
        state.color = 'rgba(0, 0, 0, 0)';
        this.applyСhanges();
        break;
      case 11:
        this.resetAdjustments();
        state.contrast = 150;
        state.saturation = 110;
        state.color = 'rgba(255, 101, 80, 0.4)';
        this.applyСhanges();
        break;
      case 12:
        this.resetAdjustments();
        state.brightness = 95;
        state.contrast = 95;
        state.saturation = 150;
        state.sepia = 25;
        state.color = 'rgba(3, 230, 26, 0.2)';
        this.applyСhanges();
        break;
      case 13:
        this.resetAdjustments();
        state.color = 'rgba(86, 22, 214, 0.5)';
        this.applyСhanges();
        break;
      case 14:
        this.resetAdjustments();
        state.brightness = 110;
        state.contrast = 85;
        state.saturation = 75;
        state.sepia = 22;
        state.color = 'rgba(173, 205, 239, 0.5)';
        this.applyСhanges();
        break;
      case 15:
        this.resetAdjustments();
        state.brightness = 115;
        state.contrast = 75;
        state.saturation = 85;
        state.color = 'rgba(240, 149, 128, 0.2)';
        this.applyСhanges();
        break;
      case 16:
        this.resetAdjustments();
        state.brightness = 110;
        state.contrast = 110;
        state.sepia = 30;
        state.color = 'rgba(125, 0, 247, 0.4)';
        this.applyСhanges();
        break;
      case 17:
        this.resetAdjustments();
        state.brightness = 110;
        state.sepia = 30;
        state.saturation = 160;
        state.hue = 350;
        state.color = 'rgba(0, 227, 217, 0.4)';
        this.applyСhanges();
        break;
      case 18:
        this.resetAdjustments();
        state.brightness = 108;
        state.contrast = 108;
        state.sepia = 8;
        state.color = 'rgba(58, 3, 57, 0.6)';
        this.applyСhanges();
        break;
      case 19:
        this.resetAdjustments();
        state.sepia = 30;
        state.color = 'rgba(74, 25, 8, 0.5)';
        this.applyСhanges();
        break;
    }
  }

  private applyСhanges(): void {
    if (this.image && this.canvas && this.context) {
      // this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.canvas.width = state.imageWidth;
      this.canvas.height = state.imageHeight;
      state.imageProportions = state.imageWidth / state.imageHeight;
      this.context.filter = `blur(${state.blur}px) brightness(${state.brightness}%) contrast(${
        state.contrast
      }%) grayscale(${state.grayscale}%) hue-rotate(${state.hue}deg) saturate(${state.saturation}%)  sepia(${
        state.sepia
      }%) invert(${state.invert / 100}) opacity(${state.opacity / 100})`;
      this.context.translate(this.canvas.width / 2, this.canvas.height / 2);
      this.context.scale(state.imageflipVertical, state.imageflipHorizontal);
      this.context.rotate((state.imageRotateDegree * Math.PI) / 180);
      if (state.imageRotate === false) {
        this.context.drawImage(
          this.image,
          -this.canvas.width / 2,
          -this.canvas.height / 2,
          this.canvas.width,
          this.canvas.height,
        );
        this.context.globalCompositeOperation = 'color';
        this.context.fillStyle = state.color;
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
        this.context.fillStyle = state.color;
        this.context.fillRect(-this.canvas.height / 2, -this.canvas.width / 2, this.canvas.height, this.canvas.width);
        this.context.globalCompositeOperation = 'source-over';
      }
    }
  }
}

export default Model;
