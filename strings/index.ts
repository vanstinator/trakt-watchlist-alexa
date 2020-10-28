/* *
 * We create a language strings object containing all of our strings.
 * The keys for each string will then be referenced in our code, e.g. handlerInput.t('WELCOME_MSG').
 * The localisation interceptor in index.js will automatically choose the strings
 * that match the request's locale.
 * */

export const STRINGS = {
  WELCOME: 'WELCOME'
};

export default {
  en: {
    translation: {
      [STRINGS.WELCOME]: 'Welcome, you can say Hello or Help. Which would you like to try?',
    }
  },
  es: {
    translation: {
      [STRINGS.WELCOME]: 'Bienvenido, puedes decir Hola o Ayuda. Cual prefieres?',
    }
  },
  de: {
    translation: {
      [STRINGS.WELCOME]: 'Wilkommen, du kannst Hallo oder Hilfe sagen. Was würdest du gern tun?',
    }
  },
  ja: {
    translation: {
      [STRINGS.WELCOME]: 'ようこそ。こんにちは、または、ヘルプ、と言ってみてください。どうぞ！',
    }
  },
  fr: {
    translation: {
      [STRINGS.WELCOME]: 'Bienvenue sur le génie des salutations, dites-moi bonjour et je vous répondrai',
    }
  },
  it: {
    translation: {
      [STRINGS.WELCOME]: 'Buongiorno! Puoi salutarmi con un ciao, o chiedermi aiuto. Cosa preferisci fare?',
    }
  },
  pt: {
    translation: {
      [STRINGS.WELCOME]: 'Bem vindo, você pode dizer Olá ou Ajuda. Qual você gostaria de fazer?',
    }
  },
  hi: {
    translation: {
      [STRINGS.WELCOME]: 'नमस्ते, आप hello या help कह सकते हैं. आप क्या करना चाहेंगे?',
    }
  }
};