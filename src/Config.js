const config = {
  // ignore phaser render engine for better performance
  devMode: false,

  // show fps rate
  showFPS: false,

  // fftSize for audio buffer length
  fftSize: 256 * 2,

  // enable it to control one player
  humanControl: false,

  // amount of players in the same game, don't set < 3, it will crash the app
  population: 20,

  // time to auto restart level
  restartTime: 15,

  // tiles amount and sizes
  verticalTiles: 80,
  horizontalTiles: 80,
  tileWidth: 80,
  tileHeight: 10,
  tileDepth: 60,
  tileDepthMargin: 200,

  // dimensions of game, keep it low to improve performance
  gameWidth: 1920/2,
  gameHeight: 1080/2,

  // how faster player can move
  playerVelocity: 400,
  playerJump: 500,
}

const params = new URLSearchParams(window.location.search);
for (let p of params) {
  const key = p[0];
  const value = Number(p[1]);
  config[key] = value;
}

export default config;
