// initialize when ready
if (document.documentElement) {
  initialize();
}
else {
  window.addEventListener('DOMContentLoaded', initialize);
}

function initialize () {
  // don't inject more than once
  if (icon) {
    return;
  }

  const CLOCK_MANIFEST_URL = 'app://clock.gaiamobile.org/manifest.webapp';
  const CLOCK_QUERY_SELECTOR = `gaia-app-icon[data-identifier="${CLOCK_MANIFEST_URL}"]`;

  const RADIUS = 99;

  const GRADIENT_START_COLOR = '#232933';
  const GRADIENT_END_COLOR   = '#203642';

  const HOUR_HAND_COLOR   = '#eeeeee';
  const MINUTE_HAND_COLOR = '#eeeeee';
  const SECOND_HAND_COLOR = '#00caf2';

  const SECOND_HAND_POINTS = [[-1, -RADIUS * 0.8], [1, -RADIUS * 0.8], [1, RADIUS * 0.2], [-1, RADIUS * 0.2]];
  const MINUTE_HAND_POINTS = [[-1, -RADIUS * 0.9], [1, -RADIUS * 0.9], [6, 0], [-6, 0]];
  const HOUR_HAND_POINTS   = [[-3, -RADIUS * 0.7], [3, -RADIUS * 0.7], [6, 0], [-6, 0]];

  var canvas = document.createElement('canvas');
  var ctx = canvas.getContext('2d');

  canvas.id = 'live-clock-icon';
  canvas.width = canvas.height = RADIUS * 2;
  canvas.style.display = 'none';

  var gradient = ctx.createLinearGradient(0, 0, 0, RADIUS * 2);
  gradient.addColorStop(0, GRADIENT_START_COLOR);
  gradient.addColorStop(1, GRADIENT_END_COLOR);

  var iconComponent, oldIconImg, icon;

  function initIcon () {
    iconComponent = document.querySelector(CLOCK_QUERY_SELECTOR);
    if (!iconComponent) {
      return;
    }

    oldIconImg = iconComponent.shadowRoot.querySelector('#image-container img');
    if (!oldIconImg) {
      return;
    }
    oldIconImg.style.display = 'none';

    if (icon) {
      return icon;
    }

    icon = iconComponent.shadowRoot.querySelector('#image-container');
    icon.removeChild(oldIconImg);

    iconComponent.shadowRoot.appendChild(canvas);
    icon.style.backgroundImage = '-moz-element(#live-clock-icon)';
    icon.style.backgroundSize = RADIUS + 'px ' + RADIUS + 'px';
    return icon;
  }

  function drawBackground () {
    ctx.arc(RADIUS, RADIUS, RADIUS * 0.95, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();
  }

  function drawHand (rotation, points, color) {
    ctx.save();
    ctx.beginPath();
    ctx.translate(RADIUS, RADIUS);
    ctx.rotate(rotation);
    ctx.moveTo(points[0][0], points[0][1]);
    ctx.lineTo(points[1][0], points[1][1]);
    ctx.lineTo(points[2][0], points[2][1]);
    ctx.lineTo(points[3][0], points[3][1]);
    ctx.lineTo(points[0][0], points[0][1]);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.restore();
  }

  setInterval(function () {
    if (!initIcon()) {
      return;
    }

    var currentTime = new Date();
    var hour = currentTime.getHours();
    var minute = currentTime.getMinutes();
    var second = currentTime.getSeconds();

    drawBackground();
    drawHand(Math.PI * 2 / 60 * second, SECOND_HAND_POINTS, SECOND_HAND_COLOR);
    drawHand(Math.PI * 2 / 60 * minute, MINUTE_HAND_POINTS, MINUTE_HAND_COLOR);
    drawHand(Math.PI * 2 / 12 * hour, HOUR_HAND_POINTS, HOUR_HAND_COLOR);
  }, 1000);
}
