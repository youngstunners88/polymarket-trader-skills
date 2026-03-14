/**
 * Kelly Criterion Position Sizing
 * f* = (p * b - q) / b
 * Where: p = win probability, q = loss probability (1-p), b = win/loss ratio
 * 
 * For Polymarket: Edge-based Kelly
 * Position = Bankroll × Kelly% × Multiplier
 */

export function calculateKellyPosition(
  edgePct: number,
  bankroll: number,
  kellyMultiplier: number,
  maxPosition: number
): number {
  // Simplified Kelly for binary outcomes (Polymarket)
  // Kelly% ≈ Edge / (1 - FairPrice) - but using simplified version
  const odds = 1; // Binary outcomes pay ~1:1 after fees
  const kellyPct = edgePct / 100 / odds;
  
  // Apply fractional Kelly for safety
  const position = bankroll * kellyPct * kellyMultiplier;
  
  // Cap at max position
  return Math.min(position, maxPosition);
}

export function calculateEdge(marketPrice: number, trueProbability: number): number {
  // Edge = True Probability - Market Price (after fees adjustment)
  const feeAdjustment = 0.02; // 2% Polymarket fee estimate
  const adjustedMarketPrice = marketPrice * (1 + feeAdjustment);
  return (trueProbability - adjustedMarketPrice) * 100;
}
