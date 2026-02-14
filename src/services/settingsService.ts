import { Settings, SettingDefinition, SettingValue } from "../definitions/settings";
import { ConsoleLogger } from "../logging/consoleLogger";

type SettingsMap = Map<string, SettingValue | undefined>;

export class SettingsService {
  private readonly settings: SettingsMap = new Map();

  initialize(): void {
    const definitions = this.getAllDefinedSettings();

    for (const definition of definitions) {
      let value = this.getSettingValue(definition.key);

      if (value === undefined || value === null || value === "") {
        if (definition.required && definition.defaultValue === undefined) {
          ConsoleLogger.warning(`Missing or empty required setting: '${definition.key}'`);
          this.cancelStartup("No default value found. Please update your configuration.");
        }

        if (definition.defaultValue !== undefined) {
          value = definition.defaultValue;
          ConsoleLogger.info(`Setting '${definition.key}' not found, using default: ${value}`);
        }
      } else {
        ConsoleLogger.info(`Setting '${definition.key}' set to: ${value}`);
      }

      this.settings.set(definition.key, value as SettingValue | undefined);
    }

    this.checkForConflicts();
  }

  getString(key: string, defaultValue = ""): string {
    const value = this.settings.get(key);
    if (value === undefined || value === null || value === "") return defaultValue;
    return String(value);
  }

  getNumber(key: string, defaultValue = 0): number {
    const value = this.settings.get(key);
    if (value === undefined || value === null || value === "") return defaultValue;
    if (typeof value === "number") return value;
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : defaultValue;
  }

  getBoolean(key: string, defaultValue = false): boolean {
    const value = this.settings.get(key);
    if (value === undefined || value === null || value === "") return defaultValue;
    if (typeof value === "boolean") return value;
    if (typeof value === "number") return value !== 0;
    const normalized = String(value).trim().toLowerCase();
    if (normalized === "true") return true;
    if (normalized === "false") return false;
    return defaultValue;
  }

  private checkForConflicts(): void {
    const ingameChannel = this.getNumber(Settings.ingameChannelId.key);
    const excludedChannelsRaw = this.getString(Settings.excludedChannels.key, "[]");
    let excludedChannels: number[] = [];

    try {
      const parsed = JSON.parse(excludedChannelsRaw);
      if (Array.isArray(parsed)) {
        excludedChannels = parsed.map((value) => Number(value)).filter((value) => Number.isFinite(value));
      }
    } catch {
      ConsoleLogger.warning("ExcludedChannels is not valid JSON. Falling back to empty array.");
    }

    if (excludedChannels.includes(ingameChannel)) {
      this.cancelStartup("The ingame channel cannot be excluded. Please update your configuration.");
    }
  }

  private getSettingValue(key: string): SettingValue | undefined {
    const config = mp.config as unknown as Record<string, SettingValue | undefined>;
    return config[key];
  }

  private cancelStartup(error: string): void {
    ConsoleLogger.error(error);
    throw new Error(error);
  }

  private getAllDefinedSettings(): SettingDefinition[] {
    return [
      Settings.virtualServerUid,
      Settings.ingameChannelId,
      Settings.fallbackChannelId,
      Settings.ingameChannelPassword,
      Settings.debuggingEnabled,
      Settings.language,
      Settings.calculationInterval,
      Settings.voiceRanges,
      Settings.excludedChannels,
      Settings.enableDistanceBasedVolume,
      Settings.volumeDecreaseMultiplier,
      Settings.minimumVoiceVolume,
    ];
  }
}
