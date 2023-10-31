import { Schema, model } from "mongoose";
import { ProviderType } from "../../constant/default";

/**
 * 채팅방 모델
 */

export interface IChatRoom {
  // owner : 방장
  // foreign key(ChatRoomId)
  owner: string;
  // name : 방 이름
  name: string;
  // member : 방 멤버
  // foreign key(ChatRoomId)
  member: string[];
  // lastMessage : 마지막 메시지
  lastMessage: string;
}

export class ChatRoom {
  // owner : 방장
  owner: string;
  // name : 방 이름
  name: string;
  // member : 방 멤버
  member: string[];
  // lastMessage : 마지막 메시지
  lastMessage: string;

  constructor({ owner, name, member, lastMessage }: IChatRoom) {
    this.owner = owner;
    this.name = name;
    this.member = member;
    this.lastMessage = lastMessage;
  }

  toJson() {
    return {
      owner: this.owner,
      name: this.name,
      member: this.member,
      lastMessage: this.lastMessage,
    };
  }
  static fromJson(json: any): ChatRoom {
    return new ChatRoom({
      owner: json.owner,
      name: json.name,
      member: json.member,
      lastMessage: json.lastMessage,
    });
  }
  toChatRoomModel() {
    return new ChatRoomModel({
      owner: this.owner,
      name: this.name,
      member: this.member,
      lastMessage: this.lastMessage,
    });
  }
}

const ChatRoomSchema = new Schema(
  {
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    member: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
    lastMessage: { type: String, required: true },
  },
  { timestamps: true }
);

export const ChatRoomModel = model("ChatRoom", ChatRoomSchema);
