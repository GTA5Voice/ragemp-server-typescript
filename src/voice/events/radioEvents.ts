export function registerRadioEvents(): void {
  mp.events.add("Server:GTA5Voice:OnRadioPTTChanged", (player: PlayerMp, talking: boolean) => {
    player.getRadioChannel()?.setTalkingState(player, talking);
  });
}
