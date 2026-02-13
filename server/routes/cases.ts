import { RequestHandler } from "express";
import { db } from "../db";
import { cases } from "../db/schema";
import { eq, desc } from "drizzle-orm";

export const listCases: RequestHandler = async (_req, res) => {
  try {
    const allCases = await db.query.cases.findMany({
      orderBy: [desc(cases.createdAt)],
    });
    res.json(allCases);
  } catch (err) {
    console.error("Error listing cases:", err);
    res.status(500).json({ error: "Failed to fetch cases" });
  }
};

export const getCase: RequestHandler = async (req, res) => {
  const { caseId } = req.params;
  try {
    const found = await db.query.cases.findFirst({
      where: eq(cases.caseId, caseId),
    });
    if (!found) return res.status(404).json({ error: "Not found" });
    res.json(found);
  } catch (err) {
    console.error("Error getting case:", err);
    res.status(500).json({ error: "Failed to fetch case" });
  }
};

export const createCase: RequestHandler = async (req, res) => {
  const body = req.body;
  try {
    const [newCase] = await db.insert(cases).values({
      caseId: body.id || `CASE-${Date.now()}`,
      doctorName: body.doctorName,
      patientName: body.patientName,
      toothNumbers: body.toothNumbers,
      shade: body.shade,
      priority: body.priority,
      dateReceived: body.dateReceived ? new Date(body.dateReceived) : new Date(),
      dueDate: new Date(body.dueDate),
      specialInstructions: body.specialInstructions,
      category: body.category,
      impressionType: body.impressionType,
      classification: body.classification,
      implantType: body.implantType,
      fixedMaterial: body.fixedMaterial,
      technicalReviewResult: body.technicalReviewResult,
      removableSubType: body.removableSubType,
      nightGuardType: body.nightGuardType,
      nightGuardSize: body.nightGuardSize,
      addToothCount: body.addToothCount,
      orthodonticsType: body.orthodonticsType,
      isCustomProduct: body.isCustomProduct,
      customProductName: body.customProductName,
      currentStageIndex: body.currentStageIndex || 0,
      workflow: body.workflow || [],
      isPaused: body.isPaused || false,
      pauseHistory: body.pauseHistory || [],
      finalStatus: body.finalStatus,
    }).returning();
    res.status(201).json(newCase);
  } catch (err) {
    console.error("Error creating case:", err);
    res.status(500).json({ error: "Failed to create case" });
  }
};

export const updateCase: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const body = req.body;
  try {
    const [updated] = await db
      .update(cases)
      .set({
        ...body,
        dateReceived: body.dateReceived ? new Date(body.dateReceived) : undefined,
        dueDate: body.dueDate ? new Date(body.dueDate) : undefined,
        updatedAt: new Date(),
      })
      .where(eq(cases.caseId, id))
      .returning();
    
    if (!updated) return res.status(404).json({ error: "Not found" });
    res.json(updated);
  } catch (err) {
    console.error("Error updating case:", err);
    res.status(500).json({ error: "Failed to update case" });
  }
};

export const deleteCase: RequestHandler = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await db.delete(cases).where(eq(cases.caseId, id)).returning();
    if (deleted.length === 0) return res.status(404).json({ error: "Not found" });
    res.status(204).end();
  } catch (err) {
    console.error("Error deleting case:", err);
    res.status(500).json({ error: "Failed to delete case" });
  }
};
