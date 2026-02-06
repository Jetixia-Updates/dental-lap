import { RequestHandler } from "express";
import { CaseModel } from "@shared/api";

// In-memory store for demo purposes
const casesStore: CaseModel[] = [
  {
    id: "1",
    caseId: "CASE-2024-001",
    doctor: "Dr. John Smith",
    patientName: "Jane Doe",
    caseType: "Zirconia Crown",
    material: "Zirconia",
    shade: "A2",
    tooth: "#14",
    status: "design",
    priority: "high",
    dueDate: "2024-02-15",
    dateCreated: "2024-02-08",
    notes: "Patient has high smile line. Ensure natural emergence profile.",
  },
];

export const listCases: RequestHandler = (_req, res) => {
  res.json(casesStore);
};

export const getCase: RequestHandler = (req, res) => {
  const { caseId } = req.params;
  const found = casesStore.find((c) => c.caseId === caseId || c.id === caseId);
  if (!found) return res.status(404).json({ error: "Not found" });
  res.json(found);
};

export const createCase: RequestHandler = (req, res) => {
  const body = req.body as Partial<CaseModel>;
  const id = Date.now().toString();
  const nextNumber = casesStore.length > 0 ? Math.max(...casesStore.map((c) => parseInt(c.caseId.split("-").pop() || "0"))) + 1 : 1;
  const newCase: CaseModel = {
    id,
    caseId: `CASE-2024-${String(nextNumber).padStart(3, "0")}`,
    doctor: body.doctor || "",
    patientName: body.patientName || "",
    caseType: body.caseType || "",
    material: body.material || "",
    shade: body.shade || "A2",
    tooth: body.tooth || "",
    status: (body.status as any) || "intake",
    priority: (body.priority as any) || "medium",
    dueDate: body.dueDate || new Date().toISOString().split("T")[0],
    dateCreated: new Date().toISOString().split("T")[0],
    notes: body.notes || "",
  };
  casesStore.unshift(newCase);
  res.status(201).json(newCase);
};

export const updateCase: RequestHandler = (req, res) => {
  const { id } = req.params;
  const body = req.body as Partial<CaseModel>;
  const idx = casesStore.findIndex((c) => c.id === id || c.caseId === id);
  if (idx === -1) return res.status(404).json({ error: "Not found" });
  const updated = { ...casesStore[idx], ...body };
  casesStore[idx] = updated;
  res.json(updated);
};

export const deleteCase: RequestHandler = (req, res) => {
  const { id } = req.params;
  const idx = casesStore.findIndex((c) => c.id === id || c.caseId === id);
  if (idx === -1) return res.status(404).json({ error: "Not found" });
  casesStore.splice(idx, 1);
  res.status(204).end();
};
