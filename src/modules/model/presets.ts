import CanvasState from './canvasState';

class Presets {
  public usePreset(index: number): void {
    switch (index) {
      case 0:
        break;
      case 1:
        CanvasState.parameters.brightness = 110;
        CanvasState.parameters.contrast = 110;
        CanvasState.parameters.saturation = 130;
        CanvasState.parameters.color = 'rgba(243, 106, 188, 0.3)';
        break;
      case 2:
        CanvasState.parameters.brightness = 120;
        CanvasState.parameters.contrast = 90;
        CanvasState.parameters.saturation = 85;
        CanvasState.parameters.hue = 20;
        CanvasState.parameters.color = 'rgba(62, 162, 253, 0.5)';
        break;
      case 3:
        CanvasState.parameters.brightness = 110;
        CanvasState.parameters.contrast = 90;
        CanvasState.parameters.saturation = 150;
        CanvasState.parameters.hue = -10;
        CanvasState.parameters.color = 'rgba(243, 106, 188, 0.3)';
        break;
      case 4:
        CanvasState.parameters.brightness = 120;
        CanvasState.parameters.sepia = 50;
        CanvasState.parameters.color = 'rgba(161, 44, 199, 0.31)';
        break;
      case 5:
        CanvasState.parameters.brightness = 110;
        CanvasState.parameters.contrast = 90;
        CanvasState.parameters.color = 'rgba(168, 223, 193, 0.4)';
        break;
      case 6:
        CanvasState.parameters.contrast = 120;
        CanvasState.parameters.saturation = 125;
        CanvasState.parameters.color = 'rgba(127, 187, 227, 0.2)';
        break;
      case 7:
        CanvasState.parameters.contrast = 90;
        CanvasState.parameters.sepia = 20;
        CanvasState.parameters.color = 'rgba(208, 186, 142, 0.5)';
        break;
      case 8:
        CanvasState.parameters.brightness = 105;
        CanvasState.parameters.hue = 350;
        CanvasState.parameters.color = 'rgba(66, 10, 14, 0.2)';
        break;
      case 9:
        CanvasState.parameters.brightness = 120;
        CanvasState.parameters.contrast = 90;
        CanvasState.parameters.saturation = 110;
        CanvasState.parameters.color = 'rgba(255, 177, 166, 0.5)';
        break;
      case 10:
        CanvasState.parameters.brightness = 110;
        CanvasState.parameters.contrast = 110;
        CanvasState.parameters.sepia = 30;
        CanvasState.parameters.grayscale = 100;
        CanvasState.parameters.color = 'rgba(0, 0, 0, 0)';
        break;
      case 11:
        CanvasState.parameters.contrast = 150;
        CanvasState.parameters.saturation = 110;
        CanvasState.parameters.color = 'rgba(255, 101, 80, 0.4)';
        break;
      case 12:
        CanvasState.parameters.brightness = 95;
        CanvasState.parameters.contrast = 95;
        CanvasState.parameters.saturation = 150;
        CanvasState.parameters.sepia = 25;
        CanvasState.parameters.color = 'rgba(3, 230, 26, 0.2)';
        break;
      case 13:
        CanvasState.parameters.color = 'rgba(86, 22, 214, 0.5)';
        break;
      case 14:
        CanvasState.parameters.brightness = 110;
        CanvasState.parameters.contrast = 85;
        CanvasState.parameters.saturation = 75;
        CanvasState.parameters.sepia = 22;
        CanvasState.parameters.color = 'rgba(173, 205, 239, 0.5)';
        break;
      case 15:
        CanvasState.parameters.brightness = 115;
        CanvasState.parameters.contrast = 75;
        CanvasState.parameters.saturation = 85;
        CanvasState.parameters.color = 'rgba(240, 149, 128, 0.2)';
        break;
      case 16:
        CanvasState.parameters.brightness = 110;
        CanvasState.parameters.contrast = 110;
        CanvasState.parameters.sepia = 30;
        CanvasState.parameters.color = 'rgba(125, 0, 247, 0.4)';
        break;
      case 17:
        CanvasState.parameters.brightness = 110;
        CanvasState.parameters.sepia = 30;
        CanvasState.parameters.saturation = 160;
        CanvasState.parameters.hue = 350;
        CanvasState.parameters.color = 'rgba(0, 227, 217, 0.4)';
        break;
      case 18:
        CanvasState.parameters.brightness = 108;
        CanvasState.parameters.contrast = 108;
        CanvasState.parameters.sepia = 8;
        CanvasState.parameters.color = 'rgba(58, 3, 57, 0.6)';
        break;
      case 19:
        CanvasState.parameters.sepia = 30;
        CanvasState.parameters.color = 'rgba(74, 25, 8, 0.5)';
        break;
    }
  }
}

export default Presets;
