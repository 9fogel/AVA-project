import Settings from './settings';
import Editor from './editor';

class Controller {
  private readonly settings: Settings;
  private readonly editor: Editor;

  constructor() {
    this.settings = new Settings();
    this.editor = new Editor();
  }

  public run(): void {
    console.log('run controller');
    this.settings.handleSettings();
    this.handleImageUpload();
    this.handleImageDeletion();
    this.editor.handleEditor();
  }

  private handleImageUpload(): void {
    const uploadBtn: HTMLElement | null = document.querySelector('.upload-btn');
    uploadBtn?.addEventListener('click', () => {
      // TODO: функция модели, которая грузит картинку в контейнер
      this.switchWorkingAreas();
    });
  }

  private handleImageDeletion(): void {
    const deleteBtn: HTMLElement | null = document.querySelector('.delete-btn');
    deleteBtn?.addEventListener('click', () => {
      // TODO: функция модели, которая убирает картинку из контейнера
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
