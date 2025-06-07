const emojiRegex = require("emoji-regex");

function noEmojis(value, field) {
  if (typeof value === "string" && emojiRegex().test(value)) {
    throw new Error(`O campo ${field} não pode conter emoticonos.`);
  }
}

module.exports = noEmojis;
