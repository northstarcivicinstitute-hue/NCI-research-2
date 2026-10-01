#!/usr/bin/env python3
"""Site integrity check for nciresearch.org.

Run from the repository root:  python3 .github/scripts/check_site.py

It fails (exit code 1) when an upload or edit:
  * replaces nci-public.css or nci-site.js with an older copy,
  * drops the shared page template (header, mobile menu, footer, site script),
  * breaks an internal link, anchor, asset or redirect,
  * lists a missing or redirect-only page in sitemap.xml.
Standard library only, so it runs anywhere Python 3.8+ is installed.
"""
import os
import re
import sys
from html.parser import HTMLParser
from urllib.parse import unquote, urlparse

ROOT = os.getcwd()
errors = []


def fail(where, message):
    errors.append(f'{where}: {message}')


class Page(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.ids, self.refs, self.h1, self.meta, self.links = set(), [], 0, {}, {}
        self.classes, self.lang, self.title, self.refresh = set(), False, False, None

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if a.get('id'):
            self.ids.add(a['id'])
        for c in (a.get('class') or '').split():
            self.classes.add(c)
        if tag == 'html' and a.get('lang'):
            self.lang = True
        if tag == 'title':
            self.title = True
        if tag == 'h1':
            self.h1 += 1
        if tag == 'meta':
            if a.get('name'):
                self.meta[a['name']] = a.get('content', '')
            if a.get('http-equiv', '').lower() == 'refresh':
                self.refresh = a.get('content', '')
        if tag == 'link' and a.get('rel'):
            self.links.setdefault(a['rel'], []).append(a.get('href', ''))
        for key in ('href', 'src'):
            if a.get(key):
                self.refs.append((tag, a[key]))
        if tag == 'script' and a.get('src'):
            self.links.setdefault('script', []).append(a['src'])


def load(name):
    p = Page()
    with open(os.path.join(ROOT, name), encoding='utf-8') as fh:
        p.feed(fh.read())
    return p


def resolve(source, url):
    """Return (local file, fragment) for an internal URL, or None for external ones."""
    u = urlparse(url)
    if u.scheme in ('http', 'https', 'mailto', 'tel', 'data', 'javascript') or url.startswith('//'):
        if u.netloc == 'nciresearch.org' and u.path not in ('', '/'):
            return unquote(u.path).lstrip('/'), u.fragment
        return None
    path = unquote(u.path)
    if not path:
        return source, u.fragment
    target = path.lstrip('/') if path.startswith('/') else os.path.normpath(os.path.join(os.path.dirname(source), path))
    if target in ('', '.'):
        target = 'index.html'
    if os.path.isdir(os.path.join(ROOT, target)):
        target = os.path.join(target, 'index.html')
    return target, u.fragment


def luminance(hex_color):
    rgb = [int(hex_color[i:i + 2], 16) / 255 for i in (1, 3, 5)]
    rgb = [c / 12.92 if c <= 0.03928 else ((c + 0.055) / 1.055) ** 2.4 for c in rgb]
    return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2]


# ---------------------------------------------------------------- shared assets
css = open(os.path.join(ROOT, 'nci-public.css'), encoding='utf-8').read()
REQUIRED_CSS = {
    '@font-face': 'self-hosted fonts',
    '.nav-toggle': 'mobile menu button',
    '.js .nav': 'collapsible mobile menu',
    '.site-footer--full': 'site footer',
    '.subscribe-form': 'email signup form',
    '.support-card': 'Support page cards',
    '.brief-tools': 'share/cite tools',
    '[hidden]': 'hidden-element rule',
    '.brand-hero': 'program page heroes',
    '.watch-subscribe': 'Policy Watch signup',
    '.action-band': 'home follow/support band',
}
for needle, what in REQUIRED_CSS.items():
    if needle not in css:
        fail('nci-public.css', f'missing "{needle}" ({what}). An older copy of the stylesheet may have been uploaded.')
