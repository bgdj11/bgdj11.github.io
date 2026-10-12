import type { ProjectArt } from '../data/portfolio'

export function UniverseArtwork() {
  return (
    <div className="universe-art" aria-hidden="true">
      <span className="art-coordinate">FIG. 01 / A WORLD OF POSSIBILITIES</span>
      <svg viewBox="0 0 400 400" className="planet-illustration">
        <defs>
          <pattern id="planet-grid" width="5" height="5" patternUnits="userSpaceOnUse"><rect width="1" height="1" fill="#0b1020" opacity=".32" /></pattern>
          <clipPath id="planet-clip"><path d="M170 100h60v10h30v10h20v20h10v20h10v70h-10v20h-10v20h-20v10h-30v10h-60v-10h-30v-10h-20v-20h-10v-20h-10v-70h10v-20h10v-20h20v-10h30z" /></clipPath>
        </defs>
        <g fill="#ffd478" shapeRendering="crispEdges"><path d="M56 100h4v4h-4zm268-28h4v4h-4zM88 292h4v4h-4zm248-36h4v4h-4zM268 328h4v4h-4zM144 56h4v4h-4zM36 212h4v4h-4z" /><path d="M320 124h4v12h-4zm-4 4h12v4h-12zM72 236h4v12h-4zm-4 4h12v4H68z" /></g>
        <path d="M48 252v-16h8v-16h16v-16h16v-16h24v-16h24v-16h24v-16h32v-16h32v-8h32v-8h32v-8h32v-4h24v4h12v12" fill="none" stroke="#9271c7" strokeWidth="3" strokeDasharray="4 8" />
        <g clipPath="url(#planet-clip)" shapeRendering="crispEdges">
          <path fill="#9683f4" d="M95 95h210v200H95z" />
          <path fill="#6555c8" d="M110 138h40v-15h50v15h35v20h-20v20h-45v20h-45v20H95V138zm155-10h50v155H160v-20h40v-20h35v-30h30z" />
          <path fill="#439ac9" d="M125 100h25v25h-15v20h-20v35H95v-80zm70 80h35v15h25v30h-20v20h-40v20h-35v15h-50v-35h30v-30h25v-15h30z" />
          <path fill="#342762" d="M285 115h30v180H155v-10h55v-20h35v-25h20v-30h10v-60h10z" />
          <path fill="#83e1eb" d="M150 110h25v10h-25zm-20 35h15v10h-15zm90-25h20v10h-20zm-45 40h15v10h-15zm70 35h10v15h-10zm-95 70h15v10h-15z" />
          <path fill="url(#planet-grid)" d="M90 90h220v210H90z" />
        </g>
        <path d="M48 252v12h12v8h32v-4h32v-8h32v-12h28v-12h28v-16h24v-16h24v-16h24v-16h20v-16h16v-16h16v-16h12v-12h8V96" fill="none" stroke="#ffcf71" strokeWidth="4" shapeRendering="crispEdges" />
        <path d="M56 264v12h36v-4h32v-8h32v-12h28v-12h28v-16h24v-16h24v-16h24v-16h20v-16h16v-16h16v-16h12" fill="none" stroke="#b87975" strokeWidth="2" shapeRendering="crispEdges" />
        <path d="M312 69h20v5h5v20h-5v5h-20v-5h-5V74h5z" fill="#ffbb83" shapeRendering="crispEdges" />
        <path d="M327 74h10v20h-5v5h-20v-5h10v-5h5z" fill="#b5657c" shapeRendering="crispEdges" />
        <path d="M80 312h8v8h-8z" fill="#bc9afa" />
        <path d="M200 336v16m-8-8h16" stroke="#a289d2" strokeWidth="2" shapeRendering="crispEdges" />
      </svg>
      <div className="art-caption"><span className="tiny-square" /> Somewhere between logic & imagination</div>
    </div>
  )
}

export function ProjectArtwork({ art, small = false }: { art: ProjectArt; small?: boolean }) {
  return <div className={`project-art project-art-${art}${small ? ' project-art-small' : ''}`} aria-hidden="true"><div className="art-grid" /><div className="art-element art-element-one" /><div className="art-element art-element-two" /><div className="art-element art-element-three" />{!small && <span className="preview-label">CONCEPT PREVIEW</span>}</div>
}
