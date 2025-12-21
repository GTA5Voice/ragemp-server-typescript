import { Settings } from "../../definitions/settings";
import { SettingsService } from "../../services/settingsService";

export class VoiceData {
  VirtualServerUid: string;
  IngameChannelId: number;
  IngameChannelPassword: string;
  FallbackChannelId: number;
  Language: string;
  CalculationInterval: number;
  VoiceRanges: string;
  ExcludedChannels: string;

  constructor(settingsService: SettingsService) {
    this.VirtualServerUid = settingsService.getString(Settings.virtualServerUid.key);
    this.IngameChannelId = settingsService.getNumber(Settings.ingameChannelId.key);
    this.IngameChannelPassword = settingsService.getString(Settings.ingameChannelPassword.key);
    this.FallbackChannelId = settingsService.getNumber(Settings.fallbackChannelId.key);
    this.Language = settingsService.getString(Settings.language.key);
    this.CalculationInterval = settingsService.getNumber(Settings.calculationInterval.key);
    this.VoiceRanges = settingsService.getString(
      Settings.voiceRanges.key,
      Settings.voiceRanges.defaultValue ?? "[1, 3, 8, 15]"
    );
    this.ExcludedChannels = settingsService.getString(
      Settings.excludedChannels.key,
      Settings.excludedChannels.defaultValue ?? "[]"
    );
  }
}
