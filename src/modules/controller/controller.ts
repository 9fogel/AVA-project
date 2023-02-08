import Settings from './settings';
import Editor from './editor';
import Model from '../model/model';

class Controller {
  private readonly settings: Settings;
  private readonly editor: Editor;
  private readonly model: Model;

  constructor() {
    this.settings = new Settings();
    this.editor = new Editor();
    this.model = new Model();
  }

  public run(): void {
    console.log('run controller');
    this.settings.handleSettings();
    this.handleImageUpload();
    this.handleImageDeletion();
    this.editor.handleEditor();
    this.useFileInput();
    this.dropToUploadArea();
  }

  private useFileInput(): void {
    const fileInput: HTMLElement | null = document.getElementById('fileInput');
    if (fileInput instanceof HTMLInputElement) {
      fileInput.addEventListener('change', () => {
        this.model.uploadImage();
        this.switchWorkingAreas();
        fileInput.value = '';
      });
    }
  }

  private dropToUploadArea() {
    const uploadArea: HTMLElement | null = document.getElementById('uploadArea');
    const fileInput: HTMLElement | null = document.getElementById('fileInput');

    if (uploadArea && fileInput instanceof HTMLInputElement) {
      let files: FileList | null = fileInput.files;

      uploadArea.addEventListener('drop', (event) => {
        event.preventDefault();
        const dataTransfer: DataTransfer | null = event.dataTransfer;

        if (dataTransfer && files) {
          const dropFiles: FileList = dataTransfer.files;
          files = dropFiles;
          fileInput.click();
        }
      });
      //изменение стиля upload area при нахождении обьекта над областью, как дополнительный функционал
      uploadArea?.addEventListener('dragover', (event) => {
        event.preventDefault();
        console.log('over area');
      });

      uploadArea?.addEventListener('dragleave', (event) => {
        event.preventDefault();
        console.log('not over area');
      });
    }
  }

  private handleImageUpload(): void {
    const uploadBtn: HTMLElement | null = document.querySelector('.upload-btn');
    const fileInput: HTMLElement | null = document.getElementById('fileInput');
    uploadBtn?.addEventListener('click', () => {
      fileInput?.click();
    });
  }

  private handleImageDeletion(): void {
    const deleteBtn: HTMLElement | null = document.querySelector('.delete-btn');
    deleteBtn?.addEventListener('click', () => {
      this.model.deleteImage();
      this.switchWorkingAreas();
    });
  }

  private switchWorkingAreas(): void {
    const editArea: HTMLElement | null = document.querySelector('.edit-area');
    const uploadArea: HTMLElement | null = document.querySelector('.upload-area');
    editArea?.classList.toggle('hidden');
    uploadArea?.classList.toggle('hidden');
  }
}

export default Controller;
