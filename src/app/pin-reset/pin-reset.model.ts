export interface ResetPinRequest {
  lsp_user_pin: string;
  lsp_user_mobile: string;
  request_type: string;
  reference_id: string;
  lsp_user_key: string;
  otp: string;
}

export interface ResetPinResponse {
  is_request_success?: boolean;
  error_message: string;
  session_valid?: boolean;
}