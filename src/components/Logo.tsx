import scoutLogo from '../assets/scout_logo.png';

export function Logo() {
  return (
    <img
      src={scoutLogo}
      alt="Scout Logo"
      className="max-h-full w-auto object-contain"
    />
  );
}
