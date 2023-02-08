class Model {
  private canvas: HTMLCanvasElement | null;
  private context: CanvasRenderingContext2D | null;
  private image: HTMLImageElement | null;

  constructor() {
    this.canvas = document.getElementById('canvas') as HTMLCanvasElement | null;
    this.context = this.canvas?.getContext('2d') as CanvasRenderingContext2D | null;
    this.image = document.getElementById('sourceImage') as HTMLImageElement | null;
  }

  public uploadImage(): void {
    const fileInput: HTMLElement | null = document.getElementById('fileInput');

    if (fileInput instanceof HTMLInputElement) {
      const files: FileList | null = fileInput.files;

      if (files && this.image) {
        this.image.src = URL.createObjectURL(files[0]);

        this.image.onload = () => {
          this.applyFilter();
        };
      }
    }
  }

  public deleteImage(): void {
    if (this.image && this.canvas && this.context) {
      this.image.src = '';
      this.applyFilter();
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }

  applyFilter(): void {
    if (this.image && this.canvas && this.context) {
      this.canvas.width = this.image.naturalWidth;
      this.canvas.height = this.image.naturalHeight;
      this.context.drawImage(this.image, 0, 0);
    }
  }
}

export default Model;
