import { ConsoleLogger } from "../../logging/consoleLogger";
import { PluginData, createPluginData } from "../models/pluginData";
import { VoiceClient } from "../models/voiceClient";

type VoiceClientData = {
  RemoteId: number;
  TeamspeakId: number | null;
  WebsocketConnection: boolean;
  CurrentVoiceRange: number;
  ForceMuted: boolean;
  PhoneSpeakerEnabled: boolean;
  CurrentCallMembers: number[];
};

export class VoiceService {
  private readonly clients: VoiceClient[] = [];

  findClient(player: PlayerMp): VoiceClient | undefined {
    return this.clients.find((client) => client.player === player);
  }

  private findClientById(playerId: number): VoiceClient | undefined {
    return this.clients.find((client) => client.player.id === playerId);
  }

  addClient(player: PlayerMp): VoiceClient | null {
    if (this.findClient(player)) {
      ConsoleLogger.debug(`Voice client (id: ${player.id}) already exists`);
      return null;
    }

    const client = new VoiceClient(player, this.createTeamspeakName());
    this.clients.push(client);
    ConsoleLogger.debug(`Added voice client (id: ${client.player.id})`);
    return client;
  }

  removeClient(player: PlayerMp): void {
    const client = this.findClient(player);
    if (!client) {
      ConsoleLogger.debug(`Couldn't find voice client (id: ${player.id})`);
      return;
    }

    this.clients.splice(this.clients.indexOf(client), 1);
    this.removeLocalClientData(client.player.id);
    ConsoleLogger.debug(`Removed voice client (id: ${client.player.id})`);
  }

  loadLocalClientData(remoteId: number): void {
    const requestingClient = this.findClientById(remoteId);
    if (!requestingClient) return;

    const otherClients = this.clients.filter((client) => client.player.id !== remoteId);
    if (otherClients.length === 0) return;

    const chunkSize = 1 << 15;
    for (const chunk of this.chunk(otherClients, chunkSize)) {
      const clientData: VoiceClientData[] = chunk.map((client) => {
        const pluginData = client.getPluginData() ?? createPluginData();
        return {
          RemoteId: client.player.id,
          TeamspeakId: pluginData.TeamspeakId,
          WebsocketConnection: pluginData.WebsocketConnection,
          CurrentVoiceRange: pluginData.CurrentVoiceRange,
          ForceMuted: pluginData.ForceMuted,
          PhoneSpeakerEnabled: pluginData.PhoneSpeakerEnabled,
          CurrentCallMembers: pluginData.CurrentCallMembers ?? [],
        };
      });

      requestingClient.player.call("Client:GTA5Voice:LoadClientData", [JSON.stringify(clientData)]);
    }
  }

  updateLocalClientData = (remoteId: number, pluginData: PluginData): void => {
    const players = this.getOtherVoiceClientPlayers(remoteId);
    if (players.length === 0) return;
    mp.players.call(players, "Client:GTA5Voice:UpdateClientData", [remoteId, pluginData]);
  };

  setForceMuted(player: PlayerMp, forceMuted: boolean): void {
    const client = this.findClient(player);
    if (!client) {
      ConsoleLogger.debug(`Couldn't find voice client (id: ${player.id})`);
      return;
    }

    const pluginData = client.getPluginData();
    if (!pluginData || pluginData.ForceMuted === forceMuted) return;

    client.setPluginData({ ...pluginData, ForceMuted: forceMuted }, this.updateLocalClientData);
  }

  setPhoneSpeakerEnabled(player: PlayerMp, phoneSpeakerEnabled: boolean): void {
    const client = this.findClient(player);
    if (!client) {
      ConsoleLogger.debug(`Couldn't find voice client (id: ${player.id})`);
      return;
    }

    if (!player.getCurrentCall()) {
      phoneSpeakerEnabled = false;
    }

    const pluginData = client.getPluginData();
    if (!pluginData || pluginData.PhoneSpeakerEnabled === phoneSpeakerEnabled) return;

    client.setPluginData({ ...pluginData, PhoneSpeakerEnabled: phoneSpeakerEnabled }, this.updateLocalClientData);
  }

  setCurrentCallMembers(player: PlayerMp, callMembers: number[]): void {
    const client = this.findClient(player);
    if (!client) {
      ConsoleLogger.debug(`Couldn't find voice client (id: ${player.id})`);
      return;
    }

    const pluginData = client.getPluginData();
    if (!pluginData) return;

    client.setPluginData({ ...pluginData, CurrentCallMembers: callMembers }, this.updateLocalClientData);
  }

  clearCurrentCallMembers(player: PlayerMp): void {
    this.setCurrentCallMembers(player, []);
  }

  private getOtherVoiceClientPlayers(selfId: number): PlayerMp[] {
    return this.clients.filter((client) => client.player.id !== selfId).map((client) => client.player);
  }

  private removeLocalClientData(remoteId: number): void {
    const players = this.getOtherVoiceClientPlayers(remoteId);
    if (players.length === 0) return;
    mp.players.call(players, "Client:GTA5Voice:RemoveClient", [remoteId]);
  }

  private createTeamspeakName(): string {
    const hex = "0123456789abcdef";
    let value = "";
    for (let i = 0; i < 32; i += 1) {
      value += hex[Math.floor(Math.random() * hex.length)];
    }
    return value.slice(0, 24);
  }

  private chunk<T>(items: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < items.length; i += size) {
      chunks.push(items.slice(i, i + size));
    }
    return chunks;
  }
}
