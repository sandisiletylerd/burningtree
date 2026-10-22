# BURNING TREE

A responsive, static fashion-brand storefront for BURNING TREE, built with HTML, CSS, and vanilla JavaScript. It uses the brand slogan “Wear the fire, grow the legacy” and a brown, gold, and black palette with a burnt-orange accent.

## Run locally

1. Open this folder in VS Code.
2. Open `index.html` in a browser, or use the VS Code **Live Preview** / **Live Server** extension.
3. No package installation, build step, or backend is required.

## Project files

- `index.html` — semantic page content, navigation, priced product catalogue, size/colour selectors, and shopping-cart checkout dialog.
- `styles.css` — design tokens, responsive layouts, focus states, reduced-motion support, and component styles.
- `script.js` — mobile navigation, cart quantities/totals, email order-request preparation, and clearly identified drop-list preview behavior.
- `assets/` — local editorial JPEGs and the SVG favicon.

## Before launch: replace these placeholders

- Confirm that the listed product names, prices, sizes, and colours match available stock before advertising them.
- The cart prepares an unpaid order-request email to `burningtree@gmail.com`. Customers must open the email draft in an email app and send it; the site does not send, save, or confirm orders and does not take payment. Customer details are only added to the draft in the customer's email app.
- Shipping charges and product availability are confirmed by the brand after receiving an order request.
- Connect the drop-alert signup form to a mailing-list provider or backend. Its current preview handler does not transmit or store submitted email addresses.
- Review the published email and social links in `index.html` and confirm the profiles use the `@burning.tree` handle.
- Add any legal/privacy pages required for the business and the mailing-list provider.
- Replace the temporary Unsplash editorial-reference photographs in `assets/` with brand-owned or properly licensed product photography. The collection identifies the current photos as campaign references, not product representations.
- Review all brand copy, product details, spelling, and prices against approved business information before publishing.

## Publish with GitHub Pages

1. Create a GitHub repository and add these project files.
2. Commit and push the project to the repository's default branch. From a terminal in this folder, for example:

   ```powershell
   git init
   git add index.html styles.css script.js assets README.md
   git commit -m "Create BURNING TREE storefront"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
   git push -u origin main
   ```

   If the project is already a Git repository, skip `git init` and set `origin` only if it has not already been configured. Replace the example repository URL with the real one.

3. In the repository, open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**, select `main` and the `/ (root)` folder, then save.
5. Wait for the Pages deployment and open the URL shown in the Pages settings.

The page uses relative asset paths and can be hosted as a static site on Render or GitHub Pages. Push updates to the connected GitHub branch to trigger a Render redeploy. Paid checkout and mailing-list collection still require connecting their respective services before launch.
