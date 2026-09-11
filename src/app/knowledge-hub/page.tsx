'use client';

import React, { useState } from 'react';
import { Code2, Database, Cpu, Globe, FileCode2, Copy, Check } from 'lucide-react';

interface Concept {
  id: string;
  title: string;
  category: string;
  description: string;
  snippetTitle: string;
  language: string;
  code: string;
  keyTakeaways: string[];
}

const concepts: Concept[] = [
  {
    id: 'ampscript',
    title: 'AMPscript Personalization & DE Lookup',
    category: 'Scripting & Programmatic',
    description: 'Linear, platform-specific scripting language used to inject subscriber data, perform lookups, and execute conditional logic within emails, CloudPages, and SMS.',
    snippetTitle: 'AMPscript Lookup & Conditional Greeting',
    language: 'ampscript',
    code: `%%[
  /* Retrieve subscriber data from Data Extension */
  SET @subKey = _subscriberkey
  SET @firstName = AttributeValue("FirstName")
  SET @orderRows = LookupRows("Ecom_Orders_History", "CustomerID", @subKey)
  SET @rowCount = RowCount(@orderRows)

  IF @rowCount > 0 THEN
    SET @firstOrderRow = Row(@orderRows, 1)
    SET @lastOrderTotal = Field(@firstOrderRow, "OrderTotal")
    SET @vipStatus = "Valued Customer"
  ELSE
    SET @lastOrderTotal = 0
    SET @vipStatus = "New Explorer"
  ENDIF
]%%

<h2>Hello %%=v(@firstName)=%%, you are a %%=v(@vipStatus)=%%!</h2>
<p>Your last order total was: $%%=v(@lastOrderTotal)=%%</p>`,
    keyTakeaways: [
      'Executes at send time for every subscriber.',
      'Use LookupRows() to retrieve relational multi-row data.',
      'Case-insensitive syntax, but sensitive to DE field names.'
    ]
  },
  {
    id: 'ssjs-wsproxy',
    title: 'Server-Side JavaScript (SSJS) & WSProxy',
    category: 'Scripting & Programmatic',
    description: 'Executed on SFMC servers, SSJS is ideal for complex JSON manipulations, loops, API integrations, and WSProxy SOAP operations inside CloudPages or Script Activities.',
    snippetTitle: 'WSProxy Query to Retrieve Data Extension Rows',
    language: 'javascript',
    code: `<script runat="server">
  Platform.Load("Core", "1");
  try {
    var prox = new Script.Util.WSProxy();
    var cols = ["ContactKey", "EmailAddress", "LoyaltyTier"];
    var filter = {
      Property: "LoyaltyTier",
      SimpleOperator: "equals",
      Value: "Gold"
    };
    
    var desc = prox.retrieve("DataExtensionObject[Master_Customer_Profiles]", cols, filter);
    Write(Stringify(desc.Results));
  } catch (err) {
    Write("Error: " + Stringify(err));
  }
</script>`,
    keyTakeaways: [
      'WSProxy is up to 10x faster than standard SSJS SOAP objects.',
      'Native support for JSON parsing (JSON.stringify / parse).',
      'Cannot directly be used for high-volume email body personalization due to performance overhead.'
    ]
  },
  {
    id: 'sql-views',
    title: 'SQL Query Activities & System Data Views',
    category: 'Data Processing & Automation',
    description: 'Specialized T-SQL queries run in Automation Studio to join audience DEs with hidden System Data Views tracking 6 months of behavioral email stats.',
    snippetTitle: 'SQL: Find Subscribers Who Opened But Never Clicked',
    language: 'sql',
    code: `SELECT 
    sub.SubscriberKey,
    sub.EmailAddress,
    sent.EventDate AS SentTime,
    open.EventDate AS OpenTime
FROM _Subscribers sub
JOIN _Sent sent 
    ON sub.SubscriberKey = sent.SubscriberKey
JOIN _Open open 
    ON sent.JobID = open.JobID 
    AND sent.ListID = open.ListID 
    AND sent.BatchID = open.BatchID 
    AND sent.SubscriberKey = open.SubscriberKey
LEFT JOIN _Click click 
    ON sent.JobID = click.JobID 
    AND sent.SubscriberKey = click.SubscriberKey
WHERE click.SubscriberKey IS NULL
  AND sent.EventDate >= DATEADD(day, -30, GETDATE())`,
    keyTakeaways: [
      'System views (_Sent, _Open, _Click, _Bounce, _JourneyActivity) retain 180 days of history.',
      'Queries run on a 30-minute hard timeout in Automation Studio.',
      'Target DE must already be created with matching schemas.'
    ]
  },
  {
    id: 'rest-transactional',
    title: 'REST Transactional Messaging API',
    category: 'APIs & System Integration',
    description: 'Engineered for sub-second, mission-critical messages (password resets, order receipts, OTPs) with immediate delivery tracking.',
    snippetTitle: 'REST POST /messaging/v1/email/messages',
    language: 'json',
    code: `POST https://mcxxxx-xxxxxxxxxxxxxx.rest.marketingcloudapis.com/messaging/v1/email/messages/rec-9872138
Content-Type: application/json
Authorization: Bearer mock_sfmc_oauth2_token_learning_env_xyz123

{
  "definitionKey": "order_confirmation_v1",
  "recipient": {
    "contactKey": "CUST-98231",
    "to": "alex.johnson@example.com",
    "attributes": {
      "FirstName": "Alex",
      "OrderTotal": "$149.99",
      "TrackingNumber": "TRK-2026-BD9"
    }
  }
}`,
    keyTakeaways: [
      'Guarantees highest priority queue in Marketing Cloud MTA.',
      'Bypasses Automation Studio batch queues for real-time firing.',
      'Returns a delivery token to query immediate status.'
    ]
  },
  {
    id: 'postmonger',
    title: 'Journey Builder Postmonger Protocol',
    category: 'Journey Builder Extensibility',
    description: 'The postMessage event bus between the Journey Builder canvas iframe and your custom activity configuration UI.',
    snippetTitle: 'Postmonger Event Handshake Lifecycle',
    language: 'javascript',
    code: `// 1. Initialize Postmonger Session
const connection = new Postmonger.Session();

// 2. Journey Builder asks if iframe is ready
connection.trigger('ready');

// 3. Canvas sends existing config back to our modal
connection.on('initActivity', function(payload) {
  currentActivity = payload;
  document.getElementById('channelSelect').value = 
    payload.arguments.execute.inArguments[3].notificationChannel;
});

// 4. Marketer clicks "Done" on Journey Builder canvas
connection.on('clickedNext', function() {
  currentActivity.arguments.execute.inArguments = [
    { contactKey: "{{Contact.Key}}" },
    { email: "{{InteractionDefaults.Email}}" }
  ];
  currentActivity.metaData.isConfigured = true;
  connection.trigger('updateActivity', currentActivity);
});`,
    keyTakeaways: [
      'Postmonger acts as cross-origin communication bridge.',
      'The configuration JSON is stored directly inside the Journey definition in SFMC.',
      'Works in tandem with config.json endpoints.'
    ]
  }
];

