import { pgTable, text, serial, timestamp, boolean, integer, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const cases = pgTable("cases", {
  id: serial("id").primaryKey(),
  caseId: text("case_id").notNull().unique(), // e.g., CASE-001
  doctorName: text("doctor_name").notNull(),
  patientName: text("patient_name").notNull(),
  toothNumbers: text("tooth_numbers"),
  shade: text("shade"),
  priority: text("priority").notNull().default("normal"), // "normal" | "rush" | "emergency"
  dateReceived: timestamp("date_received").notNull().defaultNow(),
  dueDate: timestamp("due_date").notNull(),
  specialInstructions: text("special_instructions"),
  category: text("category").notNull(), // "fixed" | "removable" | "orthodontics"
  
  // Fixed-specific
  impressionType: text("impression_type"),
  classification: text("classification"),
  implantType: text("implant_type"),
  fixedMaterial: text("fixed_material"),
  technicalReviewResult: text("technical_review_result"),
  
  // Removable-specific
  removableSubType: text("removable_sub_type"),
  nightGuardType: text("night_guard_type"),
  nightGuardSize: integer("night_guard_size"),
  addToothCount: integer("add_tooth_count"),
  
  // Orthodontics-specific
  orthodonticsType: text("orthodontics_type"),
  
  // Custom product
  isCustomProduct: boolean("is_custom_product").default(false),
  customProductName: text("custom_product_name"),
  
  // Status and Workflow
  currentStageIndex: integer("current_stage_index").notNull().default(0),
  workflow: jsonb("workflow").notNull(), // Array of WorkflowStep
  isPaused: boolean("is_paused").default(false),
  pauseHistory: jsonb("pause_history").default([]),
  finalStatus: text("final_status"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const staff = pgTable("staff", {
  id: serial("id").primaryKey(),
  staffId: text("staff_id").notNull().unique(), // e.g., staff-1
  name: text("name").notNull(),
  department: text("department").notNull(),
  role: text("role").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone"),
  status: text("status").notNull().default("active"),
});

export const caseNotes = pgTable("case_notes", {
  id: serial("id").primaryKey(),
  caseId: text("case_id").notNull(),
  author: text("author").notNull(),
  note: text("note").notNull(),
  type: text("type").notNull(), // "update" | "issue" | "feedback" | "pause" | "resume"
  timestamp: timestamp("timestamp").defaultNow(),
});

export const attachments = pgTable("attachments", {
  id: serial("id").primaryKey(),
  caseId: text("case_id").notNull(),
  name: text("name").notNull(),
  url: text("url").notNull(),
  type: text("type").notNull(),
  uploadedAt: timestamp("uploaded_at").defaultNow(),
  uploadedBy: text("uploaded_by").notNull(),
});

export const insertCaseSchema = createInsertSchema(cases);
export const selectCaseSchema = createSelectSchema(cases);
export type InsertCase = z.infer<typeof insertCaseSchema>;
export type Case = z.infer<typeof selectCaseSchema>;

export const insertStaffSchema = createInsertSchema(staff);
export const selectStaffSchema = createSelectSchema(staff);
export type Staff = z.infer<typeof selectStaffSchema>;
