import { Prisma, Song } from "@prisma/client";
import {prisma} from "~/prisma.server"

export async function enqueueSong(userId: number, id: string, name: string, guestId: string | null, preset: boolean = false) {
  await prisma.song.create({data: {
    user_id: userId,
    video_id: id,
    name: name,
    requested_at: new Date(),
    rating: 0,
    preset: preset,
    requested_by: guestId,
  }});
}

export async function hasGuestRequestedRecently(userId: number, guestId: string, minutes: number) {
  const latestGuestSong = await prisma.song.findFirst({where: {
    user_id: userId,
    requested_at: {gt: new Date(new Date().getTime() - minutes * 60000)},
    preset: false,
    requested_by: guestId
  }});

  return latestGuestSong !== null;
}

export async function getNowPlaying(userId: number) {
  const nowPlaying = await prisma.song.findFirst({where: {
    user_id: userId,
    played_at: null,
    preset: false,
  },
  orderBy: {requested_at: "asc"}});

  if (nowPlaying == null) {
    return await prisma.song.findFirst({where: {
      user_id: userId,
      preset: true,
    },
      orderBy: [{
        played_at: {
          sort: "asc",
          nulls: "first"
        },
      },
      {
        requested_at: "asc",
      }]
    });
  }

  return nowPlaying;
}

export function computeNowPlayingOrder(song: Song, index: number, promotionValue: number) {
  let newIndex = index;
  const rating = song.rating;

  if (Math.abs(rating) >= promotionValue) {
    const numPromotions = Math.trunc(rating / promotionValue);
    const offset = Math.sign(rating) * 0.5;
    newIndex -= (numPromotions + offset);
  }

  return {song, index: newIndex};
}

export async function getQueuedSongs(userId: number, includePresets: boolean = false) {
  const user = await prisma.user.findFirst({where: {id: userId}});

  if (!user) {
    return [];
  }

  const whereClause: Prisma.SongWhereInput = {
    user_id: userId,
    played_at: null,
    preset: false
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

  if (includePresets) {
    const presets = await getPresetSongs(userId);
    return [...nowPlaying, ...presets];
  }

  return nowPlaying;
}

export async function getPresetSongs(userId: number) {
  const user = await prisma.user.findFirst({ where: { id: userId } });

  if (!user) {
    return [];
  }

  return await prisma.song.findMany({
    where: {
      user_id: userId,
      preset: true,
    },
    orderBy: [
      { played_at: {sort: "asc", nulls: "first"} },
      { requested_at: "asc" }
    ]
  });
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