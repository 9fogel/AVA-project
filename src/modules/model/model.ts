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

      if (files && this.image) {
        this.image.src = URL.createObjectURL(files[0]);
        await this.image.decode();
        if (this.image) {
          state.imageWidth = this.image.naturalWidth;
          state.imageHeight = this.image.naturalHeight;
          state.imageProportions = this.image.naturalWidth / this.image.naturalHeight;
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
    if (this.canvas) {
      this.canvas.width = state.imageWidth;
      this.canvas.height = state.imageHeight;
    }
    this.applyСhanges();
  }

  private applyСhanges(): void {
    if (this.image && this.canvas && this.context) {
      this.canvas.width = state.imageWidth;
      this.canvas.height = state.imageHeight;
      // drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
      this.context.drawImage(this.image, 0, 0, this.canvas.width, this.canvas.height);
    }
  }
}

export default Model;
