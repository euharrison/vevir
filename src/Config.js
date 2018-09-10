export default {
  // hide debugs and improve performance
  devMode: true,

  // enable it to control one player
  humanControl: true,

  // amount of players in the same game, don't set < 3, it will crash the app
  population: 20,

  // time to auto restart level
  restartTime: 20000,

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
