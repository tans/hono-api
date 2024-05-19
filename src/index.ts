import { Hono } from "hono";

const app = new Hono();

app.get("/", (c) => {
  return c.text("Hello Hono2");
});

app.get("/gmgnai/sol", async (c) => {
  let res = await fetch(
    "https://gmgn.ai/defi/quotation/v1/rank/sol/swaps/6h?orderby=swaps&direction=desc&limit=20",
  );
  let json = await res.json();
  let coins = [];

  json.data.rank.map((coin) => {
    if (coin.launchpad !== "Pump.fun") {
      return;
    }

    if (coin.hot_level !== 3) {
      return;
    }

    if (
      Math.round(new Date().getTime() / 1000 - 60 * 60 * 1) >
      coin.pool_creation_timestamp
    ) {
      return;
    }

    coins.push(coin);
  });
  return c.json({ coins });
});
export default app;
