export interface CallRequest {
  patientPhone: string
  doctorPhone: string
  callId: string // Used for tracking status in our DB
}

export interface CallResult {
  providerCallId: string
  status: string
}

export interface TelephonyProvider {
  /**
   * Initiates a proxied call between patient and doctor.
   * Returns a provider-specific call ID.
   */
  initiateProxiedCall(req: CallRequest): Promise<CallResult>
}
