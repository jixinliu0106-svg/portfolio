import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the portfolio landing page", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<html lang="zh-CN">/i);
  assert.match(html, /<title>Rocky Liu — Visual Designer<\/title>/i);
  assert.match(html, /精选项目 \/ Selected Work/);
  assert.match(html, /id="work"/);
  assert.match(html, /Camel Crown - 东南亚/);
  assert.match(html, /接受合作项目/);
  assert.doesNotMatch(html, /Your site is taking shape|Building your site/);
});

test("keeps portfolio navigation and media accessible", async () => {
  const [page, css, layout] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
  ]);

  assert.match(page, /<button className="align-right hero-scroll"/);
  assert.doesNotMatch(page, /<section[^>]*\bonClick=/);
  assert.match(page, /<video[^>]*\bcontrols\b[^>]*\bmuted\b/);
  assert.match(css, /\.hero-scroll:focus-visible/);
  assert.match(layout, /export const metadata:\s*Metadata/);
  assert.match(layout, /title:\s*"Rocky Liu — Visual Designer"/);
  assert.match(layout, /<html lang="zh-CN">/);
});
