const common = { fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round" };

export function IconFunnel(props) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" {...common} {...props}>
      <path d="M4 5h16l-6 8v5l-4 2v-7L4 5z" />
    </svg>
  );
}

export function IconShield(props) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" {...common} {...props}>
      <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

export function IconTarget(props) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" {...common} {...props}>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="12" cy="12" r="0.6" fill="currentColor" />
    </svg>
  );
}

export function IconSpinner(props) {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" className="spin" {...props}>
      <circle
        cx="12"
        cy="12"
        r="9"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeDasharray="42 100"
      />
    </svg>
  );
}

export function IconCheck(props) {
  return (
    <svg viewBox="0 0 24 24" width="13" height="13" {...common} strokeWidth={2.4} {...props}>
      <path d="M4 12l5 5L20 6" />
    </svg>
  );
}

export function IconCross(props) {
  return (
    <svg viewBox="0 0 24 24" width="13" height="13" {...common} strokeWidth={2.4} {...props}>
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

export function IconPulse(props) {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" {...common} {...props}>
      <path d="M3 12h4l2 7 4-14 2 7h6" />
    </svg>
  );
}
