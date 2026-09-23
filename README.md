# IPA Archive — GitHub Pages + Codespaces

A small, static, Progressive Web App (PWA) example for browsing iOS app archive metadata and adding the archive website to an iPhone/iPad Home Screen.

## Included metadata

The example contains the 20 app records supplied in the project request:

- App Name
- Bundle ID
- Version
- Platform
- Minimum OS
- File Size

## Run in GitHub Codespaces

```bash
python3 -m http.server 8080
```

Open port **8080** in the Codespaces forwarded ports panel.

## Deploy to GitHub Pages

1. Create a GitHub repository.
2. Upload these files to the repository root.
3. Open **Settings → Pages**.
4. Select **Deploy from a branch**.
5. Choose your main branch and `/ (root)`.
6. Save and open the generated GitHub Pages URL.

## Add to iPhone/iPad Home Screen

Open the GitHub Pages URL in **Safari**:

**Share → Add to Home Screen → Add**

Because this is a web app/PWA, the Home Screen installation installs the website as a standalone web app. It does **not** install or sideload IPA files and does not bypass Apple's App Store signing or security controls.

## Important

The archive metadata is presented as supplied by the project request. It is not independently verified here, and this example does not claim that the listed historical apps are currently available on the App Store.

## Optional next steps

You can add:

- real archive/download links
- screenshots and app icons
- an `apps.json` data file
- categories and tags
- sorting
- app detail pages
- checksums
- an archive source field
- legal/licensing notes
