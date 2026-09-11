'use client';

import React, { useState } from 'react';
import { Globe, Code2, Play, Copy, Check, Terminal, FileCode2, ShieldAlert, Cpu } from 'lucide-react';

interface SSJSRecipe {
  id: string;
  name: string;
  category: string;
  description: string;
  ssjsCode: string;
  simulatedOutput: Record<string, unknown> | string;
}

const ssjsRecipes: SSJSRecipe[] = [
  {
    id: 'wsproxy-de-fetch',
    name: 'WSProxy High-Speed Data Extension Query',
    category: 'CloudPage Backend API',
    description: 'Uses modern WSProxy inside a CloudPage to fetch customer rows as JSON up to 10x faster than traditional Core SOAP objects.',
    ssjsCode: `<script runat="server">
  Platform.Load("Core", "1");
  HTTPHeader.SetValue("Access-Control-Allow-Origin", "*");
  HTTPHeader.SetValue("Content-Type", "application/json");

  try {
    var prox = new Script.Util.WSProxy();
    var cols = ["ContactKey", "EmailAddress", "FirstName", "Country", "LoyaltyTier"];
    var filter = {
      Property: "LoyaltyTier",
      SimpleOperator: "equals",
      Value: "Gold"
    };

    var result = prox.retrieve("DataExtensionObject[Master_Customer_Profiles]", cols, filter);
    
    Write(Stringify({
      status: "success",
      count: result.Results.length,
      data: result.Results
    }));
  } catch (err) {
    Write(Stringify({ status: "error", message: String(err) }));
  }
</script>`,
    simulatedOutput: {
      status: "success",
      count: 2,
      data: [
        {
          ContactKey: "CUST-98231",
          EmailAddress: "alex.johnson@example.com",
          FirstName: "Alex",
          Country: "USA",
          LoyaltyTier: "Gold"
        },
        {
          ContactKey: "CUST-44120",
          EmailAddress: "sarah.m@company.org",
          FirstName: "Sarah",
          Country: "Canada",
          LoyaltyTier: "Gold"
        }
      ]
    }
  },
  {
    id: 'preference-center-submit',
    name: 'Preference Center Form Post Handler (SSJS Upsert)',
    category: 'Form Processing',
    description: 'Processes AJAX form submission from a CloudPage, validates payload, and upserts subscriber preferences into a Data Extension.',
    ssjsCode: `<script runat="server">
  Platform.Load("Core", "1");
  HTTPHeader.SetValue("Content-Type", "application/json");

  try {
    var postData = Platform.Request.GetPostData();
    var payload = Platform.Function.ParseJSON(postData);

    if (!payload.subscriberKey || !payload.email) {
      Write(Stringify({ status: "fail", message: "Missing required subscriber key" }));
    } else {
      var de = DataExtension.Init("Master_Customer_Profiles");
      
      // Upsert record into Data Extension
      var status = de.Rows.Upsert(
        ["ContactKey"], 
        [payload.subscriberKey], 
        ["EmailAddress", "OptInDate"], 
        [payload.email, Now()]
      );

      Write(Stringify({
        status: "success",
        rowsAffected: status,
        updatedSubscriber: payload.subscriberKey
      }));
    }
  } catch (ex) {
    Write(Stringify({ status: "error", detail: String(ex) }));
  }
</script>`,
    simulatedOutput: {
      status: "success",
      rowsAffected: 1,
      updatedSubscriber: "CUST-98231"
    }
  },
  {
    id: 'external-api-call',
    name: 'External REST API Call (HTTP.Post via SSJS)',
    category: 'Integrations',
    description: 'Invokes a 3rd-party webhook or payment gateway directly from a CloudPage script using Platform.Function.HTTPPost().',
    ssjsCode: `<script runat="server">
  Platform.Load("Core", "1");

  try {
    var endpoint = "https://api.external-loyalty.com/v1/verify-member";
    var payload = Stringify({ memberId: "CUST-98231", checkTier: true });
    var headers = ["Authorization", "Content-Type"];
    var headerValues = ["Bearer secret_api_token_xyz", "application/json"];

    var response = Platform.Function.HTTPPost(endpoint, "application/json", payload, headers, headerValues);
    
    // Parse response code and payload
    var statusCode = response.StatusCode;
    var responseBody = Platform.Function.ParseJSON(response.Response[0]);

    Write(Stringify({ httpCode: statusCode, result: responseBody }));
  } catch (err) {
    Write(Stringify({ status: "error", message: String(err) }));
  }
</script>`,
    simulatedOutput: {
      httpCode: 200,
      result: {
        verified: true,
        pointsBalance: 1250,
        eligibleForBonus: true
      }
    }
  }
];

