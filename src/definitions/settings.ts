export type SettingValue = string | number | boolean;

export interface SettingDefinition<T extends SettingValue = SettingValue> {
  key: string;
  required?: boolean;
  defaultValue?: T;
}

export const Settings = {
  virtualServerUid: { key: "VirtualServerUID", required: true } as SettingDefinition<string>,
  ingameChannelId: { key: "IngameChannelId", required: true } as SettingDefinition<number>,
  fallbackChannelId: { key: "FallbackChannelId" } as SettingDefinition<number>,
  ingameChannelPassword: { key: "IngameChannelPassword", required: true } as SettingDefinition<string>,
  debuggingEnabled: { key: "DebuggingEnabled" } as SettingDefinition<boolean>,
  language: { key: "Language", required: true } as SettingDefinition<string>,
  calculationInterval: { key: "CalculationInterval", defaultValue: 250 } as SettingDefinition<number>,
  voiceRanges: { key: "VoiceRanges", defaultValue: "[1, 3, 8, 15]" } as SettingDefinition<string>,
  excludedChannels: { key: "ExcludedChannels", defaultValue: "[]" } as SettingDefinition<string>,
};
