import { PhoneService } from "../voice/services/phoneService";
import { RadioService } from "../voice/services/radioService";
import { VoiceService } from "../voice/services/voiceService";
import { SettingsService } from "../services/settingsService";

declare global {
  var gta5voice:
    | {
        voiceService: VoiceService;
        phoneService: PhoneService;
        radioService: RadioService;
        settingsService: SettingsService;
      }
    | undefined;
}

export {};
