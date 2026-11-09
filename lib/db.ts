"use node";

import { neon } from "@neondatabase/serverless";
import "server-only";

let _sql: any = null;

export function getSql() {
  if (!_sql) {
    _sql = neon(process.env.DATABASE_URL!);
  }
  return _sql;
}

export function sql(strings: TemplateStringsArray, ...values: any[]): any {
  return getSql()(strings, ...values);
}