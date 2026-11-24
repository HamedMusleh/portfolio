/**
 * In-page sections shown in the header navigation. `id` must match a section's id;
 * `index` is the mono number shown before the label (and in each section heading).
 */
export const NAV_LINKS = [
  { id: 'about', label: 'About', index: '01' },
  { id: 'projects', label: 'Projects', index: '02' },
  { id: 'experience', label: 'Experience', index: '03' },
  { id: 'skills', label: 'Skills', index: '04' },
  { id: 'contact', label: 'Contact', index: '05' },
] as const;
