# SFMC Developer Suite 🚀
> Full-Stack Salesforce Marketing Cloud (SFMC) Installed Package Developer Workbench, Schema Visualizer & Journey Builder Custom Activity Engine.

---

## ✨ Key Features (ফিচারসমূহ)

### 1. 📊 Embedded Schema Explorer & Data Visualizer (Marketing Cloud App)
- **Visual Entity-Relationship (ER) Mapper**: Data Extensions-এর মধ্যে Primary Key, Foreign Key (CustomerKey / SubscriberKey) রিলেশনশিপ ইন্টারঅ্যাক্টিভভাবে প্রদর্শন করে।
- **Complete DE Inspector**: প্রতিটি Data Extension-এর ফিল্ডের ডাটা টাইপ (`Text`, `Number`, `Date`, `EmailAddress`, `Phone`), Length, Required এবং Primary Key স্ট্যাটাস দেখা যায়।
- **Multi-Tenant / Multi-Folder Navigation**: বিভিন্ন ফোল্ডার ক্যাটাগরিতে (`Core Marketing`, `Transactions`, `Journey Audiences`, `Logs`) থাকা DE দ্রুত ফিল্টার ও ব্রাউজ করা যায়।
- **Audience & Volume Metrics**: মোট Data Extension সংখ্যা, রেকর্ড ভলিউম এবং কাস্টম অ্যাক্টিভিটি হিট রিয়েল-টাইমে গণনা করে।

### 2. ⚙️ Journey Builder Custom Activity (Drag-and-Drop Node)
- **Standard `config.json` Specification**: SFMC Journey Builder-এর জন্য শতভাগ ভ্যালিড কনফিগারেশন ম্যানিফেস্ট প্রদান করে।
- **Postmonger Protocol Handshake**: ক্যানভাসের সাথে দুইমুখী যোগাযোগ (`ready`, `initActivity`, `clickedNext`, `updateActivity`) সমর্থন করে।
- **Dynamic Field Injection (Data Binding)**: `{{Contact.Key}}`, `{{InteractionDefaults.Email}}`, এবং কাস্টম ইভেন্ট ফিল্ড স্বয়ংক্রিয়ভাবে ইনপুট হিসেবে গ্রহণ করে।
- **Multi-Channel Delivery Webhook Engine**: WhatsApp, SMS, এবং Transactional Email ডেসপ্যাচের জন্য কনফিগারেবল গেটওয়ে।
- **Smart Logic Rules**: কার্ট ভ্যালু বা কাস্টমার ক্যাটাগরির ওপর ভিত্তি করে স্বয়ংক্রিয় ডিসকাউন্ট/রিওয়ার্ড কোড জেনারেশন।

### 3. 🧭 Journey ID Query Builder & Analytics Generator
- **Auto SQL Generation**: Journey ID ও Version ID দিয়ে স্বয়ংক্রিয়ভাবে পারফেক্ট T-SQL কুয়েরি জেনারেট করা।
- **Multi-Table System Views Join**: `_Journey`, `_JourneyActivity`, `_Sent`, `_Open`, এবং `_Click` টেবিলগুলোকে রিলেশনাল কী দিয়ে নিখুঁতভাবে জয়েন করে।
- **Interactive Metrics Filter**: নির্দিষ্ট জার্নির জন্য শুধু ওপেন (Opens), ক্লিক (Clicks), বা বাউন্স (Bounces) ফিল্টার করে সাবস্ক্রাইবার ট্র্যাকিং দেখা।
- **Execution Output Preview**: কুয়েরি রান করে কোন কন্ট্যাক্ট জার্নির কোন অ্যাক্টিভিটিতে হিট করেছে তার সিমুলেটেড রেজাল্ট দেখা।

### 4. 🚀 Journey Activity Live Simulator (Zero-Tenant Sandbox)
- **Tenant-Free Development**: কোনো পেইড বা লাইভ SFMC অ্যাকাউন্ট ছাড়াই লোকালহোস্টে কাস্টম অ্যাক্টিভিটি টেস্ট করা যায়।
- **Payload Testing**: কন্ট্যাক্ট ডেটা (ContactKey, Email, Cart Value) দিয়ে লাইভ `/api/activity/execute` কল করা এবং রেসপন্স পরীক্ষা করা।
- **Live Execution Audit Trail**: কাস্টম অ্যাক্টিভিটি কতবার ফায়ার হলো, সাকসেস/ফেইল স্ট্যাটাস এবং আউটপুট পে-লোড ড্যাশবোর্ডে স্বয়ংক্রিয়ভাবে রেকর্ড করা।

