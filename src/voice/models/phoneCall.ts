import { VoiceService } from "../services/voiceService";

export class PhoneCall {
  readonly identifier: string;
  private readonly callOwner: PlayerMp;
  private readonly callMembers: PlayerMp[];
  private readonly voiceService: VoiceService;

  constructor(owner: PlayerMp, target: PlayerMp, voiceService: VoiceService) {
    this.identifier = PhoneCall.createIdentifier();
    this.callOwner = owner;
    this.callMembers = [owner, target];
    this.voiceService = voiceService;

    owner.setOwnVariable("CurrentCall", this.identifier);
    target.setOwnVariable("CurrentCall", this.identifier);
    this.updateCall();
  }

  addClientToCall(player: PlayerMp): boolean {
    if (this.callMembers.includes(player)) return false;

    this.callMembers.push(player);
    player.setOwnVariable("CurrentCall", this.identifier);
    this.updateCall();
    return true;
  }

  removeClientFromCall(player: PlayerMp): void {
    const index = this.callMembers.indexOf(player);
    if (index === -1) return;

    this.callMembers.splice(index, 1);
    player.call("Client:GTA5Voice:KillPhoneCall");
    player.setOwnVariable("CurrentCall", null);
    player.setPhoneSpeakerEnabled(false);
    this.voiceService.clearCurrentCallMembers(player);
    this.updateCall();
  }

  killCall(): void {
    mp.players.call(this.callMembers, "Client:GTA5Voice:KillPhoneCall");

    for (const member of this.callMembers) {
      member.setOwnVariable("CurrentCall", null);
      member.setPhoneSpeakerEnabled(false);
      this.voiceService.clearCurrentCallMembers(member);
    }
  }

  getCallMembers(): PlayerMp[] {
    return [...this.callMembers];
  }

  getCallMembersIds(): number[] {
    return this.callMembers.map((member) => member.id);
  }

  isCallOwner(player: PlayerMp): boolean {
    return this.callOwner === player;
  }

  getCallMemberCount(): number {
    return this.callMembers.length;
  }

  private updateCall(): void {
    const allIds = this.getCallMembersIds();

    for (const member of this.callMembers) {
      const otherMemberIds = allIds.filter((id) => id !== member.id);
      member.call("Client:GTA5Voice:UpdatePhoneCall", [otherMemberIds]);
      this.voiceService.setCurrentCallMembers(member, otherMemberIds);
    }
  }

  private static createIdentifier(): string {
    return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 12)}`;
  }
}
