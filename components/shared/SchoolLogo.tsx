"use client";

type SchoolLogoProps = {
  src: string;
  alt: string;
  className?: string;
};

export default function SchoolLogo({ src, alt, className }: SchoolLogoProps) {
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={(event) => {
        (event.target as HTMLImageElement).style.display = "none";
      }}
    />
  );
}