### 4. 🔍 Automation Studio SQL & System Data Views Workbench
- **System Data Views Support**: SFMC-এর হিডেন অডিট টেবিলগুলোর (`_Sent`, `_Open`, `_Click`, `_Bounce`, `_Subscribers`) ওপর অপ্টিমাইজড কুয়েরি টেস্ট করার পরিবেশ।
- **Pre-Built SQL Recipes**:
  - *Unengaged Subscribers*: যারা ইমেল পেয়েছে কিন্তু গত ৩০ দিনে ওপেন করেনি।
  - *Click-Through URL Analysis*: ক্যাম্পেইন অনুযায়ী লিঙ্ক পারফরম্যান্স এবং ইউনিক ক্লিক এগ্রিগেশন।
  - *Hard Bounce Auditor*: SMTP এরর কোডসহ বাউন্স ডাটা ফিল্টার করা।
- **Instant Result Simulator**: রান করার সাথে সাথে আউটপুট টেবিল প্রিভিউ।

### 5. ⚡ Sub-Second Transactional Messaging API Workbench
- **Real-Time Dispatch Engine**: SFMC Transactional REST API (`/messaging/v1/email/messages`) টেস্টিং টুল।
- **Dynamic Attributes Mapping**: অর্ডার রিসিট, ওটিপি, পাসওয়ার্ড রিসেট বা শিপিং নোটিফিকেশনের ডেটা ম্যাপ করা।
- **MTA Queue Simulator**: সাব-সেকেন্ডে মেসেজ এনকিউ হওয়ার রেসপন্স (`202 Accepted`) এবং মেসেজ কি ট্র্যাকিং।

### 6. 🌐 CloudPages & Server-Side JavaScript (SSJS) Runtime Studio
- **WSProxy High-Speed Queries**: CloudPages থেকে Core SOAP-এর চেয়ে ১০ গুণ দ্রুত Data Extension কুয়েরি করার জন্য WSProxy এক্সিকিউশন।
- **Preference Center AJAX Handler**: কাস্টমার ফর্ম সাবমিট থেকে JSON পার্স করে Data Extension-এ `Upsert` করার ফুল SSJS স্ক্রিপ্ট।
- **External Webhook Dispatcher**: CloudPage থেকে `Platform.Function.HTTPPost()` দিয়ে থার্ড-পার্টি পেমেন্ট বা লয়্যালটি API কল করার প্যাটার্ন।
- **In-Browser Sandbox Runner**: কোনো লাইভ ক্লাউডপেজ হোস্ট ছাড়াই ব্রাউজারে SSJS স্ক্রিপ্ট রান করে আউটপুট প্রিভিউ দেখা।

### 7. 📚 SFMC Developer Knowledge Hub & Playbook
- **Interactive Code Recipes**: কপি-টু-ক্লিপবোর্ড সুবিধাসহ রেডিমেড প্রোডাকশন কোড স্নিপেট:
  - **AMPscript**: `LookupRows()`, `Row()`, `Field()`, `UpsertDE()`, এবং `RedirectTo()`.
  - **SSJS & WSProxy**: কোর SOAP-এর চেয়ে ১০ গুণ দ্রুত Data Extension রিট্রিভ করার কোড।
  - **Postmonger Lifecycle**: ফ্রন্টএন্ড আইফ্রেম এবং SFMC ক্যানভাসের ইভেন্ট বাস কোড।

### 7. 🔌 Dual-Mode Architecture (Mock Sandbox ⮀ Live SFMC)
- **Instant Local Mock Mode**: ডিফল্টভাবে সক্রিয়, কোনো ক্রেডেনশিয়াল ছাড়াই সব ফিচার ১০০% কার্যকর।
- **Production-Ready SFMC Client**: `.env`-এ Client ID ও Client Secret দিলে স্বয়ংক্রিয়ভাবে OAuth2 Bearer Token তৈরি, ক্যাশিং এবং লাইভ REST/SOAP API-এর সাথে কানেক্ট হয়।

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **HTTP Client**: [Axios](https://axios-http.com/)
- **API Spec**: Salesforce Marketing Cloud REST / SOAP / Postmonger Specification

