const config = {
  // ignore phaser render engine for better performance
  devMode: true,

  // show fps rate
  showFPS: false,

  // fftSize for audio buffer length
  fftSize: 256 * 2,

  // time to capture audio and create the level
  captureTime: 2 * 1000,

  // enable it to control one player with arrow keys
  humanControl: false,

  // amount of players in the same game, don't set < 3, it will crash the app
  population: 20,

  // time to auto restart level
  restartTime: 999999,

  // tiles amount and sizes
  verticalTiles: 20,
  horizontalTiles: 80,
  tileWidth: 200,
  tileHeight: 20,
  tileDepth: 60,
  tileDepthMargin: 200,

  // dimensions of game, keep it low to improve performance
  gameWidth: 1920/2,
  gameHeight: 1080/2,

  // how faster player can move
  playerVelocity: 400,
  playerJump: 800,
}

const params = new URLSearchParams(window.location.search);
for (let p of params) {
  const key = p[0];
  const value = Number(p[1]);
  config[key] = value;
}

export default config;
