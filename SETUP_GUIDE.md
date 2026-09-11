# Step-by-Step Guide: Setting Up This Project in Salesforce Marketing Cloud (SFMC)

This guide walks you through deploying and connecting this Next.js project to your **Salesforce Marketing Cloud (SFMC)** tenant via **Installed Packages**.

---

## 📋 Prerequisites

1. **Administrator Access** to your SFMC account (to access **Setup > Apps > Installed Packages**).
2. **A Public HTTPS URL**: SFMC will NOT connect to `http://localhost:3000`. You must expose your local server using a tunneling tool (such as **ngrok** or **Cloudflare Tunnel**) or deploy it (e.g., to Vercel / Railway).

---

## Step 1: Expose Your Local Server via HTTPS

If you are developing locally:

1. Start your local Next.js server:
   ```bash
   npm run dev
   ```
2. In another terminal, expose port 3000 using ngrok:
   ```bash
   npx ngrok http 3000
   ```
3. Copy the secure HTTPS URL provided by ngrok, for example:
   ```
   https://xyz-123-sfmc.ngrok-free.app
   ```

---

## Step 2: Create an Installed Package in SFMC

1. Log in to your Salesforce Marketing Cloud instance.
2. In the top-right corner, click on your **Name/Avatar** and select **Setup**.
3. In the left navigation menu, expand **Apps** and click on **Installed Packages**.
4. Click the blue **New** button (top-right).
5. Enter package details:
   - **Name**: `SFMC Developer Suite`
   - **Description**: `Embedded Schema Explorer Dashboard and Custom Journey Builder Activity`
6. Click **Save**.

---

## Step 3: Add Component 1 — Marketing Cloud App (Embedded Dashboard)

This component embeds your Schema Explorer inside the SFMC user interface (accessible from the App Switcher / 9-dots menu).

1. Inside your newly created package, scroll to **Components** and click **Add Component**.
2. Select **Marketing Cloud App** and click **Next**.
3. Configure the fields:
   - **Name**: `Schema Explorer Dashboard`
   - **Description**: `Interactive visualizer for DEs and custom activity execution logs`
   - **Endpoint URL**: `https://<YOUR-PUBLIC-URL>/` *(e.g., `https://xyz-123-sfmc.ngrok-free.app/`)*
4. Click **Save**.

> **Result**: You can now access your dashboard directly from SFMC's top navigation / App Switcher.

---

## Step 4: Add Component 2 — Journey Builder Custom Activity

This makes your custom activity appear in the Journey Builder canvas as a drag-and-drop step.

1. Click **Add Component** again.
2. Select **Journey Builder Activity** and click **Next**.
3. Fill in the fields:
   - **Name**: `Smart Webhook & Loyalty Rewarder`
   - **Description**: `Executes webhook logic and assigns customer rewards`
   - **Category**: Select `Messages` (or `Customer Updates`)
   - **Endpoint URL**: `https://<YOUR-PUBLIC-URL>/custom-activity` *(e.g., `https://xyz-123-sfmc.ngrok-free.app/custom-activity`)*
4. Click **Save**.

> **Note**: SFMC automatically fetches the manifest from `https://<YOUR-PUBLIC-URL>/custom-activity/config.json`. Our Next.js backend already serves this standard JSON file!

---

## Step 5: Add Component 3 — API Integration (For Live REST/SOAP Access)

This allows your app to pull live Data Extensions and publish logs back to SFMC.

1. Click **Add Component**.
2. Select **API Integration** and click **Next**.
3. Select **Server-to-Server** integration type and click **Next**.
4. Set the required **Scopes**:
   - **Data Extensions**: `Read`, `Write`
   - **Journeys**: `Read`, `Execute`
   - **Email**: `Read`, `Send`
5. Click **Save**.
6. SFMC will generate your credentials:
   - **Client Id**
   - **Client Secret**
   - **Authentication Base URI** (e.g., `https://mcxxxx.auth.marketingcloudapis.com/`)
   - **REST Base URI** (e.g., `https://mcxxxx.rest.marketingcloudapis.com/`)

---

## Step 6: Connect Your Code to Live Credentials

1. Open your `.env.local` file (or copy from `.env.example`):
   ```bash
   cp .env.example .env.local
   ```
2. Update the values with the credentials obtained from Step 5:
   ```env
   USE_MOCK=false
   SFMC_CLIENT_ID=your_actual_client_id
   SFMC_CLIENT_SECRET=your_actual_client_secret
   SFMC_AUTH_SUBDOMAIN=mcxxxx-xxxxxxxxxxxxxx
   SFMC_REST_SUBDOMAIN=mcxxxx-xxxxxxxxxxxxxx
   SFMC_ACCOUNT_ID=your_mid
   NEXT_PUBLIC_APP_URL=https://<YOUR-PUBLIC-URL>
   ```
3. Restart your Next.js app (`npm run dev`). Your Schema Explorer will now fetch live Data Extensions directly from your SFMC account!

---

## Step 7: Test in Journey Builder

1. In SFMC, navigate to **Journey Builder > Journeys**.
2. Create a **New Journey** (Multi-Step Journey).
3. Look at the left activity palette under **Custom Activities** (or Messages).
4. You will see **Smart Webhook & Loyalty Rewarder**.
5. Drag and drop it onto the canvas and click it. The Next.js configuration modal will open inside the canvas!
6. Select your reward logic and click **Save**.
7. When you activate the journey, SFMC calls `/api/activity/validate` and `/api/activity/publish`.
8. When a contact passes through the node, SFMC invokes `/api/activity/execute`, and you can monitor the execution in your **Schema Explorer Audit Log**!

