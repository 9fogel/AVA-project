import Settings from './settings';
import Editor from './editor';
import Model from '../model/model';
import Login from './login';
import UsersControler from './authusers';

class Controller {
  private readonly settings: Settings;
  private readonly editor: Editor;
  private readonly model: Model;
  private readonly login: Login;
  private readonly users: UsersControler;

  constructor() {
    this.settings = new Settings();
    this.editor = new Editor();
    this.model = new Model();
    this.login = new Login();
    this.users = new UsersControler();
  }

  public run(): void {
    console.log('run controller');
    this.login.handleLogin();
    this.settings.handleSettings();
    this.handleImageUpload();
    this.handleImageDeletion();
    this.handleImageDownload();
    this.useFileInput();
    this.dropToUploadArea();
    this.editor.handleEditor();
    this.users.handleUsers();
  }

  private useFileInput(): void {
    const fileInput: HTMLElement | null = document.getElementById('fileInput');
    if (fileInput instanceof HTMLInputElement) {
      fileInput.addEventListener('change', async () => {
        await this.model.uploadImage();
        this.editor.updateElements();
        this.switchWorkingAreas();
        this.highlightUploadArea('#c0c0be');
        fileInput.value = '';
      });
    }
  }

  private highlightUploadArea(color: string) {
    const area: HTMLElement | null = document.querySelector('.upload-area');
    if (area) {
      area.style.borderColor = color;
    }
  }

  private dropToUploadArea(): void {
    const uploadArea: HTMLElement | null = document.getElementById('uploadArea');
    const fileInput: HTMLElement | null = document.getElementById('fileInput');

    if (uploadArea && fileInput instanceof HTMLInputElement) {
      uploadArea.addEventListener('drop', (event) => {
        event.preventDefault();
        const dataTransfer: DataTransfer | null = event.dataTransfer;

        if (dataTransfer) {
          const dropFiles: FileList = dataTransfer.files;
          fileInput.files = dropFiles;
          fileInput.dispatchEvent(new Event('change'));
        }
      });

      uploadArea?.addEventListener('dragover', (event) => {
        this.highlightUploadArea('#00d0c3');
        event.preventDefault();
        console.log('over area');
      });

      uploadArea?.addEventListener('dragleave', (event) => {
        this.highlightUploadArea('#c0c0be');
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
      this.editor.hideOpenedToolMenus();
      this.editor.hideOpenedOptionControls();
      this.model.deleteImage();
      this.switchWorkingAreas();
    });
  }

  private handleImageDownload(): void {
    const downloadeBtn: HTMLElement | null = document.querySelector('.download-btn');
    downloadeBtn?.addEventListener('click', () => {
      this.editor.hideOpenedToolMenus();
      this.editor.hideOpenedOptionControls();
      this.model.downloadImage();
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
