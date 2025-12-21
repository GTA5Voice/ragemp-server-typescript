import { RadioMember } from "./radioMember";

export class RadioChannel {
  readonly frequency: string;
  private readonly radioMembers: RadioMember[] = [];

  constructor(frequency: string, player: PlayerMp) {
    this.frequency = frequency;
    this.addToRadioChannel(player);
  }

  addToRadioChannel(player: PlayerMp): void {
    const member = this.getPlayerInRadio(player);
    if (member) return;

    player.call("Client:GTA5Voice:EnterRadio", [this.frequency]);
    player.setOwnVariable("RadioFrequency", this.frequency);
    this.radioMembers.push(new RadioMember(player));
    this.updateRadioData();
  }

  removeFromRadioChannel(player: PlayerMp): void {
    const member = this.getPlayerInRadio(player);
    if (!member) return;

    const index = this.radioMembers.indexOf(member);
    if (index >= 0) this.radioMembers.splice(index, 1);

    player.call("Client:GTA5Voice:LeaveRadio", [this.frequency]);
    player.setOwnVariable("RadioFrequency", null);
    this.updateRadioData();
  }

  isPlayerInRadio(player: PlayerMp): boolean {
    return this.radioMembers.some((member) => member.player === player);
  }

  setTalkingState(player: PlayerMp, talking: boolean): void {
    const member = this.getPlayerInRadio(player);
    if (!member) return;
    member.isTalking = talking;
    this.updateRadioData();
  }

  getRadioMembers(): RadioMember[] {
    return [...this.radioMembers];
  }

  getRadioMemberIds(): number[] {
    return this.radioMembers.map((member) => member.player.id);
  }

  getRadioMemberCount(): number {
    return this.radioMembers.length;
  }

  private getPlayerInRadio(player: PlayerMp): RadioMember | undefined {
    return this.radioMembers.find((member) => member.player === player);
  }

  private updateRadioData(): void {
    const activeTalkers = this.radioMembers.filter((member) => member.isTalking).map((member) => member.player.id);

    for (const member of this.radioMembers) {
      const list = activeTalkers.filter((id) => id !== member.player.id);
      member.player.call("Client:GTA5Voice:UpdateRadioMembers", [list]);
    }
  }
}
