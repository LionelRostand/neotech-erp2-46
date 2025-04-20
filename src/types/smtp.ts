
export interface SmtpConfig {
  id?: string;
  // Outgoing SMTP settings
  outgoing: {
    server: string;
    port: string;
    username: string;
    password: string;
    useSSL: boolean;
  };
  // Incoming mail settings
  incoming: {
    server: string;
    port: string;
    username: string;
    password: string;
    useSSL: boolean;
    protocol: 'imap' | 'pop3';
  };
  updatedAt?: Date;
}
