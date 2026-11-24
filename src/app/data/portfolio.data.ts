import { Portfolio } from './portfolio.models';

/**
 * ALL site content lives here. Edit this file to change what the site shows.
 *
 * Sources: Hamed_Musleh_CV.pdf plus details supplied directly by Hamed
 * (SENSE name/role, BZU Events). Nothing here should be added without a source.
 * Search for "TODO" to find placeholders that still need real values.
 */
export const PORTFOLIO: Portfolio = {
  profile: {
    name: 'Hamed Musleh',
    title: 'AI-Native Full-Stack Engineer',
    pitch:
      'Computer Engineering student at Birzeit University building AI-powered software, from NLP pipelines to the interfaces people use.',
    location: 'Ramallah, Palestine',
    email: 'hamed4.musleh@gmail.com',
    github: { label: 'github.com/HamedMusleh', url: 'https://github.com/HamedMusleh' },
    linkedin: {
      label: 'linkedin.com/in/hamed-musleh',
      url: 'https://www.linkedin.com/in/hamed-musleh-86a949334/',
    },
    cvPath: 'assets/Hamed_Musleh_CV.pdf',
    bio: [
      'I am a Computer Engineering student with hands-on experience in AI/ML, software engineering, and embedded systems.',
      'I recently completed the AI Software Engineering Training Program at ASAL Technologies, where I contributed to InterviewMirror, a production AI platform, working across its FastAPI backend and React/TypeScript frontend.',
      'I have built NLP pipelines, pipelined processors, and autonomous robots, and I am now looking for an engineering role where AI and product-quality frontends meet.',
    ],
    education: {
      degree: 'B.Sc. in Computer Engineering',
      institution: 'Birzeit University, Palestine',
      period: 'Expected 2026',
    },
    siteRepo: 'https://github.com/HamedMusleh/portfolio',
  },

  // Order matters: featured projects are shown first, in the order listed here.
  projects: [
    {
      id: 'sense',
      title: 'SENSE: AI Mental Health Triage in Crisis Environments',
      context: 'Graduation capstone · AI/Pipeline lead',
      period: 'In progress',
      summary:
        'SENSE (Speech Emotion and Neural Support Engine) is an AI-based triage system for mental health risk assessment in crisis environments.',
      highlights: [
        'Developing an NLP pipeline for Arabic text screening and risk-level classification.',
        'Focusing on dialectal Arabic preprocessing, model selection, and evaluation metrics.',
        'Designing for responsible use in sensitive contexts.',
      ],
      tech: ['NLP', 'Dialectal Arabic', 'Text classification', 'Model evaluation'],
      tags: ['AI'],
      featured: true,
      repoUrl: null, // TODO: add repository URL if/when it becomes public
    },
    {
      id: 'interview-mirror',
      title: 'InterviewMirror',
      context: 'ASAL Technologies · AI training program',
      period: '2026',
      summary:
        'An AI-powered interview and hiring platform covering CV screening, role-based question generation, skill mapping, and candidate evaluation.',
      highlights: [
        'Built the Skill Mapping module.',
        'Contributed to the AI-based Resume Matching pipeline.',
        'Integrated Azure OpenAI and Cognitive Services across the FastAPI/PostgreSQL backend and the React/TypeScript frontend.',
        'Worked in an Agile Scrum/Kanban workflow on Azure DevOps.',
      ],
      tech: [
        'React',
        'TypeScript',
        'FastAPI',
        'PostgreSQL',
        'Azure OpenAI',
        'Cognitive Services',
        'Azure DevOps',
      ],
      tags: ['AI', 'Frontend', 'Backend'],
      featured: true,
      repoUrl: null, // Company project: no public repository.
    },
    {
      id: 'bzu-events',
      title: 'Smart University Events App (BZU Events)',
      context: 'ENCS5150 Android course project · Team of 2',
      summary:
        'A native Android app for browsing, saving, and reserving university events, with an admin panel for managing them.',
      highlights: [
        'Built the Navigation Drawer and the Events screen with search and filter.',
        'Implemented Favorites, Reservations, and the Admin Panel.',
        'Wrote SessionManager and AES encryption of sensitive data (SecurityUtils).',
        'Added animations and consolidated the SQLite database.',
      ],
      tech: ['Java', 'Android', 'SQLite', 'RecyclerView', 'Navigation Drawer', 'SharedPreferences'],
      tags: ['Mobile', 'Frontend'],
      featured: true,
      repoUrl: null, // TODO: add repository URL
    },
    {
      id: 'country-classification',
      title: 'Country Classification from Travel Texts',
      context: 'ML / NLP',
      summary:
        'An end-to-end text-classification system that predicts the country from a travel description.',
      highlights: [
        'Compared traditional ML (Random Forest) with a transformer model (DistilBERT).',
        'Reached 87.1% accuracy through preprocessing, feature engineering, and error analysis.',
      ],
      tech: ['Random Forest', 'DistilBERT', 'Feature engineering', 'Error analysis'],
      tags: ['AI'],
      featured: false,
      repoUrl: null, // TODO: add repository URL if public
    },
    {
      id: 'wro-2025',
      title: 'WRO 2025 · Future Engineers',
      context: 'Robotics / Embedded',
      period: '2025',
      summary:
        'An autonomous robotic vehicle designed and integrated for the WRO 2025 Future Engineers competition.',
      highlights: [
        'Sensor integration and embedded firmware.',
        'Control logic, system-level testing, and technical documentation.',
      ],
      tech: ['Embedded firmware', 'Sensors', 'Control logic'],
      tags: ['Hardware'],
      featured: false,
      repoUrl: 'https://github.com/lannister-team/Lannister-WRO-Future-Engineers-2025',
    },
    {
      id: 'portfolio',
      title: 'This portfolio',
      context: 'Personal project',
      period: '2026',
      summary:
        'The site you are reading: hand-built components, no UI kit, accessible and responsive.',
      highlights: [
        'Standalone components with Signals and OnPush change detection.',
        'Typed content layer, light/dark theme, and reduced-motion support.',
        'Lint, unit tests, and build run in CI before every deploy to GitHub Pages.',
      ],
      tech: ['Angular', 'TypeScript', 'Signals', 'SCSS', 'Vitest', 'GitHub Actions'],
      tags: ['Frontend'],
      featured: false,
      repoUrl: 'https://github.com/HamedMusleh/portfolio',
    },
  ],

  // Newest first.
  timeline: [
    {
      id: 'asal',
      kind: 'experience',
      title: 'AI Software Engineering Trainee',
      organization: 'ASAL Technologies',
      period: 'Jul 2026 – Sep 2026',
      description:
        'A 9-week, full-time program (320 training hours) covering Azure AI, Cloud, and DevOps in a professional software company environment. Contributed to InterviewMirror.',
    },
    {
      id: 'frontend-cert',
      kind: 'certification',
      title: 'Front-End Development',
      organization: 'Hope International Co.',
      period: '2024',
      description: '40-hour course.',
    },
    {
      id: 'git-workshop',
      kind: 'certification',
      title: 'Git & GitHub Workshop',
      organization: 'Microsoft Learn Student Ambassador',
      period: '2024',
    },
  ],

  skills: [
    // Not a heading in the CV: React/TypeScript come from the InterviewMirror entry,
    // Angular/SCSS are demonstrated by this site itself.
    { category: 'Frontend', skills: ['TypeScript', 'Angular', 'React', 'SCSS'] },
    { category: 'Programming', skills: ['Python', 'C/C++', 'Java', 'MIPS Assembly'] },
    { category: 'AI / ML', skills: ['Scikit-learn', 'DistilBERT', 'Model Evaluation'] },
    { category: 'Backend', skills: ['FastAPI', 'MySQL', 'PostgreSQL'] },
    { category: 'Cloud', skills: ['Azure AI', 'Azure DevOps'] },
    { category: 'Hardware', skills: ['Verilog', 'Digital Design', 'Simulation'] },
    { category: 'Systems', skills: ['Pipeline Design', 'Hazard Handling', 'Scheduling'] },
    { category: 'Foundations', skills: ['Data Structures', 'Algorithms', 'Operating Systems'] },
    { category: 'Management', skills: ['Project Management', 'Engineering Economics'] },
  ],
};
