import { Settings } from "../definitions/settings";
import { SettingsService } from "../services/settingsService";

type LogType = "Server" | "Voice" | "Radio" | "Phone";

export class ConsoleLogger {
  private static readonly tagBase = "GTA5Voice";
  private static settingsService: SettingsService | null = null;

  static configure(settingsService: SettingsService): void {
    this.settingsService = settingsService;
  }

  static info(message: string, type: LogType = "Server"): void {
    this.write(message, type, "INFO");
  }

  static success(message: string, type: LogType = "Server"): void {
    this.write(message, type, "SUCCESS");
  }

  static warning(message: string, type: LogType = "Server"): void {
    this.write(message, type, "WARN");
  }

  static error(message: string, type: LogType = "Server"): void {
    this.write(message, type, "ERROR");
  }

  static debug(message: string, type: LogType = "Server"): void {
    const debuggingEnabled = this.settingsService?.getBoolean(Settings.debuggingEnabled.key, false) ?? false;
    if (!debuggingEnabled) return;

    this.write(message, type, "DEBUG");
  }

  private static write(message: string, type: LogType, level: string): void {
    const timestamp = new Date().toISOString();
    const tag = `[${this.tagBase}-${type}]`;
    console.log(`${timestamp} ${tag} ${level}: ${message}`);
  }
}
