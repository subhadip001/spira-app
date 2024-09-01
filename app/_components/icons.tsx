import { LucideProps } from "lucide-react";

export const Icons = {
  logo: ({ ...props }: LucideProps) => (
    <svg
      width="40"
      height="40"
      viewBox="0 0 45 45"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M45 22.5C45 34.9264 34.9264 45 22.5 45C10.0736 45 0 34.9264 0 22.5C0 10.0736 10.0736 0 22.5 0C34.9264 0 45 10.0736 45 22.5ZM4.87945 22.5C4.87945 32.2316 12.7684 40.1205 22.5 40.1205C32.2316 40.1205 40.1205 32.2316 40.1205 22.5C40.1205 12.7684 32.2316 4.87945 22.5 4.87945C12.7684 4.87945 4.87945 12.7684 4.87945 22.5Z"
        fill="url(#paint0_radial_2_3)"
      />
      <defs>
        <radialGradient
          id="paint0_radial_2_3"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(22.5 22.5) rotate(90) scale(22.5)"
        >
          <stop offset="0.617171" stop-color="#9E00FF" />
          <stop offset="0.824261" stop-color="#4A67FF" />
          <stop offset="0.887244" stop-color="#5EB2FF" />
          <stop offset="0.934871" stop-color="#73DDFE" />
          <stop offset="1" stop-color="white" />
        </radialGradient>
      </defs>
    </svg>
  ),
};
