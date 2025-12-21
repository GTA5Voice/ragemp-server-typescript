import { Settings } from "../definitions/settings";
import { SettingsService } from "../services/settingsService";

type LogType = "Server" | "Voice" | "Radio" | "Phone";

export class ConsoleLogger {
  private static readonly tagBase = "GTA5Voice";
  private static settingsService: SettingsService | null = null;
  private static readonly colors = {
    cyan: "\x1b[38;2;97;214;214m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    red: "\x1b[31m",
    gray: "\x1b[90m",
    reset: "\x1b[0m",
  };

  static configure(settingsService: SettingsService): void {
    this.settingsService = settingsService;
  }

  static info(message: string, type: LogType = "Server"): void {
    this.write(message, type, "INFO", this.colors.cyan);
  }

  static success(message: string, type: LogType = "Server"): void {
    this.write(message, type, "SUCCESS", this.colors.green);
  }

  static warning(message: string, type: LogType = "Server"): void {
    this.write(message, type, "WARN", this.colors.yellow);
  }

  static error(message: string, type: LogType = "Server"): void {
    this.write(message, type, "ERROR", this.colors.red);
  }

  static debug(message: string, type: LogType = "Server"): void {
    const debuggingEnabled = this.settingsService?.getBoolean(Settings.debuggingEnabled.key, false) ?? false;
    if (!debuggingEnabled) return;

    this.write(message, type, "DEBUG", this.colors.gray);
  }

  private static write(message: string, type: LogType, level: string, tagColor: string): void {
    const timestamp = new Date().toISOString().replace(/\.\d{3}Z$/, "");
    const tag = `${tagColor}[${this.tagBase}-${type}]${this.colors.reset}`;
    console.log(`${tag} ${timestamp} | ${message}`);
  }
}
