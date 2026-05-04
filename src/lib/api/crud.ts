import { supabase } from "../supabase/client";
import type { ApiResult, InsertDto, Row, TableName, UpdateDto } from "../supabase/types";

export function toErrorMessage(error: unknown): string {
  if (typeof error === "string") return error;
  if (error && typeof error === "object" && "message" in error) {
    return String((error as { message: unknown }).message);
  }
  return "Unknown error";
}

export async function listRows<T extends TableName>(table: T): Promise<ApiResult<Row<T>[]>> {
  try {
    const { data, error } = await supabase.from(table).select("*");
    if (error) return { data: null, error: error.message };
    return { data: (data ?? []) as Row<T>[], error: null };
  } catch (error) {
    return { data: null, error: toErrorMessage(error) };
  }
}

export async function getRowById<T extends TableName>(table: T, id: string): Promise<ApiResult<Row<T>>> {
  try {
    const { data, error } = await supabase.from(table).select("*").eq("id", id).maybeSingle();
    if (error) return { data: null, error: error.message };
    return { data: data as Row<T> | null, error: null };
  } catch (error) {
    return { data: null, error: toErrorMessage(error) };
  }
}

export async function createRow<T extends TableName>(
  table: T,
  payload: InsertDto<T>
): Promise<ApiResult<Row<T>>> {
  try {
    const { data, error } = await supabase.from(table).insert(payload).select("*").single();
    if (error) return { data: null, error: error.message };
    return { data: data as Row<T>, error: null };
  } catch (error) {
    return { data: null, error: toErrorMessage(error) };
  }
}

export async function updateRow<T extends TableName>(
  table: T,
  id: string,
  patch: UpdateDto<T>
): Promise<ApiResult<Row<T>>> {
  try {
    const { data, error } = await supabase.from(table).update(patch).eq("id", id).select("*").single();
    if (error) return { data: null, error: error.message };
    return { data: data as Row<T>, error: null };
  } catch (error) {
    return { data: null, error: toErrorMessage(error) };
  }
}

export async function deleteRow<T extends TableName>(table: T, id: string): Promise<ApiResult<{ id: string }>> {
  try {
    const { error } = await supabase.from(table).delete().eq("id", id);
    if (error) return { data: null, error: error.message };
    return { data: { id }, error: null };
  } catch (error) {
    return { data: null, error: toErrorMessage(error) };
  }
}
