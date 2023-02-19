class SystemPopup {
  systemModal = document.querySelector('.system-modal');
  systemWrapper = document.querySelector('.wrapper');
  closeIcon = document.querySelector('.close-system-modal');
  systemText = document.querySelector('.system-text');

  public handleModal(): void {
    this.handleModalclosure();
  }

  public showModal(text: string): void {
    if (this.systemText instanceof HTMLElement) {
      this.systemText.innerText = text;
    }
    this.systemModal?.classList.add('active');
    this.systemWrapper?.classList.add('active');
  }

  public hideModal(): void {
    this.systemModal?.classList.remove('active');
    this.systemWrapper?.classList.remove('active');
    if (this.systemText instanceof HTMLElement) {
      this.systemText.innerText = '';
    }
  }

  private handleModalclosure(): void {
    this.closeIcon?.addEventListener('click', () => {
      this.hideModal();
    });

    this.systemWrapper?.addEventListener('click', () => {
      this.hideModal();
    });
  }
}

export default SystemPopup;
