export type Role = "client" | "practitioner";
export type ReportStatus = "pending" | "reviewed";
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

export interface ClientProfile {
  id: string;
  email: string;
  full_name: string | null;
  notes: string | null;
  role: Role;
  created_at: string;
}

export interface PainSpotRecord {
  regionId: string;
  label: string;
  size: "pinpoint" | "regional" | "diffuse";
  intensity: number;
  cx: number;
  cy: number;
  view: "front" | "back";
}

export interface ActivityNote {
  regionId: string;
  label: string;
  activityText: string;
}

export interface AiAssessment {
  region: string;
  movement_category: string;
  likely_muscles_affected: string[];
  compensation_chain_risk: "low" | "medium" | "high";
  correlation_notes: string;
}

export interface PainReport {
  id: string;
  client_id: string;
  reported_at: string;
  spots: PainSpotRecord[];
  activity_notes: ActivityNote[];
  ai_interpretation: { assessments?: AiAssessment[] } | null;
  overall_intensity: number | null;
  duration: string | null;
  worse_with: string | null;
  better_with: string | null;
  notes: string | null;
  created_at: string;
}

export interface SubmittedReport {
  id: string;
  report_id: string;
  client_id: string;
  status: ReportStatus;
  submitted_at: string;
  reviewed_at: string | null;
  practitioner_notes: string | null;
}

export interface SubmittedReportWithDetails extends SubmittedReport {
  pain_reports: PainReport & {
    client_profiles: ClientProfile;
  };
}

export interface Appointment {
  id: string;
  client_id: string | null;
  acuity_appointment_id: string;
  appointment_at: string;
  summary_json: {
    most_frequent_regions?: string[];
    dominant_movement_category?: string;
    intensity_trend?: "escalating" | "improving" | "stable";
    compensation_risk_level?: "low" | "medium" | "high";
    session_note?: string;
  } | null;
  created_at: string;
}

export interface AuditLog {
  id: string;
  user_id: string;
  action_type: AuditActionType;
  ip_address: string;
  created_at: string;
}
