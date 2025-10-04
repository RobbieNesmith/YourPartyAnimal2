import { Song } from "@prisma/client";
import { computeNowPlayingOrder } from "~/services/QueueService";

test("Positive voting decreases index", () => {
  const song: Song = {
    name: "Test Song Oh So Good",
    id: 12345,
    user_id: 1,
    video_id: "n1ceOne",
    rating: 9,
    requested_at: new Date("2025-01-01T12:00"),
    played_at: null,
    preset: false,
    requested_by: "this-should-be-a-guid",
  }
  const songWithIndex = computeNowPlayingOrder(song, 4, 7);
  expect(songWithIndex.index).toBe(2.5);
});

test("Negative voting increases index", () => {
  const song: Song = {
    name: "Test Song Oh So Good",
    id: 12345,
    user_id: 1,
    video_id: "n1ceOne",
    rating: -9,
    requested_at: new Date("2025-01-01T12:00"),
    played_at: null,
    preset: false,
    requested_by: "this-should-be-a-guid",
  }
  const songWithIndex = computeNowPlayingOrder(song, 4, 7);
  expect(songWithIndex.index).toBe(5.5);
});