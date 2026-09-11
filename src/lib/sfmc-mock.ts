export interface SFMCField {
  name: string;
  type: 'Text' | 'Number' | 'Date' | 'Boolean' | 'EmailAddress' | 'Phone';
  isPrimaryKey: boolean;
  isRequired: boolean;
  length?: number;
  defaultValue?: string;
}

export interface SFMCDataExtension {
  id: string;
  name: string;
  customerKey: string;
  description: string;
  folder: string;
  rowCount: number;
  createdDate: string;
  modifiedDate: string;
  isSendable: boolean;
  sendableSubscriberField?: string;
  fields: SFMCField[];
  relatedDEs: {
    targetDE: string;
    sourceField: string;
    targetField: string;
    relationshipType: 'one-to-one' | 'one-to-many' | 'many-to-many';
  }[];
}

export interface JourneyActivityExecutionLog {
  id: string;
  timestamp: string;
  contactKey: string;
  journeyName: string;
  activityName: string;
  status: 'SUCCESS' | 'FAILED';
  inArguments: Record<string, unknown>;
  outArguments: Record<string, unknown>;
  errorMessage?: string;
}

// Mock Data Extensions
export const mockDataExtensions: SFMCDataExtension[] = [
  {
    id: "de-001",
    name: "Master_Customer_Profiles",
    customerKey: "Master_Customer_Profiles",
    description: "Centralized customer demographic and subscription profile table",
    folder: "Data Extensions / Core Marketing",
    rowCount: 245890,
    createdDate: "2025-01-15T08:30:00Z",
    modifiedDate: "2026-09-10T14:22:10Z",
    isSendable: true,
    sendableSubscriberField: "ContactKey",
    fields: [
      { name: "ContactKey", type: "Text", isPrimaryKey: true, isRequired: true, length: 50 },
      { name: "EmailAddress", type: "EmailAddress", isPrimaryKey: false, isRequired: true, length: 254 },
      { name: "FirstName", type: "Text", isPrimaryKey: false, isRequired: false, length: 100 },
      { name: "LastName", type: "Text", isPrimaryKey: false, isRequired: false, length: 100 },
      { name: "Phone", type: "Phone", isPrimaryKey: false, isRequired: false, length: 20 },
      { name: "Country", type: "Text", isPrimaryKey: false, isRequired: false, length: 50 },
      { name: "LoyaltyTier", type: "Text", isPrimaryKey: false, isRequired: false, length: 20 },
      { name: "OptInDate", type: "Date", isPrimaryKey: false, isRequired: false }
    ],
    relatedDEs: [
      {
        targetDE: "Ecom_Orders_History",
        sourceField: "ContactKey",
        targetField: "CustomerID",
        relationshipType: "one-to-many"
      },
      {
        targetDE: "Abandoned_Cart_Events",
        sourceField: "ContactKey",
        targetField: "SubscriberKey",
        relationshipType: "one-to-many"
      }
    ]
  },
  {
    id: "de-002",
    name: "Ecom_Orders_History",
    customerKey: "Ecom_Orders_History",
    description: "Daily transactional order updates synced via Automation Studio Query",
    folder: "Data Extensions / Transactions",
    rowCount: 874120,
    createdDate: "2025-02-10T11:00:00Z",
    modifiedDate: "2026-09-11T03:00:15Z",
    isSendable: false,
    fields: [
      { name: "OrderID", type: "Text", isPrimaryKey: true, isRequired: true, length: 50 },
      { name: "CustomerID", type: "Text", isPrimaryKey: false, isRequired: true, length: 50 },
      { name: "OrderDate", type: "Date", isPrimaryKey: false, isRequired: true },
      { name: "OrderTotal", type: "Number", isPrimaryKey: false, isRequired: true },
      { name: "Currency", type: "Text", isPrimaryKey: false, isRequired: true, length: 10 },
      { name: "OrderStatus", type: "Text", isPrimaryKey: false, isRequired: true, length: 50 },
      { name: "ItemsCount", type: "Number", isPrimaryKey: false, isRequired: false }
    ],
    relatedDEs: [
      {
        targetDE: "Master_Customer_Profiles",
        sourceField: "CustomerID",
        targetField: "ContactKey",
        relationshipType: "one-to-one"
      }
    ]
  },
  {
    id: "de-003",
    name: "Abandoned_Cart_Events",
    customerKey: "Abandoned_Cart_Events",
    description: "Real-time cart events trigger entry for Journey Builder",
    folder: "Data Extensions / Journey Audiences",
    rowCount: 14230,
    createdDate: "2025-05-18T09:12:00Z",
    modifiedDate: "2026-09-11T06:45:00Z",
    isSendable: true,
    sendableSubscriberField: "SubscriberKey",
    fields: [
      { name: "CartID", type: "Text", isPrimaryKey: true, isRequired: true, length: 50 },
      { name: "SubscriberKey", type: "Text", isPrimaryKey: false, isRequired: true, length: 50 },
      { name: "ProductNames", type: "Text", isPrimaryKey: false, isRequired: false, length: 500 },
      { name: "CartValue", type: "Number", isPrimaryKey: false, isRequired: true },
      { name: "CartURL", type: "Text", isPrimaryKey: false, isRequired: false, length: 500 },
      { name: "AbandonedAt", type: "Date", isPrimaryKey: false, isRequired: true },
      { name: "RecoveryDiscountCode", type: "Text", isPrimaryKey: false, isRequired: false, length: 50 }
    ],
    relatedDEs: [
      {
        targetDE: "Master_Customer_Profiles",
        sourceField: "SubscriberKey",
        targetField: "ContactKey",
        relationshipType: "one-to-one"
      }
    ]
  },
  {
    id: "de-004",
    name: "Custom_Activity_Execution_Audit",
    customerKey: "Custom_Activity_Execution_Audit",
    description: "Audit trail DE updated by custom Journey Builder Activities",
    folder: "Data Extensions / Logs",
    rowCount: 54100,
    createdDate: "2025-08-01T10:00:00Z",
    modifiedDate: "2026-09-11T07:15:00Z",
    isSendable: false,
    fields: [
      { name: "LogID", type: "Text", isPrimaryKey: true, isRequired: true, length: 100 },
      { name: "ContactKey", type: "Text", isPrimaryKey: false, isRequired: true, length: 50 },
      { name: "ActivityKey", type: "Text", isPrimaryKey: false, isRequired: true, length: 100 },
      { name: "TriggerTime", type: "Date", isPrimaryKey: false, isRequired: true },
      { name: "WebhookStatus", type: "Text", isPrimaryKey: false, isRequired: false, length: 50 },
      { name: "ResponsePayload", type: "Text", isPrimaryKey: false, isRequired: false, length: 4000 }
    ],
    relatedDEs: []
  }
];

