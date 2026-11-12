# Portfolio design notes

## Reference analysis

Reference: [Janay Rawal's portfolio](https://www.janayrawal.in/), inspected November 12, 2026.

The reference uses a fixed file-tree explorer, large sections with generous spacing,
and three continuously moving rows of technology icons. It separates a short
introduction from skills, projects, experience, and personal content. Those
structural ideas informed this redesign; the implementation is original native
HTML, CSS, and JavaScript and retains Hieu's cream, forest, and pixel-font identity.

## Content roles

- Home: a concise introduction, the technical toolkit, a project index, and a contact invitation.
- Projects: explanations of each project's purpose and implementation, followed by resume access and a short experience timeline.
- About: dogs, sports, and games, without repeating the professional biography.
- Both contact forms: the original submission and validation requirements, with the shared explorer navigation.

Technology names come from the Technical Skills section of
[Hieu's existing resume](../assets/documents/hieu-le-resume.pdf). Icons are served
locally from Devicon with its license in `assets/icons/`.

## Interaction and accessibility

- Explorer folders use native `details` and real links. They work without JavaScript.
- On narrow screens, JavaScript starts the outer explorer closed to leave room for content. Its disclosure remains keyboard accessible.
- Main narrative sections use `min-height: 100svh`. They can grow when text or images need more room. Desktop proximity scroll snapping helps align sections without intercepting wheel, touch, or keyboard input.
- Skill rows pause or resume when selected or when Enter/Space is pressed while a row is focused. Reduced motion and disabled JavaScript show complete, static lists. Duplicate animation strips are hidden from assistive technology.
- The illustrated character is used for browser/bookmark icons and beside the sidebar name. The sidebar portrait has a brief CSS greeting that respects reduced motion. The original initials SVG is retained.
- `form-no-js.html` has no scripts or inline event handlers. Form constraints and `form.js` have been preserved.
- Theme switching still uses persistent preferences and the View Transition API, with the existing storage and reduced-motion fallbacks.

## Verification

Tested in desktop Chrome 157 with JavaScript enabled and disabled:

- Both forms' validation, keyboard submission, real httpbin POST, and serialized error history.
- Theme persistence, blocked storage, supported/unsupported view transitions, and reduced motion.
- All portfolio pages at 320, 375, 768, 1024, 1280, and 1440 CSS pixels without horizontal overflow.
- Desktop viewport-sized sections, file navigation, moving skill rows, pointer/keyboard pause and resume, keycap contact links, and mobile disclosure operation.
- All photos, local icons, and favicon assets.
- Automated axe-core WCAG A/AA scans on all portfolio pages in both themes: no violations found. This scan supplements keyboard and visual checks.

The favicon was edited with built-in ImageGen; the [final prompt](favicon-prompt.md) records the requested crop and identity constraints.
