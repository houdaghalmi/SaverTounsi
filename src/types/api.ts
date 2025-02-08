export type APIResponse<T> = {
  data: T;
  status: number;
  message: string;
};

export type APIError = {
  code: string;
  message: string;
  status: number;
  details?: Record<string, any>;
};

export class APIException extends Error {
  constructor(
    public code: string,
    public status: number,
    message: string,
    public details?: Record<string, any>
  ) {
    super(message);
    this.name = 'APIException';
  }
}
