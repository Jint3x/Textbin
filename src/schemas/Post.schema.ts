import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type PostDocument = Post & Document;

@Schema()
export class Post {
  @Prop({ required: true })
  _id: string;

  @Prop({ required: true })
  header: string;

  @Prop({ required: true })
  text: string;

  @Prop({ default: [] })
  tags: string[];

  @Prop({ required: true })
  submittedOn: Date;
}

export const PostSchema = SchemaFactory.createForClass(Post);
