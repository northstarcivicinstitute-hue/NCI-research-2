# Updating nciresearch.org

The site is plain HTML published by GitHub Pages from the `main` branch. Files in
this `.github` folder are not published.

## How the pages fit together

- **`nci-public.css`** styles every page. **`nci-site.js`** runs the mobile menu,
  share/cite buttons on briefs, the email signup forms, online giving and
  self-expiring deadlines.
- Every live page uses the same header (with the **Menu** button), footer and
  `<script defer src="/nci-site.js">`. Copy an existing page when you make a new one.
- Old addresses are kept as small redirect pages (for example `weekly-news.html`
  and `brief-1.html`), so links shared in the past keep working.

## The one rule

**Never upload an older copy of `nci-public.css` or `nci-site.js`.** On
September 30, 2026 an upload replaced the stylesheet with an older version,
which removed the mobile menu, the fonts and the footer styling on the live
site. Edit these two files in place (open the file on GitHub and use the
pencil icon) instead of uploading them from a ZIP.

## After every upload

GitHub runs **Site check** on each commit. Look for the green check or red X
next to the commit on the repository's main page.

- **Green check:** done.
- **Red X:** open it (Details → the failed step). Each line names the file and
  the problem, for example `nci-public.css: missing ".nav-toggle"` or
  `briefs.html: broken a link: /old-file.pdf`. Fix it or restore the previous
  version of that file from its History page.

To run the same check on your own computer, from the repository folder:

```
python3 .github/scripts/check_site.py
```

## Source standard

Every factual item links the record it comes from.

1. **Official primary records first:** legislative text and votes (congress.gov,
   govinfo.gov, senate.gov, clerk.house.gov, legislature.mi.gov), agency releases
   (michigan.gov, federal agencies), court records, public datasets and
   peer-reviewed research (DOI, PubMed).
2. **Established news organizations** only when they add detail no primary
   record has, and labeled as reporting (for example "Local 4 reporting").
3. **Advocacy or company statements** only to show that organization's own
   position or practice, and labeled as such ("AFL-CIO opposition statement").
4. **Never** party caucus or campaign sites. The site check rejects them.

Keep **Fact** and **NCI analysis** separate, and never endorse or oppose a
candidate, party, bill or ballot measure. Every brief footer carries the line
"NCI does not endorse or oppose legislation, ballot measures or candidates";
the site check enforces it.

## Common edits

**Policy Watch item.** In `policy-watch.html`, copy an existing
`<article class="brief-card">` card, keep the **Fact** / **NCI analysis**
labels and link the official source. Update the **Edition** and **Updated**
dates at the top of the page, and the three teaser cards in the
"Policy Watch" section of `index.html`.

**Deadlines that expire on their own.** Add the date the item closes to the list
item, and the site labels it "Closed" after that day:

```html
<li data-expires="2026-10-30"><strong>Oct. 30:</strong> Applications close. ...</li>
```

For an event rather than a deadline, add `data-expired-label="Past"`. To replace a
sentence after a date instead, add `data-expired-text="Text to show afterwards."`.

**New brief.** Copy an existing brief page, then add a card to `briefs.html`,
a line to `sitemap.xml`, and (if it is current) a card to the "Latest research"
section of `index.html`.

**Social links.** NCI's X account (`https://x.com/CivicNorthstar`) and Donavan
Norman's LinkedIn (`https://www.linkedin.com/in/donavannorman`) appear in the footer of
every page (`.footer-bottom`: "Founder on LinkedIn" and "NCI on X") and as buttons at
the top of `contact.html`. The LinkedIn link is also in the Leadership panel on
`about.html`. In the JSON-LD of `index.html`, `about.html` and the current briefs, the
NCI `Organization` lists the X account under `sameAs` and the founder/author `Person`
lists LinkedIn. Every page's `<head>` also carries
`<meta content="@CivicNorthstar" name="twitter:site"/>` so links shared on X credit the
account; copy it when you make a new page. To change an address, update all of these
places.

**Retire a page.** Replace its contents with a redirect page; copy
`weekly-news.html` and change the three addresses in it. Remove the page from
`sitemap.xml`.

## Daily updates

A scheduled research routine runs every morning at 6:47 a.m. Michigan time. It
looks for new Michigan, federal and (where relevant) international developments
in NCI's three research lanes. Each fact goes through three checks:

1. verified against an official or authoritative source,
2. re-verified independently in a second pass, and
3. the site check plus a line-by-line review of the changes.

The routine then pushes a branch named `daily-update-YYYY-MM-DD`. The
**Daily update** workflow opens a pull request for it and you get a notification.

- **To publish:** review the pull request and comment `/publish` (or approve it).
  The site check runs once more, the update merges into `main`, and the site
  refreshes within minutes. Only the repository owner's comment or approval counts.
- **To reject:** close the pull request.
- If the pull request does not open automatically, turn on **Settings → Actions →
  General → Allow GitHub Actions to create and approve pull requests**, or open it
  from the branch yourself.

## Turning on the newsletter and online giving

Both are switched off until the accounts exist. At the top of `nci-site.js`:

```js
window.NCI_LINKS = window.NCI_LINKS || {
  newsletterAction: '',   // form "action" URL from your email service, e.g. Buttondown
  newsletterField: 'email',
  givingUrl: ''           // your online donation page, e.g. Zeffy or Givebutter
};
```

- With `newsletterAction` empty, the signup forms open the visitor's email app
  with a pre-written subscribe request to donavan@nciresearch.org.
- With `givingUrl` empty, the **Give online** button on the Support page stays
  hidden and visitors are offered **Arrange a gift by email**.

Paste the two links, commit, and both features switch on everywhere.
