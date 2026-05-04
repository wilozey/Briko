import { createRow, deleteRow, getRowById, listRows, updateRow } from "./crud";
import type { ApiResult, InsertDto, Row, UpdateDto } from "../supabase/types";

const TABLE = "marketplace" as const;

type Model = Row<typeof TABLE>;
type InsertModel = InsertDto<typeof TABLE>;
type UpdateModel = UpdateDto<typeof TABLE>;

export function listMarketplaceItems(): Promise<ApiResult<Model[]>> {
  return listRows(TABLE);
}

export function getMarketplaceItemById(id: string): Promise<ApiResult<Model>> {
  return getRowById(TABLE, id);
}

export function createMarketplaceItem(payload: InsertModel): Promise<ApiResult<Model>> {
  return createRow(TABLE, payload);
}

export function updateMarketplaceItem(id: string, patch: UpdateModel): Promise<ApiResult<Model>> {
  return updateRow(TABLE, id, patch);
}

export function deleteMarketplaceItem(id: string): Promise<ApiResult<{ id: string }>> {
  return deleteRow(TABLE, id);
}
