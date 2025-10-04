import { Button, Stack } from "@mui/material";
import { useParams } from "@remix-run/react";
import { AppError } from "~/models/AppError";

export default function errorDisplay({error}: {error: AppError}) {
  const { userId } = useParams();
  return (
    <Stack sx={{ height: "100%" }}>
      <header className="section main">
        <h1>
          {error.title}
        </h1>
      </header>
      <div className="section" style={{ flexGrow: 1 }}>
        <p>{error.message}</p>
      </div>
      <Button className="section action" href={`/party/${userId}`}>Back to the Party</Button>
    </Stack>
  );
}