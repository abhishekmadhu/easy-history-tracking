# Easy Salesforce Field History Tracking

## Who is this for?

Are you a Salesforce consultant who is constantly frustrated when working with field history tracking with customers because you cannot export history tracking information easily?

Now you can! This project provides a simple, robust solution to quickly view, filter, and export Salesforce field history tracking information for any set of objects in your org. No more manual clicks, no more confusion—just select, export, and share.

## How It Works (for Consultants)

- Visit the page
- Select Objects
- Export
- Send to customer

With this tool, you can instantly see all objects in your Salesforce org, filter and select the ones you care about, and export a CSV with all field history tracking details. The exported file is ready to send to your customer or use in your own documentation. No technical setup or deep Salesforce knowledge required—just point, click, and deliver.

## Technical Details

This project is built as a Salesforce DX project with:

- **Lightning Web Components (LWC):** A modern UI that lists all objects, allows filtering, sorting, and selection, and provides a single-click export button.
- **Apex Controllers:** Secure, efficient Apex classes fetch object and field metadata, including history tracking status, using Salesforce's Tooling API and SOQL. The logic is robust for large orgs and avoids hitting Salesforce query limits.
- **CSV Export:** The export is generated client-side and is Lightning Web Security (LWS) compatible, so it works in all Salesforce orgs.
- **Test Coverage:** Apex and LWC Jest tests ensure reliability and maintainability.

For more details, see the documentation in the `ai-docs` folder.
