import { PhoneCall } from "../models/phoneCall";
import { VoiceService } from "./voiceService";

export class PhoneService {
  private readonly phoneCalls: PhoneCall[] = [];
  private readonly voiceService: VoiceService;

  constructor(voiceService: VoiceService) {
    this.voiceService = voiceService;
  }

  startCall(player: PlayerMp, target: PlayerMp): void {
    if (player.isInCall() || target.isInCall()) return;

    const call = new PhoneCall(player, target, this.voiceService);
    this.phoneCalls.push(call);
  }

  endCall(player: PlayerMp): void {
    const call = player.getCurrentCall();
    if (!call) return;

    if (call.isCallOwner(player) || call.getCallMemberCount() <= 2) {
      call.killCall();
      this.phoneCalls.splice(this.phoneCalls.indexOf(call), 1);
    } else {
      call.removeClientFromCall(player);
    }
  }

  addToCallGroup(caller: PlayerMp, target: PlayerMp): boolean {
    if (target.isInCall()) return false;

    const callIdentifier = caller.getCurrentCallId();
    if (!callIdentifier) return false;

    const call = this.phoneCalls.find((entry) => entry.identifier === callIdentifier);
    if (!call) return false;

    return call.addClientToCall(target);
  }

  onPlayerDisconnected(player: PlayerMp): void {
    for (const call of this.phoneCalls.filter((entry) => entry.getCallMembers().includes(player))) {
      call.removeClientFromCall(player);
    }
  }

  getCall(callIdentifier: string): PhoneCall | undefined {
    return this.phoneCalls.find((entry) => entry.identifier === callIdentifier);
  }
}
