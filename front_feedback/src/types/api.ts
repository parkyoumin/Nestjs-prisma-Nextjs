export interface UnifiedResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