export default function KnowledgeHubPage() {
  const [selectedConcept, setSelectedConcept] = useState<Concept>(concepts[0]);
  const [copied, setCopied] = useState(false);

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-800/40 rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-2 text-indigo-400 font-semibold text-xs uppercase tracking-wider mb-1">
          <Code2 className="w-4 h-4" />
          SFMC Developer Knowledge Hub & Playbook
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Salesforce Marketing Cloud Core Concepts</h1>
        <p className="text-slate-400 text-sm mt-1">
          Essential developer pillars: AMPscript, SSJS / WSProxy, SQL Data Views, Transactional APIs, and Journey Custom Activities.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Topics List */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden divide-y divide-slate-800">
          <div className="p-4 bg-slate-850 font-semibold text-sm text-slate-200">
            Development Modules
          </div>
          {concepts.map((concept) => (
            <button
              key={concept.id}
              onClick={() => setSelectedConcept(concept)}
              className={`w-full text-left p-4 transition flex flex-col gap-1 ${
                selectedConcept.id === concept.id
                  ? 'bg-blue-600/15 border-l-4 border-blue-500'
                  : 'hover:bg-slate-800/40'
              }`}
            >
              <span className="text-xs uppercase tracking-wider text-blue-400 font-semibold">
                {concept.category}
              </span>
              <span className="text-sm font-medium text-slate-200">{concept.title}</span>
            </button>
          ))}
        </div>

        {/* Content & Code Panel */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-5">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider font-semibold text-blue-400">
                  {selectedConcept.category}
                </span>
              </div>
              <h2 className="text-xl font-bold text-white mt-1">{selectedConcept.title}</h2>
              <p className="text-sm text-slate-300 mt-2 leading-relaxed">{selectedConcept.description}</p>
            </div>

            {/* Code Snippet Box */}
            <div className="border border-slate-800 rounded-xl overflow-hidden">
              <div className="bg-slate-950 px-4 py-2.5 flex items-center justify-between border-b border-slate-800">
                <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
                  <FileCode2 className="w-4 h-4 text-blue-400" />
                  {selectedConcept.snippetTitle}
                </div>
                <button
                  onClick={() => copyCode(selectedConcept.code)}
                  className="flex items-center gap-1 text-xs text-slate-400 hover:text-white transition"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
              <div className="bg-slate-950 p-4 text-xs font-mono text-slate-200 overflow-x-auto max-h-80">
                <pre>{selectedConcept.code}</pre>
              </div>
            </div>

            {/* Key Takeaways */}
            <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-4">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Key Developer Takeaways
              </h3>
              <ul className="space-y-1.5 text-xs text-slate-400">
                {selectedConcept.keyTakeaways.map((point, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-blue-400 font-bold">•</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
