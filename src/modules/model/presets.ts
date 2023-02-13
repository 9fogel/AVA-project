import state from './state';

class Presets {
  public usePreset(index: number) {
    switch (index) {
      case 0:
        break;
      case 1:
        state.brightness = 110;
        state.contrast = 110;
        state.saturation = 130;
        state.color = 'rgba(243, 106, 188, 0.3)';
        break;
      case 2:
        state.brightness = 120;
        state.contrast = 90;
        state.saturation = 85;
        state.hue = 20;
        state.color = 'rgba(62, 162, 253, 0.5)';
        break;
      case 3:
        state.brightness = 110;
        state.contrast = 90;
        state.saturation = 150;
        state.hue = -10;
        state.color = 'rgba(243, 106, 188, 0.3)';
        break;
      case 4:
        state.brightness = 120;
        state.sepia = 50;
        state.color = 'rgba(161, 44, 199, 0.31)';
        break;
      case 5:
        state.brightness = 110;
        state.contrast = 90;
        state.color = 'rgba(168, 223, 193, 0.4)';
        break;
      case 6:
        state.contrast = 120;
        state.saturation = 125;
        state.color = 'rgba(127, 187, 227, 0.2)';
        break;
      case 7:
        state.contrast = 90;
        state.sepia = 20;
        state.color = 'rgba(208, 186, 142, 0.5)';
        break;
      case 8:
        state.brightness = 105;
        state.hue = 350;
        state.color = 'rgba(66, 10, 14, 0.2)';
        break;
      case 9:
        state.brightness = 120;
        state.contrast = 90;
        state.saturation = 110;
        state.color = 'rgba(255, 177, 166, 0.5)';
        break;
      case 10:
        state.brightness = 110;
        state.contrast = 110;
        state.sepia = 30;
        state.grayscale = 100;
        state.color = 'rgba(0, 0, 0, 0)';
        break;
      case 11:
        state.contrast = 150;
        state.saturation = 110;
        state.color = 'rgba(255, 101, 80, 0.4)';
        break;
      case 12:
        state.brightness = 95;
        state.contrast = 95;
        state.saturation = 150;
        state.sepia = 25;
        state.color = 'rgba(3, 230, 26, 0.2)';
        break;
      case 13:
        state.color = 'rgba(86, 22, 214, 0.5)';
        break;
      case 14:
        state.brightness = 110;
        state.contrast = 85;
        state.saturation = 75;
        state.sepia = 22;
        state.color = 'rgba(173, 205, 239, 0.5)';
        break;
      case 15:
        state.brightness = 115;
        state.contrast = 75;
        state.saturation = 85;
        state.color = 'rgba(240, 149, 128, 0.2)';
        break;
      case 16:
        state.brightness = 110;
        state.contrast = 110;
        state.sepia = 30;
        state.color = 'rgba(125, 0, 247, 0.4)';
        break;
      case 17:
        state.brightness = 110;
        state.sepia = 30;
        state.saturation = 160;
        state.hue = 350;
        state.color = 'rgba(0, 227, 217, 0.4)';
        break;
      case 18:
        state.brightness = 108;
        state.contrast = 108;
        state.sepia = 8;
        state.color = 'rgba(58, 3, 57, 0.6)';
        break;
      case 19:
        state.sepia = 30;
        state.color = 'rgba(74, 25, 8, 0.5)';
        break;
    }
  }
}

export default Presets;
