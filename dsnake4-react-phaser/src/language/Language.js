import config from '../config/config';

const Language = {
    getLanguage() {
        const lang = localStorage.getItem('lang');
        if (lang && lang !== '') {
            return lang;
        } else {
            return config.defaultLanguage;
        }
    },
    setLanguage(lang) {
        if (lang && lang !== '') {
            localStorage.setItem('lang', lang);
            return lang;
        } else {
            return false;
        }
    },
    getTranslation(key, group) {
        if (group === undefined || group === '') {
            group = 'global';
        }

        const currentLanguage = this.getLanguage();
        let translations;
        try {
            translations = getLanguageFile(currentLanguage);
        }
        catch (e) {
            // no other place to look than global scene, returning an error message
            return 'FIXME: missing translation file ' + currentLanguage + '.json';
        }

        let translation = getTranslationFromFile(translations, key, group);
        if (translation) {
            return translation;
        } else {
            return translationNotFound(key, group, currentLanguage, translations);
        }
    },
};

function getLanguageFile(language) {
    return require('./' + language + '.json');
}

function getTranslationFromFile(translations, key, group) {
    if (translations.hasOwnProperty(group) && translations[group].hasOwnProperty(key)) {
        return translations[group][key];
    } else if (translations.hasOwnProperty(key)) {
        return translations[key];
    } else {
        return false;
    }
}

function translationNotFound(key, group, currentLanguage, translations) {
    let missingKey;
    if (translations.hasOwnProperty(group)) {
        missingKey = group + '.' + key;
    } else {
        missingKey = key;
    }
    return 'FIXME: translation for ' + missingKey + ' in ' + currentLanguage + '.json';
}

export default Language;