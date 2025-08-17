import { Prisma, Song } from "@prisma/client";
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
    played_at: null,
  },
  orderBy: {requested_at: "asc"}});
}

export function computeNowPlayingOrder(song: Song, index: number, promotionValue: number) {
  let newIndex = index;
  const rating = song.rating;

  if (Math.abs(rating) >= promotionValue) {
    const numPromotions = Math.trunc(rating / promotionValue);
    const offset = Math.sign(rating) * 0.5;
    newIndex += numPromotions + offset;
  }

  return {song, index: newIndex};
}

export async function getQueuedSongs(userId: number) {
  const user = await prisma.user.findFirst({where: {id: userId}});

  if (!user) {
    return [];
  }

  const whereClause: Prisma.SongWhereInput = {
    user_id: userId,
    played_at: null,
  };

  if (user.removal_enabled) {
    whereClause.rating = { gt: user.removal_value }
  }

  const nowPlaying = await prisma.song.findMany({
    where: whereClause,
    orderBy: { requested_at: "asc" }
  });

  const nowPlayingWithIndices = nowPlaying.map((song, index) => computeNowPlayingOrder(song, index, user.promotion_value));
  nowPlayingWithIndices.sort((a, b) => a.index - b.index);

  return nowPlaying;
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