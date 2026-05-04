import { createRow, deleteRow, getRowById, listRows, updateRow } from "./crud";
import type { ApiResult, InsertDto, Row, UpdateDto } from "../supabase/types";

const TABLE = "remedies" as const;

type Model = Row<typeof TABLE>;
type InsertModel = InsertDto<typeof TABLE>;
type UpdateModel = UpdateDto<typeof TABLE>;

export function listRemedies(): Promise<ApiResult<Model[]>> {
  return listRows(TABLE);
}

export function getRemedyById(id: string): Promise<ApiResult<Model>> {
  return getRowById(TABLE, id);
}

export function createRemedy(payload: InsertModel): Promise<ApiResult<Model>> {
  return createRow(TABLE, payload);
}

export function updateRemedy(id: string, patch: UpdateModel): Promise<ApiResult<Model>> {
  return updateRow(TABLE, id, patch);
}

export function deleteRemedy(id: string): Promise<ApiResult<{ id: string }>> {
  return deleteRow(TABLE, id);
}
