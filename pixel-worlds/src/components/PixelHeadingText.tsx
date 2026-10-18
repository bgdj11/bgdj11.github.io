/** Keep the real, selectable accented text; CSS corrects the pixel font's short É. */
export function PixelHeadingText({ children }: { children: string }) {
  return <>{children.split(/(É)/).map((part, index) => part === 'É'
    ? <span key={index} className="pixel-capital-e">{part}</span>
    : part)}</>
}
