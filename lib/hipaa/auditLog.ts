/**
 * lib/hipaa/auditLog.ts
 *
 * HIPAA-compliant audit logging. Logs ONLY action metadata — never PHI.
 * The audit_logs table stores: user_id, action_type, ip_address, timestamp.
 * Client names, body regions, report content, and any health data are
 * never written here.
 *
 * Errors are silently swallowed so a logging failure never blocks a request.
 * In a production HIPAA environment, route failures to a secondary log sink.
 */

import { createClient } from "@/lib/supabase/server";

export type AuditActionType =
  | "login"
  | "logout"
  | "ai_assessment_requested"
  | "report_saved"
  | "submit_report"
  | "view_dashboard"
  | "practitioner_viewed_client"
  | "practitioner_viewed_reports"
  | "practitioner_marked_reviewed"
  | "appointment_webhook_received";

/**
 * Log a HIPAA audit event.
 *
 * @param userId   - The Supabase auth user ID (uuid). Never pass email or name.
 * @param action   - One of the approved AuditActionType literals.
 * @param ipAddress - The client IP, extracted from x-forwarded-for header.
 */
export async function logAuditEvent(
  userId: string,
  action: AuditActionType,
  ipAddress: string
): Promise<void> {
  try {
    const supabase = await createClient();
    await supabase.from("audit_logs").insert({
      user_id: userId,
      action_type: action,
      ip_address: ipAddress,
    });
  } catch {
    // Intentionally silent — audit failures must not disrupt user requests.
  }
}

/**
 * Extract the client IP from a Request object.
 * Reads x-forwarded-for (set by proxies/load balancers) or x-real-ip.
 */
export function getClientIp(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    request.headers.get("x-real-ip") ??
    "unknown"
  );
}
