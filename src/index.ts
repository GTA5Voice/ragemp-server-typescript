import { ConsoleLogger } from "./logging/consoleLogger";
import { SettingsService } from "./services/settingsService";
import { registerPlayerExtensions } from "./extensions/playerExtension";
import { registerRadioEvents } from "./voice/events/radioEvents";
import { registerVoiceEvents } from "./voice/events/voiceEvents";
import { PhoneService } from "./voice/services/phoneService";
import { RadioService } from "./voice/services/radioService";
import { VoiceService } from "./voice/services/voiceService";

const settingsService = new SettingsService();
const voiceService = new VoiceService();
const phoneService = new PhoneService(voiceService);
const radioService = new RadioService();

registerPlayerExtensions({ voiceService, phoneService, radioService });
registerVoiceEvents(voiceService);
registerRadioEvents();

mp.events.add("packagesLoaded", () => {
  settingsService.initialize();
  ConsoleLogger.configure(settingsService);
  ConsoleLogger.info("GTA5Voice initialized.");
});

mp.events.add("playerJoin", (player: PlayerMp) => {
  const voiceClient = voiceService.addClient(player);
  voiceClient?.initialize(settingsService);
  voiceService.loadLocalClientData(player.id);
  player.moveToVoiceChannel();
});

mp.events.add("playerDeath", (player: PlayerMp) => {
  player.setForceMuted(true);
});

mp.events.add("playerSpawn", (player: PlayerMp) => {
  player.setForceMuted(false);
});

mp.events.add("playerQuit", (player: PlayerMp) => {
  player.call("Client:GTA5Voice:OnPlayerDisconnected");
  voiceService.removeClient(player);
  phoneService.onPlayerDisconnected(player);
  radioService.onPlayerDisconnected(player);
});

globalThis.gta5voice = {
  voiceService,
  phoneService,
  radioService,
  settingsService,
};

(mp as unknown as { gta5voice?: typeof globalThis.gta5voice }).gta5voice = globalThis.gta5voice;

export { settingsService, voiceService, phoneService, radioService };
