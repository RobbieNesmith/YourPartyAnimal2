import { Button, Stack } from "@mui/material";

export function ListClearer({userId, destination}: {userId: number, destination: "preset" | "queue"}) {
  if (destination === "preset") {
    return (
      <Stack direction="row">
        <form
          method="POST"
          action={`/party/${userId}/${destination}/clear`}
          style={{ flexGrow: 1 }}
          >
          <input type="hidden" name="clearPlayed" value="true" />
          <Button type="submit" fullWidth={true} className="section action">Clear Preset Songs</Button>
        </form>
      </Stack>
    );
  } else {
    return (
      <Stack direction="row">
        <form
          method="POST"
          action={`/party/${userId}/${destination}/clear`}
          style={{ flexGrow: 1 }}
        >
          <Button type="submit" fullWidth={true} className="section action">Clear Unplayed</Button>
        </form>
        <form
          method="POST"
          action={`/party/${userId}/${destination}/clear`}
          style={{ flexGrow: 1 }}
        >
          <input type="hidden" name="clearPlayed" value="true" />
          <Button type="submit" fullWidth={true} className="section action">Clear All Queue</Button>
        </form>
      </Stack>
    )
  }
}