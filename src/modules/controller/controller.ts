import Settings from './settings';
import Editor from './editor';
import Model from '../model/model';
import Login from './login';
import UsersControler from './authusers';
import UserPage from './userPage';

class Controller {
  quality = 1;
  format = 'png';
  private readonly settings: Settings;
  private readonly editor: Editor;
  private readonly model: Model;
  private readonly login: Login;
  private readonly users: UsersControler;
  private readonly userPage: UserPage;

  constructor() {
    this.settings = new Settings();
    this.editor = new Editor();
    this.model = new Model();
    this.login = new Login();
    this.users = new UsersControler();
    this.userPage = new UserPage();
  }

  public run(): void {
    console.log('run controller');
    this.login.handleLogin();
    this.settings.handleSettings();
    this.handleImageUpload();
    this.handleImageDeletion();
    this.handleDownloadOptions();
    this.handleImageDownload();
    this.useFileInput();
    this.dropToUploadArea();
    this.editor.handleEditor();
    this.users.handleUsers();
    this.userPage.handlePage();
    this.handleResetChanges();
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
      document.getElementById('crop-done')?.click();
      this.switchWorkingAreas();
    });
  }

  private handleImageDownload(): void {
    const downloadeBtn: HTMLElement | null = document.querySelector('.download-btn');
    downloadeBtn?.addEventListener('click', () => {
      this.editor.hideOpenedToolMenus();
      this.editor.hideOpenedOptionControls();
      this.showDownloadOptions();
      // this.handleDownloadOptions();
      // this.model.downloadImage();
    });
  }

  private switchWorkingAreas(): void {
    const editArea: HTMLElement | null = document.querySelector('.edit-area');
    const uploadArea: HTMLElement | null = document.querySelector('.upload-area');
    editArea?.classList.toggle('hidden');
    uploadArea?.classList.toggle('hidden');
  }

  //_______________________________________________DOWNLOAD OPTIONS
  private showDownloadOptions(): void {
    const downloadMenu = document.querySelector('.download-menu');
    downloadMenu?.classList.toggle('hidden');
  }

  private handleDownloadOptions(): void {
    this.listenQualityChoise();
    const formatBtns = document.querySelectorAll('.format-wrap');

    formatBtns.forEach((button) => {
      button.addEventListener('click', () => {
        document.querySelector('.format-wrap.selected')?.classList.remove('selected');
        button.classList.add('selected');
        this.format = button.id;
        if (this.format === 'jpeg') {
          this.enableQualityChoise();
        } else {
          this.disableQualityChoise();
        }
      });
    });

    this.saveDownloadOptions();
  }

  private enableQualityChoise(): void {
    const qualityWrap = document.querySelector('.quality-item');
    const qualityRange = document.querySelector('.quality-range-input');
    const qualityNumInput = document.querySelector('.quality-number-input');
    qualityWrap?.classList.remove('disabled');
    qualityRange?.removeAttribute('disabled');
    qualityNumInput?.removeAttribute('disabled');
  }

  private disableQualityChoise(): void {
    const qualityWrap = document.querySelector('.quality-item');
    const qualityRange = document.querySelector('.quality-range-input');
    const qualityNumInput = document.querySelector('.quality-number-input');
    qualityWrap?.classList.add('disabled');
    qualityRange?.setAttribute('disabled', 'true');
    qualityNumInput?.setAttribute('disabled', 'true');
  }

  private listenQualityChoise(): void {
    const qualityRange: HTMLInputElement | null = document.querySelector('.quality-range-input');
    const qualityNumInput: HTMLInputElement | null = document.querySelector('.quality-number-input');

    qualityRange?.addEventListener('input', () => {
      if (qualityNumInput) {
        qualityNumInput.value = qualityRange.value;
        this.quality = +qualityNumInput.value / 100;
      }
    });

    qualityNumInput?.addEventListener('input', () => {
      if (qualityRange) {
        if (+qualityNumInput.value < 0) {
          qualityNumInput.value = qualityNumInput.value.replace(/[^0-9 ]+/g, '');
        }
        if (qualityNumInput.value.startsWith('00') || qualityNumInput.value.startsWith('-0')) {
          qualityNumInput.value = '0';
        }
        if (+qualityNumInput.value > 100) {
          qualityNumInput.value = '100';
        }
        qualityRange.value = qualityNumInput.value;
        this.quality = +qualityRange.value / 100;
      }
    });
  }

  private saveDownloadOptions(): void {
    const resetOptions = document.querySelector('.reset-download-btn');
    const applyOptions = document.querySelector('.apply-download-btn');

    resetOptions?.addEventListener('click', () => {
      this.resetOptions();
    });

    applyOptions?.addEventListener('click', () => {
      console.log(`Download format - ${this.format}, quality - ${this.quality}`);
      this.model.downloadImage(this.format, this.quality);
    });
  }

  private resetOptions(): void {
    const qualityRange: HTMLInputElement | null = document.querySelector('.quality-range-input');
    const qualityNumInput: HTMLInputElement | null = document.querySelector('.quality-number-input');
    const selectedFormat = document.querySelector('.format-wrap.selected');

    if (selectedFormat && selectedFormat.id === 'jpeg') {
      this.disableQualityChoise();
    }

    document.querySelector('.format-wrap.selected')?.classList.remove('selected');
    document.getElementById('png')?.classList.add('selected');
    this.format = 'png';
    if (qualityRange && qualityNumInput) {
      qualityRange.value = '100';
      qualityNumInput.value = qualityRange.value;
      this.quality = 1;
    }
  }

  //__________________________________________RESET ALL CHANGES
  private handleResetChanges(): void {
    const resetBtn: HTMLElement | null = document.querySelector('.reset-btn');
    resetBtn?.addEventListener('click', () => {
      this.model.resetChanges();
    });
  }
}

export default Controller;
