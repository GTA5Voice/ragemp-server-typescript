import { ConsoleLogger } from "../../logging/consoleLogger";
import { SettingsService } from "../../services/settingsService";
import { PluginData } from "./pluginData";
import { VoiceData } from "./voiceData";

export class VoiceClient {
  readonly player: PlayerMp;
  readonly teamspeakName: string;
  private pluginData: PluginData | null = null;

  constructor(player: PlayerMp, teamspeakName: string) {
    this.player = player;
    this.teamspeakName = teamspeakName;
  }

  initialize(settingsService: SettingsService): void {
    const voiceData = new VoiceData(settingsService);
    ConsoleLogger.debug(`Initialize voice data: ${JSON.stringify(voiceData)}`);
    this.player.call("Client:GTA5Voice:initialize", [voiceData, this.teamspeakName]);
  }

  start(): void {
    this.player.call("Client:GTA5Voice:connect");
  }

  setPluginData(pluginData: PluginData, onDataChanged: (playerId: number, data: PluginData) => void): void {
    this.pluginData = pluginData;
    onDataChanged(this.player.id, pluginData);
  }

  getPluginData(): PluginData | null {
    return this.pluginData;
  }
}
