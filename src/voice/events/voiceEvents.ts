import { PluginData, createPluginData } from "../models/pluginData";
import { VoiceService } from "../services/voiceService";

export function registerVoiceEvents(voiceService: VoiceService): void {
  mp.events.add("Server:GTA5Voice:OnTalkingStateChanged", (player: PlayerMp, talking: boolean) => {
    mp.players.callInRange(player.position, 50, "Client:GTA5Voice:SyncTalkingState", [player, talking]);
  });

  mp.events.add("Server:GTA5Voice:OnTeamspeakDataChanged", (player: PlayerMp, pluginDataRaw: string) => {
    let pluginData: PluginData;
    try {
      const parsed = JSON.parse(pluginDataRaw) as Partial<PluginData>;
      pluginData = createPluginData(parsed);
    } catch {
      pluginData = createPluginData();
    }

    player.toVoiceClient()?.setPluginData(pluginData, voiceService.updateLocalClientData);
  });
}
