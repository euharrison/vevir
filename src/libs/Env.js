const NW = typeof nw !== 'undefined';
const DEV = !NW || nw.App.argv.indexOf('--dev') !== -1;

export default {
  NW,
  DEV,
}
