# Demo Project - Complete Information

## Project Overview
**Repository Name:** Demo  
**Repository Owner:** naveenkumargsisteer  
**Default Branch:** main  
**Current Branch:** main  
**Repository URL:** https://github.com/naveenkumargsisteer/Demo  

**Project Type:** Web Application (HTML/CSS - Static Sales Business Website)  
**Technology Stack:** HTML5, CSS3, Node.js  
**Current Status:** Early stage development with CI/CD pipeline setup

---

## Directory Structure

```
/workspaces/Demo/
├── .github/
│   ├── copilot-instructions.md          (Empty - available for Copilot custom instructions)
│   └── workflows/
│       └── copilot-agent-task.yml       (GitHub Actions workflow for automated development)
├── lib/                                   (EMPTY - Reserved for library code)
├── src/                                   (EMPTY - Reserved for source code)
├── tests/                                 (EMPTY - Reserved for test files)
├── .git/                                  (Git repository metadata)
├── index.html                             (Main project file - Sales Business homepage)
└── README.md                              (Basic README: "# Demo")
```

---

## Current Files & Content

### 1. **index.html** - Main Application File
- **Purpose:** Homepage for "Premium Sales Solutions" business platform
- **Type:** Single-page HTML with embedded CSS
- **Features:**
  - Responsive design with gradient background (purple/blue)
  - Modern card-based layout
  - Mobile-friendly with media queries
  - Marketing content highlighting sales solutions
  - Feature list with checkmark styling:
    - Strategic Sales Consulting & Planning
    - Advanced Customer Relationship Management
    - Sales Team Training & Development
    - Revenue Optimization Strategies
    - Data-Driven Sales Analytics
    - Lead Generation & Nurturing
  - CSS Styling:
    - Font: Segoe UI, Tahoma, Geneva, Verdana, sans-serif
    - Color Scheme: Purple (#667eea) and darker purple (#764ba2)
    - Layout: Flexbox centered container
    - Max-width: 600px container on white background

### 2. **.github/workflows/copilot-agent-task.yml** - GitHub Actions Workflow
- **Purpose:** Automated repository modification pipeline triggered by Jira approvals
- **Trigger Events:**
  - `repository_dispatch` - Triggered when Jira tickets are approved
  - `workflow_dispatch` - Manual trigger with inputs
  
- **Default Inputs:**
  - `ticket_id`: "DEMO-102"
  - `ticket_description`: "Update homepage hero to highlight enterprise CRM"

- **Workflow Jobs:**

  **Job 1: notify-slack**
  - Sends approval notifications to Slack (if webhook is configured)
  - Uses slackapi/slack-github-action@v1.26.0
  - Posts ticket ID and description to Slack channel

  **Job 2: run-copilot-agent**
  - Requires: notify-slack job completion
  - Steps:
    1. Checkout repository (actions/checkout@v4)
    2. Setup Node.js v20 with npm cache
    3. Install npm dependencies (`npm install`)
    4. Run test suite (`npm test`)
    5. Apply ticket to repository by executing:
       - Imports `applyTicketToRepository` from `./lib/agent.js`
       - Creates ticket object with key, summary, and description
       - Executes function and logs results as JSON
    6. Create feature branch: `fix/{TICKET_ID}`
    7. Commit changes with message: `fix({TICKET_ID}): {TICKET_DESCRIPTION}`
    8. Push branch to GitHub
    9. Create Pull Request with:
       - Title: "{TICKET_ID}: {TICKET_DESCRIPTION}"
       - Body: Automated update message with ticket details
       - Auto-delete-branch disabled

- **Permissions Required:**
  - `contents: write` - Can write to repository
  - `pull-requests: write` - Can create/modify PRs

### 3. **README.md**
- Contains only: "# Demo"
- Needs proper documentation

### 4. **.github/copilot-instructions.md**
- Currently empty
- Can be populated with Copilot custom instructions

---

## Git History

Recent commits:
1. `fd0d33b` - "yml" (recent)
2. `0e83ca1` - "test"
3. `9be88b3` - "Initial commit"

Current untracked file: `.github/copilot-instructions.md`

---

## Missing/Required Files

The workflow references these files that **NEED TO BE CREATED**:

1. **lib/agent.js** - CRITICAL
   - Must export `applyTicketToRepository(dirPath, ticket)` function
   - Should accept:
     - `dirPath`: Current working directory path
     - `ticket`: Object with `key`, `summary`, `description` properties
   - Should return a result object (logged as JSON)
   - Purpose: Contains logic to apply Jira ticket changes to the repository

2. **package.json** - CRITICAL
   - Required for npm to function
   - Must include:
     - Project metadata (name, version, description)
     - `test` script (referenced in workflow)
     - Dependencies and devDependencies
     - `type: "module"` for ES6 imports

3. **Tests** - Currently missing
   - tests/ directory is empty
   - Workflow runs `npm test` which will fail without tests

---

## Build & Deployment Setup

- **Node.js Version:** 20 (from workflow)
- **Package Manager:** npm
- **Test Command:** `npm test`
- **CI/CD Platform:** GitHub Actions
- **PR Creation:** Automated via peter-evans/create-pull-request@v6
- **Secrets Used:**
  - `SLACK_WEBHOOK_URL` (optional, for Slack notifications)
  - `GITHUB_TOKEN` (built-in, for PR creation)

---

## Development Instructions for Agents

### To modify this project, you should:

1. **Update index.html** - Modify the HTML/CSS for the sales business homepage
2. **Create lib/agent.js** - Implement the Jira ticket application logic
3. **Create package.json** - Add project dependencies and scripts
4. **Create tests/** - Add unit tests for validation
5. **Update .github/copilot-instructions.md** - Add custom development guidelines
6. **Update README.md** - Add proper project documentation

### When making changes:
- Follow the existing HTML structure and CSS styling
- Ensure all changes are committed before workflow execution
- Test locally with `npm test` before pushing
- PR titles should follow: `{TICKET_ID}: {DESCRIPTION}` format
- Use branch naming: `fix/{TICKET_ID}`

---

## Configuration & Secrets

**Required GitHub Secrets:**
- `SLACK_WEBHOOK_URL` (optional) - For Slack notifications

**Environment Variables in Workflow:**
- `TICKET_ID` - From Jira ticket
- `TICKET_DESCRIPTION` - From Jira ticket summary

---

## Key Technical Decisions

1. **Static Website**: The main deliverable is a single HTML file with embedded CSS
2. **Automated Workflow**: Uses Jira integration to trigger repository modifications
3. **Node.js Based**: Workflow uses Node.js to execute repository changes
4. **PR-Based Workflow**: All changes go through pull requests for review
5. **Feature Branch Strategy**: Branches created per ticket ID

---

## Next Steps for Development

1. Create `.github/copilot-instructions.md` with coding guidelines
2. Create `package.json` with project metadata and dependencies
3. Implement `lib/agent.js` with `applyTicketToRepository()` function
4. Create test suite in `tests/` directory
5. Add proper documentation to `README.md`
6. Enhance `index.html` with additional features/pages if needed
7. Set up proper error handling in the workflow

