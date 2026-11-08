/// <reference types="vite/client" />



declare module '*.jpg' {
  const src: string;
  export default src;
}

declare module '*.jpeg' {
  const src: string;
  export default src;
}

declare module '*.png' {
  const src: string;
  export default src;
}

declare module '*.webp' {
  const src: string;
  export default src;
}

declare module '*.svg' {
  import * as React from 'react';
  const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  export { ReactComponent };
  export default ReactComponent;
}

// ─────────────────────────────────────────────
// Optional: custom env variables (add if you use VITE_ vars)
// ─────────────────────────────────────────────
// interface ImportMetaEnv {
//   readonly VITE_API_URL: string;
//   // add more VITE_ variables here if needed
// }
