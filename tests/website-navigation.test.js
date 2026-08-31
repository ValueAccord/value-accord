import test from "node:test";
import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import path from "node:path";

const websiteRoot = path.resolve("apps/website");
const navigationSources = [
  "app/page.tsx",
  "app/protocol/page.tsx",
  "app/join/page.tsx",
  "components/site-chrome.tsx",
];

test("every internal website link targets an existing route", async () => {
  const sources = await Promise.all(
    navigationSources.map((file) => readFile(path.join(websiteRoot, file), "utf8")),
  );
  const hrefs = sources.flatMap((source) =>
    [...source.matchAll(/href="(\/[^"#?]*)"/g)].map((match) => match[1]),
  );

  assert.ok(hrefs.length > 0, "expected at least one internal navigation link");

  for (const href of new Set(hrefs)) {
    const routeFile =
      href === "/"
        ? path.join(websiteRoot, "app/page.tsx")
        : path.join(websiteRoot, "app", href.slice(1), "page.tsx");
    await assert.doesNotReject(
      access(routeFile),
      `internal link ${href} must resolve to an app route`,
    );
  }
});

test("hosted navigation uses full document links", async () => {
  const sources = await Promise.all(
    navigationSources.map((file) => readFile(path.join(websiteRoot, file), "utf8")),
  );

  for (const source of sources) {
    assert.doesNotMatch(
      source,
      /from ["']next\/link["']/,
      "Vinext-hosted routes must avoid the client Link transition regression",
    );
  }
});
