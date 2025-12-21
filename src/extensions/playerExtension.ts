import { PhoneCall } from "../voice/models/phoneCall";
import { RadioChannel } from "../voice/models/radioChannel";
import { VoiceClient } from "../voice/models/voiceClient";
import { PhoneService } from "../voice/services/phoneService";
import { RadioService } from "../voice/services/radioService";
import { VoiceService } from "../voice/services/voiceService";

type ExtensionServices = {
  voiceService: VoiceService;
  phoneService: PhoneService;
  radioService: RadioService;
};

export function registerPlayerExtensions(services: ExtensionServices): void {
  const { voiceService, phoneService, radioService } = services;

  mp.Player.prototype.toVoiceClient = function toVoiceClient(): VoiceClient | null {
    return voiceService.findClient(this) ?? null;
  };

  mp.Player.prototype.getCurrentCall = function getCurrentCall(): PhoneCall | null {
    const callId = this.getCurrentCallId();
    if (!callId) return null;
    return phoneService.getCall(callId) ?? null;
  };

  mp.Player.prototype.getCurrentCallId = function getCurrentCallId(): string | null {
    return this.getOwnVariable<string>("CurrentCall") ?? null;
  };

  mp.Player.prototype.isInCall = function isInCall(): boolean {
    return this.getCurrentCall() !== null;
  };

  mp.Player.prototype.getRadioFrequency = function getRadioFrequency(): string {
    return this.getOwnVariable<string>("RadioFrequency") ?? "";
  };

  mp.Player.prototype.hasRadioFrequency = function hasRadioFrequency(): boolean {
    return this.getOwnVariable<string>("RadioFrequency") !== null;
  };

  mp.Player.prototype.getRadioChannel = function getRadioChannel(): RadioChannel | null {
    if (!this.hasRadioFrequency()) return null;
    return radioService.getRadioChannel(this.getRadioFrequency()) ?? null;
  };

  mp.Player.prototype.setForceMuted = function setForceMuted(forceMuted: boolean): void {
    voiceService.setForceMuted(this, forceMuted);
  };

  mp.Player.prototype.setPhoneSpeakerEnabled = function setPhoneSpeakerEnabled(phoneSpeakerEnabled: boolean): void {
    voiceService.setPhoneSpeakerEnabled(this, phoneSpeakerEnabled);
  };

  mp.Player.prototype.moveToVoiceChannel = function moveToVoiceChannel(): void {
    this.toVoiceClient()?.start();
  };
}

declare global {
  interface PlayerMp {
    toVoiceClient(): VoiceClient | null;
    getCurrentCall(): PhoneCall | null;
    getCurrentCallId(): string | null;
    isInCall(): boolean;
    getRadioFrequency(): string;
    hasRadioFrequency(): boolean;
    getRadioChannel(): RadioChannel | null;
    setForceMuted(forceMuted: boolean): void;
    setPhoneSpeakerEnabled(phoneSpeakerEnabled: boolean): void;
    moveToVoiceChannel(): void;
  }
}

export {};
