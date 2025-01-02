import { Button, Checkbox, FormControlLabel, InputLabel, Stack, TextField } from "@mui/material";
import { json, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useCallback, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { prisma } from "~/prisma.server";

export async function loader({ params }: LoaderFunctionArgs) {
  const idNum = parseInt(params.userId || "0");
  const user = await prisma.user.findUnique({ where: { id: idNum } });
  if (user == null) {
    throw new Response("User not found.", { status: 404 });
  }
  return json({ user });
}

interface SettingsInputs {
  promotionEnabled: boolean;
  promotionScore: number;
  removalEnabled: boolean;
  removalScore: number;
}

export default function PartySettings() {
  const [submitting, setSubmitting] = useState(false);
  const { user } = useLoaderData<typeof loader>();
  const {
    register,
    trigger,
    formState: { errors },
  } = useForm<SettingsInputs>()

  const validate = useCallback(async (e: React.BaseSyntheticEvent) => {
    setSubmitting(true);
    const valid = await trigger();
    if (!valid) {
      e.preventDefault();
      setSubmitting(false);
    }
  }, [trigger]);

  return (
    <>
      <h1>Settings for {user.name}'s party</h1>

      <form method="POST" onSubmit={validate}>
        <Stack direction="column">
          <FormControlLabel
            control={<Checkbox />}
            label="Enable song promotion by voting"
          />
          <TextField
            {...register("promotionScore", {required: true, min: 1})}
            type="number"
            label="Promotion Score"
            error={!!errors.promotionScore}
            helperText={errors.promotionScore && "Promotion score must be greater than 0."} />
          <p>When song promotion is active, this is the score increment required for a song to be promoted one place ahead in the queue. The negative of this value will cause a song to be demoted one place back.</p>
          <FormControlLabel
            control={<Checkbox />}
            label="Enable song removal by voting"
          />
          <TextField
            {...register("removalScore", {required: true, max: -1})}
            type="number"
            label="Removal Score"
            error={!!errors.removalScore}
            helperText={errors.removalScore && "Removal score must be less than 0."} />
          <p>When song removal is active and a song reaches a score of this value or below, it is removed from the queue.</p>
          <Button type="submit">Save Settings</Button>
        </Stack>
      </form>
    </>
  );
}