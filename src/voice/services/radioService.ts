import { RadioChannel } from "../models/radioChannel";

export class RadioService {
  private readonly radioChannels: RadioChannel[] = [];

  enterRadioChannel(player: PlayerMp, frequency: string): void {
    if (player.hasRadioFrequency()) {
      const oldFrequency = player.getRadioFrequency();
      if (frequency === oldFrequency) return;

      const oldChannel = this.getRadioChannel(oldFrequency);
      oldChannel?.removeFromRadioChannel(player);
      this.checkForDeadFrequency(oldChannel);
    }

    const newChannel = this.getRadioChannel(frequency);
    if (!newChannel) {
      this.radioChannels.push(new RadioChannel(frequency, player));
    } else {
      newChannel.addToRadioChannel(player);
    }
  }

  leaveRadioChannel(player: PlayerMp): void {
    if (!player.hasRadioFrequency()) return;

    const frequency = player.getRadioFrequency();
    const channel = this.getRadioChannel(frequency);
    channel?.removeFromRadioChannel(player);
    this.checkForDeadFrequency(channel);
  }

  onPlayerDisconnected(player: PlayerMp): void {
    for (const channel of this.radioChannels.filter((entry) => entry.isPlayerInRadio(player))) {
      channel.removeFromRadioChannel(player);
      this.checkForDeadFrequency(channel);
    }
  }

  getRadioChannel(frequency: string): RadioChannel | undefined {
    return this.radioChannels.find((channel) => channel.frequency === frequency);
  }

  private checkForDeadFrequency(channel: RadioChannel | undefined): void {
    if (!channel || channel.getRadioMemberCount() > 0) return;
    const index = this.radioChannels.indexOf(channel);
    if (index >= 0) this.radioChannels.splice(index, 1);
  }
}
