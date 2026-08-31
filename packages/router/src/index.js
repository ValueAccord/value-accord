export function rankQuotes(quotes) {
  return [...quotes]
    .filter((q) => q.available && q.sourceAmount > 0)
    .sort((a, b) => a.sourceAmount - b.sourceAmount || b.reliability - a.reliability || a.etaMs - b.etaMs);
}

export function selectBestRoute(quotes) {
  const [best] = rankQuotes(quotes);
  if (!best) throw new Error("No viable route");
  return best;
}
