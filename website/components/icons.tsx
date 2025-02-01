/* eslint-disable max-len */
import { IconSvgProps } from '@/types';
import * as React from 'react';

export const Logo: React.FC<IconSvgProps> = ({ size, width = 400, height = 50, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="32 1779.72 3936 441.28"
    className={props.className}
    height={size || height}
    width={size || width}
    version="1.1"
  >
    <path
      d="m2989 1970 24-30-50-139c-5-14-19-23-35-21-31 4-81 14-113 25-128 44-110 117-110 117l32 185-4 51h-3a74 74 0 0 1-57-120 93 93 0 0 0-68 90c0 29 20 51 49 64a223 223 0 0 0 111 10c41-3 76-11 76-11 42 2 70 30 70 30l-3-50s120-46 150-113c31-67-69-88-69-88zm-66-171c1-1 12-3 19 4a43908 43908 0 0 1 12 30v1l-10 2-27 8-10-41 16-4zm-43 12 10 40-30 8h-1l-10-39 31-9zm-80 25a198 198 0 0 1 22-8l31 116-31 9-30-114 8-3zm-71 72 5-14a104 104 0 0 1 28-34l34 99-23 7c-7-10-34-50-44-58zm77 243-10 1-8 1-25 3v-9l6-50-8-39-2-9-5-23-2-9-1-5-11-49 21 36 67-18s-28 41-20 79c0 0 13-68 78-97s71-63 71-63-30 25-75 15c0 0-10-13-6-27l77-20 11-4h1l22 67-123 126 2 65s-21 25-60 29zm185-92c-5 41-89 69-89 69l-5-70 43-41s57 2 51 42zM413 1875l-28-95H32l28 53v334l-28 53h180l-28-53v-119h114l45 26v-147l-45 26H184v-78zm277-95H509l28 54v333l-28 53h181l-28-53v-333zm276 268h34v77h-91v-250h91v45h124v-99l-40-41H824l-39 41v359l39 40h260l40-40v-195l17-32H938zm657-268h-181l28 53v120h-90v-120l28-53h-181l28 53v334l-28 53h181l-28-53v-119h90v119l-28 53h180l-28-53v-334zm499 95-28-95h-357l-28 95h144v292l-28 53h180l-28-53v-292zm285 44h157l-16-31v-67l-40-41h-260l-40 41v359l40 40h260l40-40v-67l16-32h-157l16 32v12h-90v-250h90v13zm1065 109-31-32 31-31v-144l-40-41h-327l28 53v334l-28 53h180l-28-53v-119h62l29 28v144h152l-28-53v-139zm-124-75h-91v-78h91v78zm391 95h125l45 26v-147l-45 26h-125v-78h229l-28-95h-353l28 53v334l-28 53h353l28-95h-229z"
      fill="#fff"
    ></path>
  </svg>
);

export const MoonFilledIcon = ({ size = 24, width, height, ...props }: IconSvgProps) => (
  <svg
    aria-hidden="true"
    focusable="false"
    height={size || height}
    viewBox="0 0 24 24"
    width={size || width}
    aria-label="Night mode"
    {...props}
  >
    <path
      d="M21.53 15.93c-.16-.27-.61-.69-1.73-.49a8.46 8.46 0 01-1.88.13 8.409 8.409 0 01-5.91-2.82 8.068 8.068 0 01-1.44-8.66c.44-1.01.13-1.54-.09-1.76s-.77-.55-1.83-.11a10.318 10.318 0 00-6.32 10.21 10.475 10.475 0 007.04 8.99 10 10 0 002.89.55c.16.01.32.02.48.02a10.5 10.5 0 008.47-4.27c.67-.93.49-1.519.32-1.79z"
      fill="currentColor"
    />
  </svg>
);

export const SunFilledIcon = ({ size = 24, width, height, ...props }: IconSvgProps) => (
  <svg
    aria-hidden="true"
    focusable="false"
    height={size || height}
    viewBox="0 0 24 24"
    width={size || width}
    {...props}
  >
    <g fill="currentColor">
      <path d="M19 12a7 7 0 11-7-7 7 7 0 017 7z" />
      <path d="M12 22.96a.969.969 0 01-1-.96v-.08a1 1 0 012 0 1.038 1.038 0 01-1 1.04zm7.14-2.82a1.024 1.024 0 01-.71-.29l-.13-.13a1 1 0 011.41-1.41l.13.13a1 1 0 010 1.41.984.984 0 01-.7.29zm-14.28 0a1.024 1.024 0 01-.71-.29 1 1 0 010-1.41l.13-.13a1 1 0 011.41 1.41l-.13.13a1 1 0 01-.7.29zM22 13h-.08a1 1 0 010-2 1.038 1.038 0 011.04 1 .969.969 0 01-.96 1zM2.08 13H2a1 1 0 010-2 1.038 1.038 0 011.04 1 .969.969 0 01-.96 1zm16.93-7.01a1.024 1.024 0 01-.71-.29 1 1 0 010-1.41l.13-.13a1 1 0 011.41 1.41l-.13.13a.984.984 0 01-.7.29zm-14.02 0a1.024 1.024 0 01-.71-.29l-.13-.14a1 1 0 011.41-1.41l.13.13a1 1 0 010 1.41.97.97 0 01-.7.3zM12 3.04a.969.969 0 01-1-.96V2a1 1 0 012 0 1.038 1.038 0 01-1 1.04z" />
    </g>
  </svg>
);

export const SearchIcon = (props: IconSvgProps) => (
  <svg aria-hidden="true" fill="none" focusable="false" height="1em" viewBox="0 0 24 24" width="1em" {...props}>
    <path
      d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    />
    <path d="M22 22L20 20" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
  </svg>
);
