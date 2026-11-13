/**
 * Subtle animated film grain over the whole site. A small tiling noise
 * texture shifts a few pixels in steps, which reads as grain without
 * repainting anything: only the layer's transform changes. Static for
 * reduced motion.
 */
export function FilmGrain() {
  return <div aria-hidden className="film-grain" />
}
