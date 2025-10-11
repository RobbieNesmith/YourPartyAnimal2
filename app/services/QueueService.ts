import { Prisma, Song } from "@prisma/client";
import {prisma} from "~/prisma.server"

export async function enqueueSong(userId: number, id: string, name: string, guestId: string | null, preset: boolean = false) {
  const user = await prisma.user.findFirst({
    where: {
      id: userId,
    }
  });

  if (!user) {
    return;
  }

  let requestedAt = new Date();
  if (preset === false) {
    const latestGuestSong = await prisma.song.findFirst({
      where: {
        user_id: userId,
        preset: false,
        requested_by: guestId
      },
      orderBy: { requested_at: "desc" }
    });
    if (latestGuestSong) {
      const nextAllowedDate = new Date(latestGuestSong.requested_at.getTime() + user.rate_limit * 60000);
      if (nextAllowedDate > requestedAt) {
        requestedAt = nextAllowedDate;
      }
    }
  }

  await prisma.song.create({data: {
    user_id: userId,
    video_id: id,
    name: name,
    requested_at: requestedAt,
    rating: 0,
    preset: preset,
    requested_by: guestId,
  }});
}

export async function hasPartyStoppedRequests(userId: number) {
  const user = await prisma.user.findFirstOrThrow({ where: { id: userId } });

  return user.stop_requests;
}

export async function isSongAlreadyQueued(userId: number, videoId: string) {
  const song = await prisma.song.findFirst({ where: {
    user_id: userId,
    video_id: videoId,
    preset: false,
  }});

  return song != null;
}

export async function getNowPlaying(userId: number) {
  const user = await prisma.user.findUnique({
    where: {
      id: userId
    }
  });

  if (!user?.now_playing_id) {
    return null;
  }

  const nowPlaying = await prisma.song.findFirst({
    where: {
      user_id: userId,
      id: user.now_playing_id
    }
  });

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

  if (user.now_playing_id) {
    whereClause.id = { not: { equals: user.now_playing_id } };
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

  const presetWhereClause: Prisma.SongWhereInput = {
    user_id: userId,
    preset: true,
  };

  if (user.now_playing_id) {
    presetWhereClause.id = { not: { equals: user.now_playing_id } };
  }

  return await prisma.song.findMany({
    where: presetWhereClause,
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

export async function markSongAsPlaying(userId: number, songId: number) {
  const user = await prisma.user.findFirst({
    where: { id: userId }
  });

  if (!user) {
    return;
  }

  if (user?.now_playing_id) {
    await prisma.song.update({
      where: {
        user_id: userId, id: user.now_playing_id },
        data: { played_at: new Date() }
    });
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { now_playing_id: songId }
  });
}

export async function markSongAsPlayed(userId: number, songId: number) {
  const updatedSong = prisma.song.update({
    where: { user_id: userId, id: songId },
    data: { played_at: new Date() }
  });

  return updatedSong;
}