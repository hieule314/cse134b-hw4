# CSE 134B — Homework 4

| Deliverable | URL |
| :--- | :--- |
| Repository | https://github.com/hieule314/cse134b-hw4 |
| Website | https://hieule-cse134b-hw4.netlify.app/ |

My personal portfolio uses semantic HTML, shared CSS, and native browser APIs.
Both contact forms are linked from every portfolio page's main navigation.

## Parts 1 and 2: HTML and CSS form

`form-no-js.html` has no scripts. Name, email, and comments have associated labels,
visible instructions, and native required-field validation. Name accepts 1–100
characters without restricting language or punctuation; comments accept 10–1,000.
The email field uses `type="email"`.

Validation styles use `:required`, `:user-invalid`, and `:user-valid`. Invalid
controls have dashed borders as well as a distinct color, with unchanged border
widths. Empty fields do not appear as errors on initial load. Both forms submit
normally to `https://httpbin.org/post`, including `possible_bot=true`.

## Part 3: JavaScript enhancement

`form-with-js.html` loads `form.js` with `defer`. The script uses the Constraint
Validation API to explain missing values, invalid emails, and short comments.
Errors appear after leaving an edited field or attempting submission, remain
until corrected, and are associated with controls using `aria-describedby`.
A polite live region announces error feedback. Typing does not move focus.

The character counter reads the textarea's `maxlength`. It warns at 100 remaining
characters and explains when the limit has been reached. Typing, pasting, and
deleting update the counter; reaching the limit is not an error.

The `form_errors` array records each invalid field once per failed submission,
including keyboard submissions. Editing does not add history. Entries contain
only field names and error descriptions, never entered contact information or
message text. A successful POST includes this history as JSON in `form-errors`.

To capture every attempt, the script sets `form.noValidate = true` only after its
submission handler is installed. That handler explicitly validates every field,
records any errors, blocks invalid submissions, and leaves valid submissions to
the browser. With JavaScript disabled or unavailable, no `novalidate` attribute
is present, so native HTML validation and normal submission still work. The
JavaScript-dependent message areas stay hidden in that case.

## Part 4: themes and view transitions

`theme.js` adds a keyboard-accessible theme button on the portfolio pages and
enhanced form. Shared CSS custom properties define readable light and dark
themes. The button communicates its next action, and `localStorage` saves the
choice across reloads and navigation. Both storage reads and writes are protected
with `try`/`catch`; a storage failure does not prevent switching on the current page.

Theme changes use `document.startViewTransition()` for a same-document crossfade.
Unsupported browsers switch immediately. With `prefers-reduced-motion: reduce`,
the script skips the transition and CSS removes view-transition animation.
The script-free form always uses the default light theme. Theme buttons remain
hidden when JavaScript is disabled.

## Local preview

From the repository root, run:

```sh
python3 -m http.server 8000
```

Open `http://localhost:8000/`. Use a web server rather than a `file:` URL so browser
storage behaves consistently.

## Verification

Browser checks cover:

- Required fields separately, invalid email, and comments typed below the minimum.
- One-character and non-English names, apostrophes, hyphens, and native maximum lengths.
- Keyboard submission, visible focus, persistent errors, and correction of stale errors.
- Counter updates, near-limit warnings, and the at-limit message.
- Repeated failed attempts without duplicate history from editing, then a real httpbin
  POST containing the serialized history and all original fields.
- Both forms' native validation and successful POST with JavaScript disabled.
- Theme persistence through reload and navigation, and switching with storage blocked.
- The native View Transition API, unsupported-API fallback, and reduced-motion behavior.
- All portfolio pages at widths of 320, 375, 768, and 1280 pixels in both themes.

Use sample contact information when submitting to httpbin. The checks above also
passed on the deployed website in desktop Chrome 157. An automated axe-core scan
found no WCAG A/AA violations on the portfolio pages in either theme.

## Separate Homework 4 deployment

Create a new Netlify project connected to `hieule314/cse134b-hw4`, branch `main`.
Leave the build command empty and use `.` as the publish directory; `netlify.toml`
also specifies that directory. No dependency installation or build step is needed.
Keep the Homework 2 and Homework 3 deployments separate. Submit the repository
and website links above.

Netlify's Powered by Netlify badge injects a script into served HTML, including
the script-free form. Turn it off under Project configuration > General > Powered
by Netlify badge, then save. This hosting setting takes effect without a redeploy.
See [Netlify's badge documentation](https://docs.netlify.com/manage/projects/powered-by-netlify-badge/).

## References

- [Constraint Validation API](https://developer.mozilla.org/en-US/docs/Web/HTML/Guides/Constraint_validation)
- [View Transition API](https://developer.mozilla.org/en-US/docs/Web/API/Document/startViewTransition)
- [localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
