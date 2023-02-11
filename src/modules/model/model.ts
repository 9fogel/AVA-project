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

  private applyСhanges(): void {
    if (this.image && this.canvas && this.context) {
      this.canvas.width = state.imageWidth;
      this.canvas.height = state.imageHeight;
      state.imageProportions = state.imageWidth / state.imageHeight;
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
      } else {
        this.context.drawImage(
          this.image,
          -this.canvas.height / 2,
          -this.canvas.width / 2,
          this.canvas.height,
          this.canvas.width,
        );
      }
    }
  }
}

export default Model;
