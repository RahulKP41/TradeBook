export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

export interface HealthData {
  status: "ok";
  uptime: number;
  timestamp: string;
}

export interface ReadyData {
  database: "up" | "down";
}