import type { Region } from './types'

// Made-up company: monthly revenue vs target per region, in $ thousands.
// Written out by hand (not random) so the story is fixed and repeatable:
// in Q3 2026 (Jul–Sep), South and West missed target; the rest beat it.
// That gives the brief's example question a clear answer.

export const regions: Region[] = ['North', 'South', 'East', 'West', 'Central']

export const months = [
  'Oct 25', 'Nov 25', 'Dec 25', 'Jan 26', 'Feb 26', 'Mar 26',
  'Apr 26', 'May 26', 'Jun 26', 'Jul 26', 'Aug 26', 'Sep 26',
]

export const revenue: Record<Region, number[]> = {
  North:   [360, 372, 410, 330, 342, 365, 371, 385, 392, 432, 418, 445],
  South:   [298, 305, 342, 280, 291, 300, 310, 322, 318, 301, 294, 309],
  East:    [420, 431, 476, 398, 405, 422, 440, 452, 461, 488, 495, 502],
  West:    [265, 270, 301, 250, 258, 266, 272, 280, 276, 262, 270, 268],
  Central: [190, 196, 215, 182, 188, 194, 201, 205, 210, 221, 218, 226],
}

export const target: Record<Region, number[]> = {
  North:   [350, 350, 400, 340, 340, 350, 360, 360, 370, 410, 410, 420],
  South:   [290, 290, 330, 290, 290, 300, 310, 310, 320, 330, 330, 340],
  East:    [410, 410, 460, 400, 400, 420, 430, 430, 450, 470, 470, 480],
  West:    [260, 260, 290, 255, 255, 265, 270, 270, 280, 290, 290, 300],
  Central: [185, 185, 210, 185, 185, 190, 195, 195, 205, 215, 215, 220],
}

/** Average order value per region, in dollars. Used to derive order counts. */
export const avgOrderValue: Record<Region, number> = {
  North: 88,
  South: 74,
  East: 95,
  West: 81,
  Central: 69,
}

export const categories = ['Electronics', 'Home', 'Apparel', 'Grocery']

/** Share of each region's revenue by category (each row adds up to 100). */
export const categoryMix: Record<Region, number[]> = {
  North:   [38, 24, 20, 18],
  South:   [27, 22, 26, 25],
  East:    [42, 25, 18, 15],
  West:    [30, 28, 24, 18],
  Central: [22, 20, 21, 37],
}
