import type { ReactNode, SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

function createIcon(path: ReactNode) {
  return function Icon(props: IconProps) {
    return (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        {...props}
      >
        {path}
      </svg>
    );
  };
}

export const MenuIcon = createIcon(<path d="M4 7h16M4 12h16M4 17h16" />);
export const SearchIcon = createIcon(<circle cx="11" cy="11" r="6" />);
export const SearchHandleIcon = createIcon(<path d="m20 20-4.35-4.35" />);
export const FilterIcon = createIcon(
  <>
    <path d="M4 7h16" />
    <path d="M7 12h10" />
    <path d="M10 17h4" />
  </>,
);
export const CartIcon = createIcon(
  <>
    <path d="M6 6h15l-1.4 7.2a2 2 0 0 1-2 1.6H9.2a2 2 0 0 1-2-1.6L5 4H3" />
    <circle cx="9" cy="19" r="1.2" />
    <circle cx="18" cy="19" r="1.2" />
  </>,
);
export const StarIcon = createIcon(
  <path d="m12 3 2.7 5.5 6 .9-4.3 4.2 1 6-5.4-2.9-5.4 2.9 1-6L3.3 9.4l6-.9L12 3Z" />,
);
export const HeartIcon = createIcon(
  <path d="M12 20.7s-7-4.6-9.2-8.3A5.4 5.4 0 0 1 12 5.8a5.4 5.4 0 0 1 9.2 6.6c-2.2 3.7-9.2 8.3-9.2 8.3Z" />,
);
export const DownloadIcon = createIcon(
  <>
    <path d="M12 4v10" />
    <path d="m8.5 10.5 3.5 3.5 3.5-3.5" />
    <path d="M5 19h14" />
  </>,
);
export const ChevronLeftIcon = createIcon(<path d="m15 18-6-6 6-6" />);
export const ChevronRightIcon = createIcon(<path d="m9 18 6-6-6-6" />);
export const BellIcon = createIcon(
  <>
    <path d="M6 17h12" />
    <path d="M8 17V10a4 4 0 1 1 8 0v7" />
    <path d="M10 20a2 2 0 0 0 4 0" />
  </>,
);
export const DashboardIcon = createIcon(
  <>
    <rect x="4" y="4" width="7" height="7" rx="1.5" />
    <rect x="13" y="4" width="7" height="11" rx="1.5" />
    <rect x="4" y="13" width="7" height="7" rx="1.5" />
    <rect x="13" y="17" width="7" height="3" rx="1.5" />
  </>,
);
export const PackageIcon = createIcon(
  <>
    <path d="m12 3 8 4.5v9L12 21 4 16.5v-9L12 3Z" />
    <path d="m4 7.5 8 4.5 8-4.5" />
    <path d="M12 12v9" />
  </>,
);
export const PaletteIcon = createIcon(
  <>
    <path d="M12 3a9 9 0 1 0 0 18h1.2a2.3 2.3 0 0 0 0-4.6H12a2 2 0 0 1 0-4h5a4 4 0 0 0 4-4 5.5 5.5 0 0 0-5.5-5.4H12Z" />
    <circle cx="7.5" cy="10" r="1" />
    <circle cx="9.5" cy="7" r="1" />
    <circle cx="14.5" cy="7" r="1" />
  </>,
);
export const SettingsIcon = createIcon(
  <>
    <path d="M12 8.5a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7Z" />
    <path d="m19.4 15 .6 1-1.8 3.1-1.2-.2a7.9 7.9 0 0 1-1.3.7L15 21h-6l-.7-1.4a7.9 7.9 0 0 1-1.3-.7l-1.2.2L4 16l.6-1a8.6 8.6 0 0 1 0-2l-.6-1L5.8 9l1.2.2a7.9 7.9 0 0 1 1.3-.7L9 7h6l.7 1.5a7.9 7.9 0 0 1 1.3.7l1.2-.2 1.8 3.1-.6 1a8.6 8.6 0 0 1 0 1.9Z" />
  </>,
);
export const LogoutIcon = createIcon(
  <>
    <path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3" />
    <path d="M10 17 15 12 10 7" />
    <path d="M15 12H4" />
  </>,
);
export const HomeIcon = createIcon(
  <>
    <path d="M4 10.5 12 4l8 6.5V20H4v-9.5Z" />
    <path d="M9 20v-5h6v5" />
  </>,
);
export const LibraryIcon = createIcon(
  <>
    <path d="M4 5h4v15H4zM10 5h4v15h-4zM16 5h4v15h-4z" />
  </>,
);
export const UserIcon = createIcon(
  <>
    <circle cx="12" cy="8" r="3.4" />
    <path d="M5.5 20a6.5 6.5 0 0 1 13 0" />
  </>,
);
export const PlayIcon = createIcon(
  <path d="m9 7 8 5-8 5V7Z" fill="currentColor" stroke="none" />,
);
export const ArrowRightIcon = createIcon(<path d="M5 12h14M13 6l6 6-6 6" />);
export const PlusIcon = createIcon(
  <>
    <path d="M12 5v14" />
    <path d="M5 12h14" />
  </>,
);
export const TrashIcon = createIcon(
  <>
    <path d="M4 7h16" />
    <path d="M9 7V5h6v2" />
    <path d="M7 7l1 12h8l1-12" />
  </>,
);
export const GlobeIcon = createIcon(
  <>
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18" />
    <path d="M12 3a14.2 14.2 0 0 1 0 18" />
    <path d="M12 3a14.2 14.2 0 0 0 0 18" />
  </>,
);
export const LockIcon = createIcon(
  <>
    <rect x="5" y="10" width="14" height="10" rx="2" />
    <path d="M8 10V7.5a4 4 0 1 1 8 0V10" />
  </>,
);
export const CheckIcon = createIcon(<path d="m5 13 4 4L19 7" />);
