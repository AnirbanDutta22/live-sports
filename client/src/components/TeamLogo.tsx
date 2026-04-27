import { getTeamColor, getTeamInitials } from '../utils';

interface TeamLogoProps {
  name: string;
  logoUrl?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const sizeMap = {
  sm: { outer: 'w-8 h-8', text: 'text-xs' },
  md: { outer: 'w-10 h-10', text: 'text-sm' },
  lg: { outer: 'w-12 h-12', text: 'text-base' },
  xl: { outer: 'w-16 h-16', text: 'text-lg' },
};

export function TeamLogo({ name, logoUrl, size = 'md' }: TeamLogoProps) {
  const { outer, text } = sizeMap[size];
  const color = getTeamColor(name);
  const initials = getTeamInitials(name);

  if (logoUrl) {
    return (
      <img
        src={logoUrl}
        alt={name}
        className={`${outer} rounded-full object-cover`}
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = 'none';
        }}
      />
    );
  }

  return (
    <div
      className={`${outer} rounded-full flex items-center justify-center font-display font-bold ${text} flex-shrink-0`}
      style={{
        backgroundColor: `${color}22`,
        border: `1.5px solid ${color}55`,
        color,
      }}
    >
      {initials}
    </div>
  );
}
