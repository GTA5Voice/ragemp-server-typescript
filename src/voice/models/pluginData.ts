export interface PluginData {
  TeamspeakId: number | null;
  WebsocketConnection: boolean;
  CurrentVoiceRange: number;
  ForceMuted: boolean;
  PhoneSpeakerEnabled: boolean;
  CurrentCallMembers: number[];
}

type PluginDataInput = Partial<PluginData> & {
  teamspeakId?: number | null;
  websocketConnection?: boolean;
  currentVoiceRange?: number;
  forceMuted?: boolean;
  phoneSpeakerEnabled?: boolean;
  currentCallMembers?: number[];
};

export function createPluginData(data: PluginDataInput = {}): PluginData {
  return {
    TeamspeakId: data.TeamspeakId ?? data.teamspeakId ?? null,
    WebsocketConnection: data.WebsocketConnection ?? data.websocketConnection ?? false,
    CurrentVoiceRange: data.CurrentVoiceRange ?? data.currentVoiceRange ?? 0,
    ForceMuted: data.ForceMuted ?? data.forceMuted ?? false,
    PhoneSpeakerEnabled: data.PhoneSpeakerEnabled ?? data.phoneSpeakerEnabled ?? false,
    CurrentCallMembers: data.CurrentCallMembers ?? data.currentCallMembers ?? [],
  };
}
