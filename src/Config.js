const config = {
  // hide debugs and improve performance
  devMode: false,

  // enable it to control one player
  humanControl: false,

  // amount of players in the same game, don't set < 3, it will crash the app
  population: 20,

  // time to auto restart level
  restartTime: 20,

  // tiles amount and sizes
  verticalTiles: 20,
  horizontalTiles: 40,
  tileWidth: 40,
  tileHeight: 40,
  tileDepth: 60,
  tileDepthMargin: 200,

  // dimensions of game, keep it low to improve performance
  gameWidth: 1920/2,
  gameHeight: 1080/2,
}

const params = new URLSearchParams(window.location.search);
for (let p of params) {
  const key = p[0];
  const value = Number(p[1]);
  config[key] = value;
}

export default config;
