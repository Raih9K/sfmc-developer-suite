# SFMC Developer Suite: Brain & Requirements Spec

## 1. Project Overview & Vision
This project is an all-in-one **Salesforce Marketing Cloud (SFMC) Installed Package Developer Suite** built with Next.js (App Router, TypeScript, Tailwind CSS). It serves both as an educational platform and a production-grade blueprint for integrating custom apps and extensions into SFMC.

---

## 2. Core Requirements & Architecture

### A. Supported SFMC Extension Types
1. **Marketing Cloud App (Embedded Web App / Dashboard)**:
   - Loaded inside SFMC UI via iFrame (accessible from the App Switcher / Nine-Dots Menu).
   - Serves as the **Schema Explorer** (similar to the Salesforce Labs Schema Explorer tool).
   - Visualizes Data Extensions, primary keys, field data types, sendable status, and entity relationships (ER graph linking CustomerKey/SubscriberKey).
   - Tracks audit logs of Journey executions and Data Extension metrics.

2. **Journey Builder Custom Activity**:
   - Custom drag-and-drop canvas activity node.
   - **Configuration UI**: Embeddable modal communicating via the Postmonger protocol (`ready`, `initActivity`, `clickedNext`, `updateActivity`).
   - **Lifecycle Endpoints**:
     - `GET /custom-activity/config.json`: SFMC standard manifest specifying inArguments, outArguments, icons, and execute endpoints.
     - `POST /api/activity/save`: Triggered when marketer saves journey activity configuration.
     - `POST /api/activity/publish`: Triggered when journey is activated/published.
     - `POST /api/activity/validate`: Validation checks before journey launch.
     - `POST /api/activity/execute`: Real-time webhook invoked whenever a contact reaches this step in a running journey.

3. **Journey Activity Simulator (Local Learning / Sandbox)**:
   - Interactive UI to test the Custom Activity without requiring a live SFMC tenant.
   - Allows feeding simulated subscriber/contact data, firing the execute webhook, inspecting output responses, and automatically logging results to the audit dashboard.

---

## 3. Dual API Engine (Mock Sandbox & Live SFMC)
* **Default Mode (MOCK_SANDBOX)**:
  - Enabled out-of-the-box (`USE_MOCK=true`).
  - Realistic Data Extensions (`Master_Customer_Profiles`, `Ecom_Orders_History`, `Abandoned_Cart_Events`, `Custom_Activity_Execution_Audit`).
  - Allows learning and building locally without needing paid SFMC credentials.
* **Live SFMC Production Mode (`USE_MOCK=false`)**:
  - Automatically requests OAuth2 Bearer Tokens via Client Credentials Grant (`/v2/token`).
  - Handles token expiration caching.
  - Queries SFMC REST API (`/data/v1/customobjects`) and SOAP API.

---

## 4. Installed Package Deployment & Public Tunneling
* **Installed Package Components Setup**:
  - **API Integration**: Server-to-Server (Scopes: Data Extensions Read/Write, Journeys Read/Execute).
  - **Marketing Cloud App**: Web App Endpoint pointing to `https://<public-url>/`.
  - **Journey Builder Activity**: Endpoint pointing to `https://<public-url>/custom-activity`.
* **Local Development with HTTPS**:
  - SFMC requires public HTTPS endpoints.
  - Use **Cloudflare Tunnel** or **ngrok** (`ngrok http 3000`) and set `NEXT_PUBLIC_APP_URL` in `.env`.

---

## 5. Comprehensive SFMC Knowledge Base & Module Mapping

Your project acts as a practical workbench covering the core pillars of Salesforce Marketing Cloud development:

### 📜 1. Scripting & Programmatic Languages
* **AMPscript**: Linear language for email/SMS rendering and subscriber data lookup (`Lookup`, `LookupRows`, `UpsertDE`).
* **Server-Side JavaScript (SSJS)**: JavaScript executed on SFMC servers (`Platform.Function.*`, `WSProxy`) used in CloudPages and Script Activities.
* **Guide Template Language (GTL)**: Handlebars/Mustache syntax parsing complex JSON payloads.
* **HTML/CSS (Email)**: Email client rendering (VML for Outlook, table-based layouts).

### 🗄 2. Data Architecture & Modeling (Supported in Schema Explorer)
* **Data Extensions (DEs)**: Sendable vs Non-Sendable tables, retention policies, primary keys.
* **Contact Builder & Attribute Groups**: Linking relational DEs to the master Contact Model.
* **Subscriber Key vs Contact Key**: Unique identifiers across channels.
* **All Subscribers List**: Master tracking table for subscription & bounce status.

### ⚙ 3. Data Processing & Automation
* **Automation Studio**: Workflow orchestration (File Transfer, Import, Data Extract).
* **SQL Query Activities**: T-SQL dialect (T-SQL 2016) with limitations (`ROW_NUMBER()`, joining DEs).
* **System Data Views**: System tables (`_Sent`, `_Open`, `_Click`, `_Bounce`, `_Subscribers`, `_JourneyActivity`).
* **Script Activities**: SSJS scripts running inside scheduled automations.

### 📡 4. APIs & System Integration (Implemented in this Project)
* **REST API**: Asset management, Contact updates, `/data/v1/customobjects`, and event definitions.
* **SOAP API / WSProxy**: Complex queries, batch record operations, and legacy object manipulations.
* **Transactional Messaging API**: High-priority real-time message triggers (< 1s).
* **Marketing Cloud Connect**: Synced Data Extensions from Salesforce CRM.
* **Custom Journey Builder Activities**: Custom endpoints via `config.json` and Postmonger handshake (`/execute`, `/save`, `/publish`).

### 🎨 5. Front-End & Content Systems
* **CloudPages**: Dynamic micro-sites, preference centers, and landing pages.
* **Content Builder**: Content repository, email blocks, code snippets.
* **Custom Content Blocks (SDK)**: Extending Content Builder with custom WYSIWYG editors.

---

## 6. Requirement Change & Feature Roadmap
- [x] Full-Stack Next.js (App Router + TypeScript + Tailwind CSS) architecture.
- [x] Schema Explorer UI (visualizing Data Extensions, fields, and relationships).
- [x] Custom Journey Activity `config.json` standard specification.
- [x] Activity lifecycle APIs (`/execute`, `/save`, `/publish`, `/validate`).
- [x] Interactive Journey Activity Simulator with live execute trigger.
- [x] Audit log and live execution tracking.
- [x] **SFMC Developer Knowledge Hub & Playground** (Reference for AMPscript, SSJS, SQL Data Views, and APIs).
- [ ] System Data Views Reference & Query Generator (e.g., query `_Sent`, `_Open`, `_Click`).
- [ ] Direct Data Extension Row insertion (Data Loader style).

