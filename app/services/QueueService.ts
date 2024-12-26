import {prisma} from "~/prisma.server"

export async function enqueueSong(userId: number, id: string, name: string) {
  await prisma.song.create({data: {
    user_id: userId,
    video_id: id,
    name: name,
    requested_at: new Date(),
    rating: 0}});
}

export async function getNowPlaying(userId: number) {
  return await prisma.song.findFirst({where: {
    user_id: userId,
    played_at: {not: null}
  },
  orderBy: {played_at: "desc"}});
}

export async function getQueuedSongs(userId: number) {
  return await prisma.song.findMany({where: {
    user_id: userId,
    played_at: null
  },
  orderBy: {requested_at: "asc"}});
}

export async function upvoteSong(userId: number, songId: number) {
  const updatedSong = prisma.song.update({
    where: { user_id: userId, id: songId },
    data: { rating: { increment: 1 } }
  });

  return updatedSong;
}

export async function downvoteSong(userId: number, songId: number) {
  const updatedSong = prisma.song.update({
    where: { user_id: userId, id: songId },
    data: { rating: { decrement: 1 } }
  });

  return updatedSong;
}

export async function markSongAsPlayed(userId: number, songId: number) {
  const updatedSong = prisma.song.update({
    where: { user_id: userId, id: songId },
    data: { played_at: new Date() }
  });

  return updatedSong;
}