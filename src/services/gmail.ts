import { EmailItem } from '../types';

export interface GmailAuthConfig {
  token: string | null;
  userEmail: string | null;
  isAuthenticated: boolean;
}

declare global {
  interface Window {
    google?: {
      accounts: {
        oauth2: {
          initTokenClient: (config: {
            client_id: string;
            scope: string;
            callback: (response: { access_token?: string; error?: string }) => void;
          }) => {
            requestAccessToken: () => void;
          };
        };
      };
    };
  }
}

// Fetch live messages from Gmail API using valid OAuth token
export async function fetchLiveGmailMessages(accessToken: string, maxResults = 10): Promise<EmailItem[]> {
  try {
    const listRes = await fetch(
      `https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=${maxResults}&q=in:inbox`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    if (!listRes.ok) {
      throw new Error(`Gmail API returned status ${listRes.status}`);
    }

    const listData = await listRes.json();
    const messages = listData.messages || [];

    const emailItems: EmailItem[] = [];

    for (const msg of messages.slice(0, 10)) {
      const msgRes = await fetch(
        `https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}?format=full`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      if (msgRes.ok) {
        const msgData = await msgRes.json();
        const headers = msgData.payload?.headers || [];
        
        const subject = headers.find((h: any) => h.name.toLowerCase() === 'subject')?.value || '(No Subject)';
        const from = headers.find((h: any) => h.name.toLowerCase() === 'from')?.value || 'Unknown Sender';
        const to = headers.find((h: any) => h.name.toLowerCase() === 'to')?.value || 'me';
        const date = headers.find((h: any) => h.name.toLowerCase() === 'date')?.value || new Date().toLocaleDateString();

        // Extract body snippet or text
        let snippet = msgData.snippet || '';
        if (msgData.payload?.body?.data) {
          try {
            snippet = atob(msgData.payload.body.data.replace(/-/g, '+').replace(/_/g, '/'));
          } catch (e) {
            snippet = msgData.snippet;
          }
        }

        const urlMatches = snippet.match(/(https?:\/\/[^\s]+)/g) || [];

        emailItems.push({
          id: msg.id,
          sender: from,
          senderName: from.split('<')[0]?.trim() || from,
          receiver: to,
          date,
          subject,
          body: snippet,
          urls: urlMatches,
          unread: msgData.labelIds?.includes('UNREAD'),
          sourceDataset: 'Gmail_Live',
          status: 'pending',
        });
      }
    }

    return emailItems;
  } catch (error) {
    console.error('Error fetching Gmail messages:', error);
    throw error;
  }
}
