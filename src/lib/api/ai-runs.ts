import { createRow, deleteRow, getRowById, listRows, updateRow } from "./crud";
import type { ApiResult, InsertDto, Row, UpdateDto } from "../supabase/types";

const TABLE = "ai_runs" as const;

type Model = Row<typeof TABLE>;
type InsertModel = InsertDto<typeof TABLE>;
type UpdateModel = UpdateDto<typeof TABLE>;

export function listAiRuns(): Promise<ApiResult<Model[]>> {
  return listRows(TABLE);
}

export function getAiRunById(id: string): Promise<ApiResult<Model>> {
  return getRowById(TABLE, id);
}

export function createAiRun(payload: InsertModel): Promise<ApiResult<Model>> {
  return createRow(TABLE, payload);
}

export function updateAiRun(id: string, patch: UpdateModel): Promise<ApiResult<Model>> {
  return updateRow(TABLE, id, patch);
}

export function deleteAiRun(id: string): Promise<ApiResult<{ id: string }>> {
  return deleteRow(TABLE, id);
}
