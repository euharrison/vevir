export default {
  // show debugs
  devMode: true,

  // enable it to control one player
  humanControl: true,

  // amount of players in the same game, don't set < 3, it will crash the app
  population: 6,

  // time to auto restart level
  restartTime: 20000,

  // tiles amount and sizes
  verticalTiles: 20,
  horizontalTiles: 40,
  tileWidth: 40,
  tileHeight: 40,

  // dimensions of game, keep it low to improve performance
  gameWidth: 1920/2,
  gameHeight: 1080/2,
}
