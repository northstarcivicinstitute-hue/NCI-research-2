NCI DEPLOYMENT HOTFIX - SEPTEMBER 30, 2026

WHY THIS EXISTS
The production smoke test after the September 30 upload showed a partial deployment:
- index.html updated,
- mseem.html redirect updated,
- but initiatives.html, policy-watch.html, briefs.html, Michigan Sports Opportunity, and other pages remained stale,
- buildready.html, film-room.html, and next-play.html returned 404.

UPLOAD
1. Extract this ZIP.
2. Upload EVERY extracted file to the ROOT of the existing GitHub Pages repository.
3. Choose/confirm replacement for files with the same names.
4. Do not delete the repository and do not delete legacy PDFs or brief-1.html through brief-6.html.
5. Keep CNAME, support.html, privacy.html, and other existing files not included here.

MANUAL SUPPORT PAGE FIX
In the existing support.html footer only:
- change MSEEM Forward -> Michigan Sports Opportunity
- change /mseem.html -> /michigan-sports-opportunity.html
Do not change the giving/payment link.

POST-UPLOAD CHECKS
/index.html
/initiatives.html
/policy-watch.html
/weekly-news.html
/briefs.html
/civic-governance-atlas.html
/community-equity-lab.html
/michigan-sports-opportunity.html
/growready.html
/buildready.html
/film-room.html
/next-play.html
/federal-college-sports-michigan-s4668.html
/mseem.html
/mseem-forward.html
/groundwork.html
/groundworks.html
/playstrong.html