export default function CloudPagesSSJSStudio() {
  const [selectedRecipe, setSelectedRecipe] = useState<SSJSRecipe>(ssjsRecipes[0]);
  const [ssjsCode, setSsjsCode] = useState(ssjsRecipes[0].ssjsCode);
  const [copied, setCopied] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState<Record<string, unknown> | string>(ssjsRecipes[0].simulatedOutput);

  const handleSelectRecipe = (recipe: SSJSRecipe) => {
    setSelectedRecipe(recipe);
    setSsjsCode(recipe.ssjsCode);
    setOutput(recipe.simulatedOutput);
  };

  const handleRunScript = () => {
    setIsRunning(true);
    setTimeout(() => {
      setIsRunning(false);
      setOutput(selectedRecipe.simulatedOutput);
    }, 500);
  };

  const copyCode = () => {
    navigator.clipboard.writeText(ssjsCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 border border-teal-800/40 rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-2 text-teal-400 font-semibold text-xs uppercase tracking-wider mb-1">
          <Globe className="w-4 h-4" />
          CloudPages & Server-Side JavaScript (SSJS) Runtime Studio
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">CloudPages SSJS & WSProxy Developer Workbench</h1>
        <p className="text-slate-400 text-sm mt-1">
          Build and test CloudPages backend scripts: WSProxy queries, preference center upserts, and external API webhooks.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sidebar Recipes */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden divide-y divide-slate-800">
          <div className="p-4 bg-slate-850 font-semibold text-sm text-slate-200 flex items-center justify-between">
            <span>Production SSJS Templates</span>
            <span className="text-xs text-slate-400 font-normal">{ssjsRecipes.length} recipes</span>
          </div>
          {ssjsRecipes.map((r) => (
            <button
              key={r.id}
              onClick={() => handleSelectRecipe(r)}
              className={`w-full text-left p-4 transition flex flex-col gap-1 ${
                selectedRecipe.id === r.id
                  ? 'bg-teal-500/15 border-l-4 border-teal-500'
                  : 'hover:bg-slate-800/40'
              }`}
            >
              <span className="text-xs text-teal-400 font-semibold uppercase">{r.category}</span>
              <span className="text-sm font-medium text-slate-200 mt-0.5">{r.name}</span>
            </button>
          ))}

          <div className="p-4 bg-slate-950/70 text-xs text-slate-400 space-y-2">
            <div className="font-semibold text-slate-300 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-teal-400" />
              SSJS Architecture Rules:
            </div>
            <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-400">
              <li>Must be enclosed in <code>&lt;script runat=&quot;server&quot;&gt;</code>.</li>
              <li>Always call <code>Platform.Load(&quot;Core&quot;, &quot;1&quot;)</code>.</li>
              <li>Prefer <strong>WSProxy</strong> over legacy <code>Platform.Function.*</code> for SOAP operations.</li>
              <li>Always wrap in <code>try &#123; ... &#125; catch (err)</code> blocks.</li>
            </ul>
          </div>
        </div>

        {/* Editor & Simulated Execution */}
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <FileCode2 className="w-5 h-5 text-teal-400" />
                  {selectedRecipe.name}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">{selectedRecipe.description}</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={copyCode}
                  className="px-3 py-1.5 text-xs text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition flex items-center gap-1.5"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied' : 'Copy SSJS'}
                </button>
                <button
                  onClick={handleRunScript}
                  disabled={isRunning}
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-500 rounded-lg transition shadow-md flex items-center gap-1.5"
                >
                  <Play className={`w-3.5 h-3.5 fill-white ${isRunning ? 'animate-spin' : ''}`} />
                  {isRunning ? 'Executing...' : 'Run in CloudPage Sandbox'}
                </button>
              </div>
            </div>

            {/* Code Textarea */}
            <div className="border border-slate-800 rounded-xl overflow-hidden">
              <div className="bg-slate-950 px-4 py-2 border-b border-slate-800 text-xs font-mono text-slate-400 flex items-center justify-between">
                <span>CloudPage Host Sandbox: <code className="text-teal-300">SFMC Cloud Server (ECMA 3 / SSJS)</code></span>
                <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-300">WSProxy Ready</span>
              </div>
              <textarea
                value={ssjsCode}
                onChange={(e) => setSsjsCode(e.target.value)}
                rows={12}
                className="w-full bg-slate-950 p-4 text-xs font-mono text-teal-300 focus:outline-none resize-y"
              />
            </div>

            {/* Response Preview */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-teal-400" />
                  Simulated CloudPage Output (HTTP Response)
                </span>
                <span className="text-[11px] text-slate-500">HTTP 200 OK — Content-Type: application/json</span>
              </div>
              <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 text-xs font-mono text-slate-200 overflow-x-auto max-h-60">
                <pre>{typeof output === 'string' ? output : JSON.stringify(output, null, 2)}</pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

