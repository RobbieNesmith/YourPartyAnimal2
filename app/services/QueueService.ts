import {prisma} from "~/prisma.server"

export async function enqueueSong(userId: number, id: string, name: string) {
  await prisma.song.create({data: {
    user_id: userId,
    video_id: id,
    name: name,
    requested_at: new Date(),
    rating: 0}});
}