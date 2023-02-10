class Popup {
  loginModal = document.querySelector('.login-modal');
  loginWrapper = document.querySelector('.wrapper');
  closeIcon = document.querySelector('.close-modal');

  public showModal(): void {
    this.loginModal?.classList.add('active');
    this.loginWrapper?.classList.add('active');
  }

  private hideModal(): void {
    this.loginModal?.classList.remove('active');
    this.loginWrapper?.classList.remove('active');
  }

  public handleModalclosure(): void {
    this.closeIcon?.addEventListener('click', () => {
      this.hideModal();
    });

    this.loginWrapper?.addEventListener('click', () => {
      this.hideModal();
    });
  }
}

export default Popup;
