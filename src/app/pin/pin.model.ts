export interface ValidateUserRequest {
  reference_id: string;
  lsp_user_key: string;
  lsp_user_mobile: string;
}

export interface ValidateUserResponse {
  is_request_success: boolean;
  error_message?: string;
}