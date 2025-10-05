import { Button, Checkbox, FormControlLabel, Stack, TextField } from "@mui/material";
import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { redirect, typedjson, useTypedLoaderData } from "remix-typedjson";
import { bool, boolean, number, object } from "yup";
import { prisma } from "~/prisma.server";
import { secretSession } from "~/services/AuthService.server";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const idNum = parseInt(params.userId || "0");

  let session = await secretSession.getSession(request.headers.get("cookie"));
  let loggedInUser = session.get("user");

  if (!loggedInUser) {
    return redirect("/login");
  }

  const user = await prisma.user.findUnique({ where: { id: idNum } });
  if (user == null) {
    throw new Response("User not found.", { status: 404 });
  }
  return typedjson({ user });
}

function validateSettings(formData: FormData) {
  const settingsSchema = object({
    promotionEnabled: boolean().required(),
    promotionScore: number().required().moreThan(0).integer(),
    removalEnabled: bool().required(),
    removalScore: number().required().lessThan(0).integer(),
    rateLimit: number().required().moreThan(-1).integer(),
    stopRequests: bool().required(),
  });

  const settingsObject = {} as {[key: string]: FormDataEntryValue | null};

  settingsObject["promotionEnabled"] = formData.get("promotionEnabled") ? "true" : "false";
  settingsObject["promotionScore"] = formData.get("promotionScore");
  settingsObject["removalEnabled"] = formData.get("removalEnabled") ? "true" : "false";
  settingsObject["removalScore"] = formData.get("removalScore");
  settingsObject["rateLimit"] = formData.get("rateLimit");
  settingsObject["stopRequests"] = formData.get("stopRequests") ? "true" : "false";

  return settingsSchema.cast(settingsObject);
}

export async function action({ params, request }: ActionFunctionArgs) {
  const idNum = parseInt(params.userId || "0");
  const formData = await request.formData();
  try {
    const settings = await validateSettings(formData);
    const user = await prisma.user.findUnique({ where: { id: idNum } });
    if (user == null) {
      throw new Response("User not found.", { status: 404 });
    }

    const newUser = await prisma.user.update({
      where: {id: idNum},
      data: {
        promotion_enabled: settings.promotionEnabled,
        promotion_value: settings.promotionScore,
        removal_enabled: settings.removalEnabled,
        removal_value: settings.removalScore,
        rate_limit: settings.rateLimit,
        stop_requests: settings.stopRequests,
      }
    });

    return { user: newUser };
  } catch (exception) {
    throw new Response(`Invalid Request!:\n${exception}`, { status: 400 });
  }
}

interface SettingsInputs {
  promotionEnabled: boolean;
  promotionScore: number;
  removalEnabled: boolean;
  removalScore: number;
  rateLimit: number;
  stopRequests: boolean;
}

export default function PartySettings() {
  const [submitting, setSubmitting] = useState(false);
  const { user } = useTypedLoaderData<typeof loader>();
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
      <h1>Settings for {user.name}&apos;s party</h1>

      <form method="POST" onSubmit={validate}>
        <Stack direction="column">
          <FormControlLabel
            control={
              <Checkbox
                name="promotionEnabled"
                defaultChecked={user.promotion_enabled}
              />
            }
            label="Enable song promotion by voting"
          />
          <TextField
            {...register("promotionScore", {required: true, min: 1})}
            defaultValue={user.promotion_value}
            type="number"
            label="Promotion Score"
            error={!!errors.promotionScore}
            helperText={errors.promotionScore && "Promotion score must be greater than 0."} />
          <p>When song promotion is active, this is the score increment required for a song to be promoted one place ahead in the queue. The negative of this value will cause a song to be demoted one place back.</p>
          <FormControlLabel
            control={
              <Checkbox
                name="removalEnabled"
                defaultChecked={user.removal_enabled}
              />
            }
            label="Enable song removal by voting"
          />
          <TextField
            {...register("removalScore", {required: true, max: -1})}
            defaultValue={user.removal_value}
            type="number"
            label="Removal Score"
            error={!!errors.removalScore}
            helperText={errors.removalScore && "Removal score must be less than 0."} />
          <p>When song removal is active and a song reaches a score of this value or below, it is removed from the queue.</p>
          <TextField
            {...register("rateLimit", { required: true, min: 0 })}
            defaultValue={user.rate_limit}
            type="number"
            label="Rate Limit (minutes)"
            error={!!errors.rateLimit}
            helperText={errors.rateLimit && "Rate limit must be at least 0."} />
            <p>When rate limit is not zero, this is how many minutes guests must wait to add successive songs.</p>
          <FormControlLabel
            control={
              <Checkbox
                name="stopRequests"
                defaultChecked={user.stop_requests}
              />
            }
            label="Prevent songs from being requested"
          />
          <Button disabled={submitting} type="submit">Save Settings</Button>
        </Stack>
      </form>
    </>
  );
}