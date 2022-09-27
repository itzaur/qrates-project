import "./styles/index.scss";

function importAll(r) {
  return r.keys().map(r);
}

const images = importAll(
  require.context("../src/images", false, /\.(png|jpe?g|svg)$/)
);

console.log(images);
