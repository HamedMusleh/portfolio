/**
 * Content model for the portfolio.
 *
 * Every piece of text on the site is described by one of these interfaces and
 * lives in `portfolio.data.ts`. Components only read this data, so editing
 * content never requires touching a component.
 */

/** Filter categories shown above the project grid. Add a value here to add a filter. */
export const PROJECT_TAGS = ['AI', 'Frontend', 'Backend', 'Hardware', 'Mobile'] as const;
export type ProjectTag = (typeof PROJECT_TAGS)[number];

export interface ExternalLink {
  readonly label: string;
  readonly url: string;
}

export interface Profile {
  readonly name: string;
  readonly title: string;
  readonly pitch: string;
  readonly location: string;
  readonly email: string;
  readonly github: ExternalLink;
  readonly linkedin: ExternalLink;
  /** Path relative to the site root (no leading slash, so it works under any base-href). */
  readonly cvPath: string;
  /** Paragraphs of the About section. */
  readonly bio: readonly string[];
  readonly education: Education;
  /** Repository that contains this site's source code. */
  readonly siteRepo: string;
}

export interface Education {
  readonly degree: string;
  readonly institution: string;
  readonly period: string;
}

export interface Project {
  /** Stable, URL-safe id. Used for tracking in `@for` and for element ids. */
  readonly id: string;
  readonly title: string;
  /** Small line above the title, e.g. "Graduation capstone". */
  readonly context: string;
  readonly period?: string;
  readonly summary: string;
  /** Bullet points describing personal contributions. */
  readonly highlights: readonly string[];
  readonly tech: readonly string[];
  readonly tags: readonly ProjectTag[];
  /** Featured projects are listed first and get a visual accent. */
  readonly featured: boolean;
  /** `null` = no public repository: the card simply shows no source link. */
  readonly repoUrl: string | null;
}

export interface TimelineEntry {
  readonly id: string;
  readonly kind: 'experience' | 'certification';
  readonly title: string;
  readonly organization: string;
  readonly period: string;
  readonly description?: string;
}

export interface SkillGroup {
  readonly category: string;
  readonly skills: readonly string[];
}

export interface Portfolio {
  readonly profile: Profile;
  readonly projects: readonly Project[];
  readonly timeline: readonly TimelineEntry[];
  readonly skills: readonly SkillGroup[];
}
