import { createRow, deleteRow, getRowById, listRows, updateRow } from "./crud";
import type { ApiResult, InsertDto, Row, UpdateDto } from "../supabase/types";

const TABLE = "community" as const;

type Model = Row<typeof TABLE>;
type InsertModel = InsertDto<typeof TABLE>;
type UpdateModel = UpdateDto<typeof TABLE>;

export function listCommunityPosts(): Promise<ApiResult<Model[]>> {
  return listRows(TABLE);
}

export function getCommunityPostById(id: string): Promise<ApiResult<Model>> {
  return getRowById(TABLE, id);
}

export function createCommunityPost(payload: InsertModel): Promise<ApiResult<Model>> {
  return createRow(TABLE, payload);
}

export function updateCommunityPost(id: string, patch: UpdateModel): Promise<ApiResult<Model>> {
  return updateRow(TABLE, id, patch);
}

export function deleteCommunityPost(id: string): Promise<ApiResult<{ id: string }>> {
  return deleteRow(TABLE, id);
}
