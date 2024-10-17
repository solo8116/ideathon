export type TRoom = Map<string, IRoomInfo>;

interface IRoomInfo {
  roomId: string;
  users: Map<string, string>;
}
