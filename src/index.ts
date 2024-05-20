import { Hono } from "hono";

const app = new Hono();

app.get("/", (c) => {
  return c.text("Hello Hono2");
});

app.get("/gmgnai/sol", async (c) => {
  let res = await fetch(
    "https://gmgn.ai/defi/quotation/v1/rank/sol/swaps/1h?orderby=swaps&direction=desc&limit=20",
  );
  let json = await res.json();
  let coins = [];

  json.data.rank.map((coin) => {
    if (coin.hot_level !== 3) {
      return;
    }

    if (
      coin.launchpad == "Pump.fun" &&
      Math.round(new Date().getTime() / 1000 - 60 * 60 * 1) <
        coin.pool_creation_timestamp
    ) {
      coins.push(coin);
      return;
    }
    if (
      coin.launchpad !== "Pump.fun" &&
      Math.round(new Date().getTime() / 1000 - 60 * 60 * 0.5) <
        coin.pool_creation_timestamp
    ) {
      coins.push(coin);
      return;
    }
  });
  return c.json({ coins, osize: json.data.rank.length });
});

app.get("/gmgnai/sol-test", async (c) => {
  let res = await fetch(
    "https://gmgn.ai/defi/quotation/v1/rank/sol/swaps/1h?orderby=swaps&direction=desc&limit=20",
  );
  let json = await res.json();
  let coins = [];

  json.data.rank.map((coin) => {
    if (coin.launchpad !== "Pump.fun") {
      return;
    }

    if (coin.hot_level !== 2) {
      return;
    }

    if (
      Math.round(new Date().getTime() / 1000 - 60 * 60 * 2) >
      coin.pool_creation_timestamp
    ) {
      return;
    }

    coins.push(coin);
  });
  return c.json({ coins });
});

export default app;
