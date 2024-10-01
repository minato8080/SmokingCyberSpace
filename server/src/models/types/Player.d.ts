import { GameObject } from '../GameObject';

export class Player extends GameObject {
  IP: string;
  socketId: string;
  nickname: string;
  avatar: string;
  width: number;
  height: number;
  x: number;
  y: number;
  angle: number;
  frameX: number;
  frameY: number;
  speed: number;
  isMove: boolean;
  movement: Record<string, any>;
  msg: string;
  msgCountDown: number;
  isSmokeAction: boolean;
  smokeActionCountDown: number;
  smokeActionFrame: number;
  isSmoking: boolean;
  smokingCountDown: number;
  smokingFrame: number;

  constructor(obj?: Partial<Player>);

  toJSON(): {
    avatar: string;
    socketId: string;
    nickname: string;
    msg: string;
    angle: number;
    isMove: boolean;
    frameX: number;
    frameY: number;
    isSmoking: boolean;
    isSmokeAction: boolean;
    smokeActionFrame: number;
    smokingFrame: number;
  } & ReturnType<GameObject['toJSON']>;
}