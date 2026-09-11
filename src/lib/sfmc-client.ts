import axios from 'axios';
import { mockDataExtensions, mockExecutionLogs, SFMCDataExtension, JourneyActivityExecutionLog } from './sfmc-mock';

export interface SFMCConfig {
  clientId?: string;
  clientSecret?: string;
  authSubdomain?: string;
  restSubdomain?: string;
  accountId?: string;
  useMock?: boolean;
}

export class SFMCClient {
  private config: SFMCConfig;
  private cachedToken: string | null = null;
  private tokenExpiresAt: number = 0;

  constructor() {
    this.config = {
      clientId: process.env.SFMC_CLIENT_ID,
      clientSecret: process.env.SFMC_CLIENT_SECRET,
      authSubdomain: process.env.SFMC_AUTH_SUBDOMAIN,
      restSubdomain: process.env.SFMC_REST_SUBDOMAIN,
      accountId: process.env.SFMC_ACCOUNT_ID,
      useMock: process.env.USE_MOCK !== 'false' // default to true (Mock Mode for learning)
    };
  }

  isMockMode(): boolean {
    return this.config.useMock || !this.config.clientId || !this.config.clientSecret;
  }

  // Get OAuth2 Access Token from SFMC
  async getAccessToken(): Promise<string> {
    if (this.isMockMode()) {
      return "mock_sfmc_oauth2_token_learning_env_xyz123";
    }

    if (this.cachedToken && Date.now() < this.tokenExpiresAt) {
      return this.cachedToken;
    }

    const authUrl = `https://${this.config.authSubdomain}.auth.marketingcloudapis.com/v2/token`;
    const res = await axios.post(authUrl, {
      grant_type: 'client_credentials',
      client_id: this.config.clientId,
      client_secret: this.config.clientSecret,
      account_id: this.config.accountId
    });

    this.cachedToken = res.data.access_token;
    this.tokenExpiresAt = Date.now() + (res.data.expires_in - 300) * 1000;
    return this.cachedToken as string;
  }

  // Fetch Data Extensions (Mock or Real REST API)
  async getDataExtensions(): Promise<SFMCDataExtension[]> {
    if (this.isMockMode()) {
      return mockDataExtensions;
    }

    const token = await this.getAccessToken();
    const res = await axios.get(`https://${this.config.restSubdomain}.rest.marketingcloudapis.com/data/v1/customobjects`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    return res.data.items || [];
  }

  // Fetch Execution logs
  getExecutionLogs(): JourneyActivityExecutionLog[] {
    return mockExecutionLogs;
  }

  // Record a new Execution Log from custom activity
  recordExecution(log: Omit<JourneyActivityExecutionLog, 'id' | 'timestamp'>): JourneyActivityExecutionLog {
    const newLog: JourneyActivityExecutionLog = {
      id: `exec-${Date.now()}`,
      timestamp: new Date().toISOString(),
      ...log
    };
    mockExecutionLogs.unshift(newLog);
    return newLog;
  }
}

export const sfmcClient = new SFMCClient();
