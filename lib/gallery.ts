export type GalleryPack = { qty: number; price: number }

/**
 * Cheapest way to buy `count` frames given a single price and discounted
 * packs — classic min-cost coin change over [1×single, ...packs].
 */
export function computeTotal(count: number, singlePrice: number, packs: GalleryPack[]): number {
  if (count <= 0) return 0
  const options: Array<[number, number]> = [
    [1, singlePrice],
    ...packs
      .filter((p) => p && p.qty >= 1 && p.price > 0)
      .map((p) => [p.qty, p.price] as [number, number]),
  ]
  const dp: number[] = [0]
  for (let i = 1; i <= count; i++) {
    let best = Infinity
    for (const [qty, price] of options) {
      if (i >= qty && dp[i - qty] + price < best) best = dp[i - qty] + price
    }
    dp[i] = best
  }
  return dp[count]
}

export function computeSavings(count: number, singlePrice: number, packs: GalleryPack[]): number {
  return count * singlePrice - computeTotal(count, singlePrice, packs)
}
