class CanvasState {
  static parameters = {
    imageWidth: 0,
    imageHeight: 0,
    imageProportions: 0,
    saveProportions: true,
    imageRotateDegree: 0,
    imageRotate: false,
    imageflipHorizontal: 1,
    imageflipVertical: 1,
    currentAdjustment: '',
    color: 'rgba(0, 0, 0, 0)',
    blur: 0,
    brightness: 100,
    contrast: 100,
    grayscale: 0,
    hue: 0,
    pixelate: 50,
    saturation: 100,
    sepia: 0,
    invert: 0,
    opacity: 100,
    currentPreset: 0,
    imageCrop: false,
    selection: document.getElementById('selection-tool'),
    startSelection: false,
    startX: 0,
    startY: 0,
    relativeStartX: 0,
    relativeStartY: 0,
    endX: 0,
    endY: 0,
    relativeEndX: 0,
    relativeEndY: 0,
    event: { string: 0 },
    croppedWidth: 0,
    croppedHeight: 0,
    actualX: 0,
    actualY: 0,
  };

  static resetState() {
    this.parameters.imageWidth = 0;
    this.parameters.imageHeight = 0;
    this.parameters.imageProportions = 0;
    this.parameters.saveProportions = true;
    this.parameters.imageRotateDegree = 0;
    this.parameters.imageRotate = false;
    this.parameters.imageflipHorizontal = 1;
    this.parameters.imageflipVertical = 1;
    this.parameters.currentAdjustment = '';
    this.parameters.color = 'rgba(0, 0, 0, 0)';
    this.parameters.blur = 0;
    this.parameters.brightness = 100;
    this.parameters.contrast = 100;
    this.parameters.grayscale = 0;
    this.parameters.hue = 0;
    this.parameters.pixelate = 50;
    this.parameters.saturation = 100;
    this.parameters.sepia = 0;
    this.parameters.invert = 0;
    this.parameters.opacity = 100;
    this.parameters.currentPreset = 0;
    this.parameters.imageCrop = false;
    this.parameters.startSelection = false;
    this.parameters.relativeStartX = 0;
    this.parameters.relativeStartY = 0;
    this.parameters.endX = 0;
    this.parameters.endY = 0;
    this.parameters.relativeEndX = 0;
    this.parameters.relativeEndY = 0;
    this.parameters.event = { string: 0 };
    this.parameters.croppedWidth = 0;
    this.parameters.croppedHeight = 0;
    this.parameters.actualX = 0;
    this.parameters.actualY = 0;
  }
}

export default CanvasState;
