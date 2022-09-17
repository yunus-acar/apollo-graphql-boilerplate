declare namespace NodeJS {
  export interface ProcessEnv extends NodeJS.ProcessEnv {
    PORT?: string;
    NODE_ENV?: "development" | "production";
    JWT_USER_SECRET: string;
    FRONTEND_URL: string;
    API_URL: string;
    REDIS_URL: string;
    SENDGRID_API_KEY: string;
    GCS_BUCKET_NAME: string;
  }
}
