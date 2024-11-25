import {prisma} from "~/prisma.server"

export function enqueueSong(userId: number, id: string, name: string) {
  prisma.song.create({data: {
    user_id: userId,
    video_id: id,
    name: name,
    requested_at: new Date(),
    rating: 0}});
}