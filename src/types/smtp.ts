
export interface SmtpConfig {
  id?: string;
  server: string;
  port: string;
  username: string;
  password: string;
  useSSL: boolean;
  updatedAt?: Date;
}
