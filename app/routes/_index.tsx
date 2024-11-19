import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "Your Party Animal 2" },
    { name: "description", content: "Your Party Animal Remake" },
  ];
};

export default function Index() {
  return (
    <div>Your Party Animal 2</div>
  );
}
