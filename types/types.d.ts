declare global {
  interface ApiResponse<T> {
    statusCode: number;
    success: boolean;
    message: string;
    data: T;
  }
}

export {};
