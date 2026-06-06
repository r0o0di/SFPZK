const TRANSLATION_CACHE_PREFIX = 'entryTranslation_v1';
const TRANSLATION_CACHE_TTL = 24 * 60 * 60 * 1000;

function hashString(str) {
  let hash = 5381;
  for (let i = 0; i < str.length; i += 1) {
    hash = ((hash << 5) + hash) + str.charCodeAt(i);
  }
  return `${hash >>> 0}`;
}

export function getTranslationCacheKey(entryId, targetLang, text) {
  return `${TRANSLATION_CACHE_PREFIX}:${entryId}:${targetLang}:${hashString(text || '')}`;
}

export function loadTranslationFromCache(entryId, targetLang, text) {
  if (typeof window === 'undefined') return null;

  try {
    const key = getTranslationCacheKey(entryId, targetLang, text);
    const stored = localStorage.getItem(key);
    if (!stored) return null;

    const parsed = JSON.parse(stored);
    if (!parsed || typeof parsed.expiresAt !== 'number' || typeof parsed.translatedText !== 'string') {
      localStorage.removeItem(key);
      return null;
    }

    if (parsed.expiresAt <= Date.now()) {
      localStorage.removeItem(key);
      return null;
    }

    return parsed.translatedText;
  } catch (error) {
    return null;
  }
}

export function saveTranslationToCache(entryId, targetLang, text, translatedText) {
  if (typeof window === 'undefined') return;

  try {
    const key = getTranslationCacheKey(entryId, targetLang, text);
    localStorage.setItem(
      key,
      JSON.stringify({
        translatedText,
        expiresAt: Date.now() + TRANSLATION_CACHE_TTL,
      })
    );
  } catch (error) {
    // ignore localStorage failures silently
  }
}