export const mockExecutionLogs: JourneyActivityExecutionLog[] = [
  {
    id: "exec-101",
    timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    contactKey: "CUST-98231",
    journeyName: "Cart Abandonment Recovery 2026",
    activityName: "Smart Webhook & Loyalty Rewarder",
    status: "SUCCESS",
    inArguments: {
      contactKey: "CUST-98231",
      email: "alex.johnson@example.com",
      cartValue: 149.99,
      notificationChannel: "WhatsApp + SMS"
    },
    outArguments: {
      messageSent: true,
      rewardCode: "FLASH-20OFF",
      apiStatusCode: 200
    }
  },
  {
    id: "exec-102",
    timestamp: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
    contactKey: "CUST-44120",
    journeyName: "Welcome & Onboarding Stream",
    activityName: "Smart Webhook & Loyalty Rewarder",
    status: "SUCCESS",
    inArguments: {
      contactKey: "CUST-44120",
      email: "sarah.m@company.org",
      cartValue: 0,
      notificationChannel: "Email Webhook"
    },
    outArguments: {
      messageSent: true,
      rewardCode: "WELCOME-10",
      apiStatusCode: 200
    }
  },
  {
    id: "exec-103",
    timestamp: new Date(Date.now() - 1000 * 60 * 50).toISOString(),
    contactKey: "CUST-11002",
    journeyName: "Cart Abandonment Recovery 2026",
    activityName: "Smart Webhook & Loyalty Rewarder",
    status: "FAILED",
    inArguments: {
      contactKey: "CUST-11002",
      email: "invalid-user@temp-domain",
      cartValue: 79.50,
      notificationChannel: "WhatsApp"
    },
    outArguments: {},
    errorMessage: "Invalid destination phone number format in Contact Data"
  }
];
