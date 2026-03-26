const DEFAULT_SETTINGS = {
  enabledProviders: ['chatgpt', 'claude', 'gemini', 'grok', 'deepseek'],
  defaultProvider: 'chatgpt',
  lastSelectedProvider: 'chatgpt',
  rememberLastProvider: true,  // When true, sidebar opens last selected provider; when false, always opens default provider
  theme: 'auto',
  keyboardShortcutEnabled: true,
  enterKeyBehavior: {
    enabled: true,
    preset: 'swapped',  // 'default', 'swapped', 'slack', 'discord', 'custom'
    newlineKey: 'Enter',
    newlineModifiers: { shift: false, ctrl: false, alt: false, meta: false },
    sendKey: 'Enter',
    sendModifiers: { shift: true, ctrl: false, alt: false, meta: false }
  }
};

export async function getSettings() {
  try {
    const result = await browser.storage.sync.get(DEFAULT_SETTINGS);
    return result;
  } catch (error) {
    console.warn('browser.storage.sync unavailable, using local', error);
    return await browser.storage.local.get(DEFAULT_SETTINGS);
  }
}

export async function getSetting(key) {
  const settings = await getSettings();
  return settings[key];
}

export async function saveSetting(key, value) {
  const update = { [key]: value };
  try {
    await browser.storage.sync.set(update);
  } catch (error) {
    console.warn('browser.storage.sync unavailable, using local', error);
    await browser.storage.local.set(update);
  }
}

export async function saveSettings(settings) {
  try {
    await browser.storage.sync.set(settings);
  } catch (error) {
    console.warn('browser.storage.sync unavailable, using local', error);
    await browser.storage.local.set(settings);
  }
}

export async function resetSettings() {
  try {
    await browser.storage.sync.clear();
    await browser.storage.sync.set(DEFAULT_SETTINGS);
  } catch (error) {
    console.warn('browser.storage.sync unavailable, using local', error);
    await browser.storage.local.clear();
    await browser.storage.local.set(DEFAULT_SETTINGS);
  }
}

export async function exportSettings() {
  return await getSettings();
}

export async function importSettings(settings) {
  // Validate settings
  const validKeys = Object.keys(DEFAULT_SETTINGS);
  const imported = {};
  const skipped = [];
  const errors = {};

  for (const [key, value] of Object.entries(settings)) {
    if (validKeys.includes(key)) {
      imported[key] = value;
    } else {
      skipped.push(key);
      errors[key] = 'Setting key not recognized';
    }
  }

  await saveSettings(imported);

  return {
    success: true,
    imported: Object.keys(imported),
    skipped,
    errors
  };
}
