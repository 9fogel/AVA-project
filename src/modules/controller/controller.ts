import Settings from './settings';

class Controller {
  private readonly settings: Settings;

  constructor() {
    this.settings = new Settings();
  }

  public run() {
    console.log('run controller');
    this.settings.handleSettings();
    this.handleImageUpload();
    this.handleImageDeletion();
  }

  private handleImageUpload() {
    const uploadBtn = document.querySelector('.upload-btn');
    uploadBtn?.addEventListener('click', () => {
      // TODO: функция модели, которая грузит картинку в контейнер
      this.switchWorkingAreas();
    });
  }

  private handleImageDeletion() {
    const deleteBtn = document.querySelector('.delete-btn');
    deleteBtn?.addEventListener('click', () => {
      // TODO: функция модели, которая убирает картинку из контейнера
      this.switchWorkingAreas();
    });
  }

  private switchWorkingAreas() {
    const editArea = document.querySelector('.edit-area');
    const uploadArea = document.querySelector('.upload-area');
    editArea?.classList.toggle('hidden');
    uploadArea?.classList.toggle('hidden');
  }
}

export default Controller;
