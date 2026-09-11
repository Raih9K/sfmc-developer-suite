import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const host = request.headers.get('host') || 'localhost:3000';
  const protocol = host.includes('localhost') ? 'http' : 'https';
  const baseUrl = `${protocol}://${host}`;

  // Standard SFMC Journey Builder Custom Activity config.json specification
  const config = {
    workflowApiVersion: "1.1",
    metaData: {
      icon: `${baseUrl}/icon.png`,
      iconSmall: `${baseUrl}/icon.png`,
      category: "message"
    },
    type: "REST",
    lang: {
      "en-US": {
        name: "Smart Webhook & Loyalty Rewarder",
        description: "Executes custom business logic, sends webhook notifications, and generates loyalty rewards for contacts in Journey Builder."
      }
    },
    arguments: {
      // Inputs passed into the activity upon execution
      execute: {
        inArguments: [
          {
            contactKey: "{{Contact.Key}}"
          },
          {
            email: "{{InteractionDefaults.Email}}"
          },
          {
            cartValue: "{{Event.Cart_Abandonment_Event.CartValue}}"
          },
          {
            notificationChannel: "WhatsApp + SMS"
          }
        ],
        outArguments: [
          {
            messageSent: "Boolean"
          },
          {
            rewardCode: "Text"
          },
          {
            apiStatusCode: "Number"
          }
        ],
        url: `${baseUrl}/api/activity/execute`,
        verb: "POST",
        body: "",
        header: "",
        format: "json",
        useJwt: false,
        timeout: 10000
      }
    },
    configurationArguments: {
      applicationExtensionKey: "smart-webhook-loyalty-activity",
      save: {
        url: `${baseUrl}/api/activity/save`,
        verb: "POST",
        useJwt: false
      },
      publish: {
        url: `${baseUrl}/api/activity/publish`,
        verb: "POST",
        useJwt: false
      },
      validate: {
        url: `${baseUrl}/api/activity/validate`,
        verb: "POST",
        useJwt: false
      },
      stop: {
        url: `${baseUrl}/api/activity/stop`,
        verb: "POST",
        useJwt: false
      }
    },
    wizardSteps: [
      { label: "Step 1: Configure Action", key: "step1" },
      { label: "Step 2: Confirm & Map Fields", key: "step2" }
    ],
    userInterfaces: {
      configModal: {
        height: 600,
        width: 850,
        fullscreen: false
      }
    },
    schema: {
      arguments: {
        execute: {
          inArguments: [],
          outArguments: []
        }
      }
    }
  };

  return NextResponse.json(config, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json'
    }
  });
}
