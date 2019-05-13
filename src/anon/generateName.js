import names from "./names";

function generateRandom(max) {
  return Math.floor(Math.random() * (max - 1));
}

function getRandomName() {
  let digits = Math.floor(1000 + Math.random() * 9000);
  return names[generateRandom(names.length)] + "." + digits;
}

export default getRandomName;
