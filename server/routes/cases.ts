import { RequestHandler } from "express";

// Simple in-memory store - the main workflow logic is client-side
const casesStore: any[] = [];

export const listCases: RequestHandler = (_req, res) => {
  res.json(casesStore);
};

export const getCase: RequestHandler = (req, res) => {
  const { caseId } = req.params;
  const found = casesStore.find((c) => c.id === caseId);
  if (!found) return res.status(404).json({ error: "Not found" });
  res.json(found);
};

export const createCase: RequestHandler = (req, res) => {
  const body = req.body;
  const id = `CASE-${Date.now()}`;
  const newCase = { id, ...body };
  casesStore.unshift(newCase);
  res.status(201).json(newCase);
};

export const updateCase: RequestHandler = (req, res) => {
  const { id } = req.params;
  const body = req.body;
  const idx = casesStore.findIndex((c) => c.id === id);
  if (idx === -1) return res.status(404).json({ error: "Not found" });
  const updated = { ...casesStore[idx], ...body };
  casesStore[idx] = updated;
  res.json(updated);
};

export const deleteCase: RequestHandler = (req, res) => {
  const { id } = req.params;
  const idx = casesStore.findIndex((c) => c.id === id);
  if (idx === -1) return res.status(404).json({ error: "Not found" });
  casesStore.splice(idx, 1);
  res.status(204).end();
};