for name, value in re.findall(r'--(nci-(?:muted|slate)):\s*(#[0-9a-fA-F]{6})', css):
    ratio = 1.05 / (luminance(value) + 0.05)
    if ratio < 4.5:
        fail('nci-public.css', f'--{name} {value} has contrast {ratio:.2f}:1 on white; WCAG AA needs 4.5:1.')

js = open(os.path.join(ROOT, 'nci-site.js'), encoding='utf-8').read()
for needle, what in {'nav-toggle': 'mobile menu', 'data-subscribe': 'email signup', 'brief-tools': 'share/cite tools',
                     'NCI_LINKS': 'newsletter/giving settings', 'data-expires': 'self-expiring dates'}.items():
    if needle not in js:
        fail('nci-site.js', f'missing "{needle}" ({what}). An older copy of the script may have been uploaded.')

# ---------------------------------------------------------------- pages
pages = sorted(f for f in os.listdir(ROOT) if f.endswith('.html'))
parsed = {f: load(f) for f in pages}
redirects = {f for f, p in parsed.items() if p.refresh is not None}

for f in pages:
    p = parsed[f]
    if f in redirects:
        target = re.sub(r'^\s*\d+\s*;\s*url=', '', p.refresh, flags=re.I).strip()
        hit = resolve(f, target)
        if not hit or not os.path.exists(os.path.join(ROOT, hit[0])):
            fail(f, f'redirects to a missing page: {target}')
        elif hit[0] in redirects:
            fail(f, f'redirects to another redirect: {target}')
        continue
    if not p.lang:
        fail(f, 'missing <html lang>')
    if not p.title:
        fail(f, 'missing <title>')
    if 'description' not in p.meta:
        fail(f, 'missing meta description')
    if p.h1 != 1:
        fail(f, f'has {p.h1} <h1> elements (expected 1)')
    for cls, what in (('nav-toggle', 'mobile menu button'), ('site-footer--full', 'site footer'),
                      ('site-header', 'site header')):
        if cls not in p.classes:
            fail(f, f'missing the shared {what} (.{cls})')
    if 'site-nav' not in p.ids:
        fail(f, 'missing the primary navigation (#site-nav)')
    if 'nci-site.js' not in [u.lstrip('/') for u in p.links.get('script', [])]:
        fail(f, 'does not load /nci-site.js')
    if 'nci-public.css' not in [u.lstrip('/') for u in p.links.get('stylesheet', [])]:
        fail(f, 'does not load /nci-public.css')
    for tag, url in p.refs:
        hit = resolve(f, url)
        if not hit:
            if url.startswith('http://'):
                fail(f, f'insecure http:// link: {url}')
            continue
        target, fragment = hit
        if not os.path.exists(os.path.join(ROOT, target)):
            fail(f, f'broken {tag} link: {url}')
            continue
        if fragment and target.endswith('.html') and target in parsed and target not in redirects:
            if fragment not in parsed[target].ids and fragment != 'top':
                fail(f, f'link to a missing section: {url}')

# ---------------------------------------------------------------- sitemap
sitemap = open(os.path.join(ROOT, 'sitemap.xml'), encoding='utf-8').read()
for loc in re.findall(r'<loc>(.*?)</loc>', sitemap):
    path = urlparse(loc).path.lstrip('/') or 'index.html'
    if not os.path.exists(os.path.join(ROOT, path)):
        fail('sitemap.xml', f'lists a missing page: {loc}')
    elif path in redirects:
        fail('sitemap.xml', f'lists a redirect page: {loc}')
    elif parsed.get(path) and 'noindex' in parsed[path].meta.get('robots', ''):
        fail('sitemap.xml', f'lists a noindex page: {loc}')

live = len(pages) - len(redirects)
if errors:
    print(f'Site check failed with {len(errors)} problem(s):')
    for e in errors:
        print('  -', e)
    sys.exit(1)
print(f'Site check passed: {live} pages, {len(redirects)} redirects, shared CSS/JS and sitemap OK.')
