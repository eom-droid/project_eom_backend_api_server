// import { Schema, model } from "mongoose";

// /**
//  * 유저 모델
//  */

// export interface IChat {
//   // roomId : 방 아이디
//   roomId: string;
//   // senderId : 보낸 사람
//   senderId: string;
//   // message : 메시지
//   message: string | undefined;
//   // img : 이미지
//   img: string | undefined;
//   // lastRead : 사용자의 마지막 읽은 메시지
//   // 예 : 10개의 채팅에서 5번쨰까지 읽으며 채팅을 진행하고(고민중)
//   lastRead: string[];
// }

// export class Chat {
//   // roomId : 방 아이디
//   roomId: string;
//   // senderId : 보낸 사람
//   senderId: string;
//   // message : 메시지
//   message: string | undefined;
//   // img : 이미지
//   img: string | undefined;
//   // lastRead : 사용자의 마지막 읽은 메시지

//   constructor({ owner, name, member, lastMessage }: IChat) {
//     this.owner = owner;
//     this.name = name;
//     this.member = member;
//     this.lastMessage = lastMessage;
//   }

//   toJson() {
//     return {
//       owner: this.owner,
//       name: this.name,
//       member: this.member,
//       lastMessage: this.lastMessage,
//     };
//   }
//   static fromJson(json: any): Chat {
//     return new Chat({
//       owner: json.owner,
//       name: json.name,
//       member: json.member,
//       lastMessage: json.lastMessage,
//     });
//   }
//   toChatModel() {
//     return new ChatModel({
//       owner: this.owner,
//       name: this.name,
//       member: this.member,
//       lastMessage: this.lastMessage,
//     });
//   }
// }

// const ChatSchema = new Schema(
//   {
//     owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
//     name: { type: String, required: true },
//     member: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
//     lastMessage: { type: String, required: true },
//   },
//   { timestamps: true }
// );

// export const ChatModel = model("Chat", ChatSchema);
