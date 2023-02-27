import Controller from './controller/controller';

class App {
  private readonly controller: Controller;

  constructor() {
    this.controller = new Controller();
  }

  public start(): void {
    try {
      this.controller.run();
    } catch (err) {
      if (err instanceof Error) {
        console.log('Error', err.toString());
      }
    }
  }
}

export default App;
