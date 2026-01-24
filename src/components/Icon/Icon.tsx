type IconProps = {
  name: string;
  width?: number;
  height?: number;
  className?: string;
};

export default function Icon({ name, width = 24, height = 24, className }: IconProps) {
  const href = `/sprite.svg?v=7#icon-${name}`; 
  return (
    <svg width={width} height={height} className={className} aria-hidden="true">
      <use href={href} xlinkHref={href} />
    </svg>
  );
}
