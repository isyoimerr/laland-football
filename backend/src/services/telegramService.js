const TelegramBot = require('node-telegram-bot-api')
const { telegram } = require('../config/env')

let bot

if (telegram.botToken) {
  bot = new TelegramBot(telegram.botToken, { polling: false })
} else {
  console.warn('[Telegram] Bot token no configurado')
}

async function sendMessage(chatId, message) {
  if (!bot) {
    throw new Error('Bot de Telegram no inicializado')
  }
  try {
    await bot.sendMessage(chatId, message)
  } catch (error) {
    console.error('[Telegram] Error enviando mensaje:', error.message)
    throw error
  }
}

module.exports = {
  sendMessage,
}