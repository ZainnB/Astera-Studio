import { account } from '../data/account'
import './Avatar.css'

// Vite feature: import.meta.glob finds files matching a pattern at build time.
// If a photo named avatar.jpg / .png / .webp exists in src/assets, it's
// bundled and used; if not, this is simply empty and we show initials.
// So dropping the client's photo in is enough; no code change, no broken build.
const photos = import.meta.glob('../assets/avatar.{jpg,jpeg,png,webp}', { eager: true, import: 'default' }) as Record<string, string>
const photo = Object.values(photos)[0]

const initials = account.name
  .split(' ')
  .map((part) => part[0])
  .join('')
  .slice(0, 2)

export default function Avatar({ size = 32 }: { size?: number }) {
  return (
    <span className="avatar" style={{ width: size, height: size, fontSize: size * 0.38 }}>
      {photo ? <img src={photo} alt="" /> : initials}
    </span>
  )
}
