/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}

export type CaseStatus =
  | "intake"
  | "planning"
  | "design"
  | "production"
  | "qc"
  | "delivery";

export interface CaseModel {
  id: string;
  caseId: string;
  doctor: string;
  patientName: string;
  caseType: string;
  material: string;
  shade: string;
  tooth: string;
  status: CaseStatus;
  priority: "low" | "medium" | "high";
  dueDate: string;
  dateCreated: string;
  notes: string;
}
