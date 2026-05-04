<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the elrichchen.com portfolio. PostHog is initialized via a reusable `src/components/posthog.astro` component (using `is:inline` to prevent Astro TypeScript processing), imported in `src/layouts/Base.astro` so it loads on every page. Seven custom events are instrumented across five files, with environment variables used for all credentials.

| Event | Description | File |
|---|---|---|
| `contact_email_clicked` | User clicks the "Send an email" CTA or email inline link — primary conversion action | `src/pages/index.astro` |
| `social_link_clicked` | User clicks a social icon (GitHub, LinkedIn, X) with `platform` property | `src/pages/index.astro` |
| `project_link_clicked` | User clicks a project's external link icon with `project_name` and `href` properties | `src/pages/projects.astro` |
| `hobby_expanded` | User expands a hobby accordion card with `hobby_title` property | `src/pages/hobbies/index.astro` |
| `theme_switched` | User manually toggles light/dark theme with `theme` property | `src/components/ThemeToggle.astro` |
| `resume_clicked` | User clicks the Resume link in the contact card footer | `src/layouts/Base.astro` |
| `dark_mode_toast_accepted` | User clicks "Switch" on the one-time dark mode prompt toast | `src/layouts/Base.astro` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard — Analytics basics**: https://us.posthog.com/project/409616/dashboard/1543562
- **Contact email clicks over time**: https://us.posthog.com/project/409616/insights/Pc5SL0m7
- **Social link clicks by platform**: https://us.posthog.com/project/409616/insights/92jM2CWu
- **Project link clicks by project**: https://us.posthog.com/project/409616/insights/fpVUddfh
- **Visitor-to-contact conversion funnel**: https://us.posthog.com/project/409616/insights/YuCkrWYG
- **Hobby engagement and theme preferences**: https://us.posthog.com/project/409616/insights/VFD5lpuS

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
