import { siteConfig } from '@/site.config'

/**
 * Runs before first paint. Decides whether the opening sequence plays:
 * first visit in this browser session, and motion allowed. Everything after
 * that is CSS, so the sequence starts with the first frame instead of waiting
 * for hydration, and it can never get stuck if JavaScript fails later.
 * The attribute is removed once the sequence and hero entrance have finished,
 * so client-side navigations never replay it.
 */
export const introScript = `(function(){var d=document.documentElement;d.classList.add('js');try{if(matchMedia('(prefers-reduced-motion: reduce)').matches||sessionStorage.getItem('intro-seen'))return;sessionStorage.setItem('intro-seen','1');d.setAttribute('data-intro','');setTimeout(function(){d.removeAttribute('data-intro')},2600)}catch(e){}})()`

/**
 * About one second on first visit: the wordmark draws in stroke by stroke,
 * fills, then the page wipes open into the hero. Hidden unless the script
 * above sets `data-intro`, so repeat views and reduced motion never see it.
 */
export function OpeningSequence() {
  return (
    <div className="intro" aria-hidden>
      <svg className="intro-mark" viewBox="0 0 640 180" role="presentation">
        <defs>
          <linearGradient id="intro-stroke" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor="var(--brand-from)" />
            <stop offset="1" stopColor="var(--brand-to)" />
          </linearGradient>
        </defs>
        <text x="50%" y="62%" textAnchor="middle" className="intro-text">
          {siteConfig.brand.wordmark}
        </text>
      </svg>
      <span className="intro-line" />
    </div>
  )
}
