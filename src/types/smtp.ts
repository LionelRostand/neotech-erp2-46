
export interface SmtpConfig {
  id?: string;
  // Outgoing SMTP configuration
  outgoingServer: string;
  outgoingPort: string;
  outgoingUsername: string;
  outgoingPassword: string;
  useOutgoingSSL: boolean;
  // Incoming mail configuration
  incomingServer: string;
  incomingPort: string;
  incomingUsername: string;
  incomingPassword: string;
  incomingProtocol: 'imap' | 'pop3';
  useIncomingSSL: boolean;
  updatedAt?: Date;
}
