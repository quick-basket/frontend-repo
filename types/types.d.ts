declare global {
  interface ApiResponse<T> {
    statusCode: number;
    success: boolean;
    message: string;
    data: T;
  }
  interface Banner {
    id: number;
    imageUrl: string;
    link: string;
    alt: string;
  }
}

export {};
