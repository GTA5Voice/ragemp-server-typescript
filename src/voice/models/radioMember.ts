export class RadioMember {
  player: PlayerMp;
  isTalking: boolean;

  constructor(player: PlayerMp, isTalking = false) {
    this.player = player;
    this.isTalking = isTalking;
  }
}
