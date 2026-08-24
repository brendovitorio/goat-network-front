function escapeCsvCell(value: unknown): string {
  const str = value === null || value === undefined ? "" : String(value);
  if (/[",\n;]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function triggerDownload(filename: string, content: string, mime: string) {
  const blob = new Blob([content], { type: `${mime};charset=utf-8;` });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function downloadCsv(filename: string, headers: string[], rows: unknown[][]) {
  const lines = [headers, ...rows].map((row) => row.map(escapeCsvCell).join(","));
  triggerDownload(filename, lines.join("\r\n"), "text/csv");
}

export function downloadText(filename: string, content: string) {
  triggerDownload(filename, content, "text/plain");
}

export const EXCEL_COLORS = {
  gold: "FFE2A748",
  ink: "FF1A1508",
  red: "FFEF4444",
  amber: "FFF59E0B",
  green: "FF10B981",
  border: "FFE7E1D2",
} as const;

const GOAT_GOLD = EXCEL_COLORS.gold;
const GOAT_INK = EXCEL_COLORS.ink;
const GOAT_BORDER = EXCEL_COLORS.border;

export interface ExcelKpi {
  label: string;
  value: string | number;
  color?: string;
}

export interface ExcelBreakdownRow {
  label: string;
  count: number;
  color?: string;
}

export interface ExcelSummary {
  kpis: ExcelKpi[];
  breakdownTitle?: string;
  breakdown?: ExcelBreakdownRow[];
}

function addDataBar(sheet: any, ref: string, color: string) {
  sheet.addConditionalFormatting({
    ref,
    rules: [
      {
        type: "dataBar",
        cfvo: [{ type: "min" }, { type: "max" }],
        color: { argb: color },
        gradient: false,
        border: false,
      },
    ],
  });
}

function buildSummarySheet(workbook: any, title: string, summary: ExcelSummary) {
  const sheet = workbook.addWorksheet("Resumo", { views: [{ showGridLines: false }] });
  sheet.getColumn(1).width = 3;
  for (let i = 2; i <= 9; i++) sheet.getColumn(i).width = 13;

  sheet.mergeCells(2, 2, 2, 9);
  const titleCell = sheet.getCell(2, 2);
  titleCell.value = title;
  titleCell.font = { bold: true, size: 16, color: { argb: GOAT_GOLD } };
  sheet.getRow(2).height = 28;

  sheet.mergeCells(3, 2, 3, 9);
  const subCell = sheet.getCell(3, 2);
  subCell.value = `Gerado em ${new Date().toLocaleString("pt-BR")}`;
  subCell.font = { italic: true, size: 9, color: { argb: "FF8A8370" } };

  let col = 2;
  const row = 5;
  summary.kpis.forEach((kpi) => {
    const fill = kpi.color || "FF1F1B10";
    sheet.mergeCells(row, col, row, col + 1);
    const labelCell = sheet.getCell(row, col);
    labelCell.value = kpi.label;
    labelCell.font = { size: 9, bold: true, color: { argb: kpi.color ? "FFFFFFFF" : "FF8A8370" } };
    labelCell.alignment = { vertical: "middle" };
    labelCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: fill } };

    sheet.mergeCells(row + 1, col, row + 2, col + 1);
    const valueCell = sheet.getCell(row + 1, col);
    valueCell.value = kpi.value;
    valueCell.font = { bold: true, size: 20, color: { argb: kpi.color ? "FFFFFFFF" : GOAT_GOLD } };
    valueCell.alignment = { vertical: "middle", horizontal: "center" };
    valueCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: fill } };

    col += 2;
  });
  sheet.getRow(row).height = 18;
  sheet.getRow(row + 1).height = 24;
  sheet.getRow(row + 2).height = 24;

  if (summary.breakdown && summary.breakdown.length > 0) {
    const startRow = row + 5;
    sheet.mergeCells(startRow, 2, startRow, 9);
    const breakdownTitleCell = sheet.getCell(startRow, 2);
    breakdownTitleCell.value = summary.breakdownTitle || "Detalhamento";
    breakdownTitleCell.font = { bold: true, size: 12, color: { argb: GOAT_GOLD } };

    const tableHeaderRow = startRow + 1;
    sheet.getCell(tableHeaderRow, 2).value = "Item";
    sheet.getCell(tableHeaderRow, 5).value = "Quantidade";
    [2, 5].forEach((c) => {
      const cell = sheet.getCell(tableHeaderRow, c);
      cell.font = { bold: true, color: { argb: GOAT_INK } };
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: GOAT_GOLD } };
    });

    summary.breakdown.forEach((b, i) => {
      const r = tableHeaderRow + 1 + i;
      sheet.mergeCells(r, 2, r, 4);
      const labelCell = sheet.getCell(r, 2);
      labelCell.value = b.label;
      labelCell.border = { bottom: { style: "thin", color: { argb: GOAT_BORDER } } };

      const countCell = sheet.getCell(r, 5);
      countCell.value = b.count;
      countCell.font = { bold: true, color: { argb: b.color || GOAT_INK } };
      countCell.border = { bottom: { style: "thin", color: { argb: GOAT_BORDER } } };
    });

    const lastRow = tableHeaderRow + summary.breakdown.length;
    addDataBar(sheet, `E${tableHeaderRow + 1}:E${lastRow}`, GOAT_GOLD);
  }
}

export async function downloadStyledExcel(
  filename: string,
  headers: string[],
  rows: (string | number)[][],
  options?: {
    sheetName?: string;
    title?: string;
    colorColumn?: number;
    colorFn?: (value: string | number) => string | undefined;
    dataBarColumn?: number;
    summary?: ExcelSummary;
  },
) {
  const ExcelJS = (await import("exceljs")).default;
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Goat Network";
  workbook.created = new Date();

  if (options?.summary) {
    buildSummarySheet(workbook, options.title || "Resumo", options.summary);
  }

  const sheet = workbook.addWorksheet(options?.sheetName || "Dados", {
    views: [{ state: "frozen", ySplit: options?.title ? 3 : 1 }],
  });

  let headerRowIndex = 1;

  if (options?.title) {
    sheet.mergeCells(1, 1, 1, headers.length);
    const titleCell = sheet.getCell(1, 1);
    titleCell.value = options.title;
    titleCell.font = { bold: true, size: 14, color: { argb: GOAT_GOLD } };
    titleCell.alignment = { vertical: "middle" };
    sheet.getRow(1).height = 26;

    sheet.mergeCells(2, 1, 2, headers.length);
    const subCell = sheet.getCell(2, 1);
    subCell.value = `Exportado em ${new Date().toLocaleString("pt-BR")}`;
    subCell.font = { italic: true, size: 9, color: { argb: "FF8A8370" } };
    headerRowIndex = 3;
  }

  sheet.columns = headers.map((h) => ({ width: Math.max(14, h.length + 4) }));

  const headerRow = sheet.getRow(headerRowIndex);
  headers.forEach((h, i) => {
    const cell = headerRow.getCell(i + 1);
    cell.value = h;
    cell.font = { bold: true, color: { argb: GOAT_INK } };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: GOAT_GOLD } };
    cell.alignment = { vertical: "middle" };
    cell.border = { bottom: { style: "medium", color: { argb: GOAT_INK } } };
  });
  headerRow.height = 22;

  rows.forEach((r) => {
    const row = sheet.addRow(r);
    row.eachCell((cell) => {
      cell.border = { bottom: { style: "thin", color: { argb: GOAT_BORDER } } };
      cell.alignment = { vertical: "middle" };
    });
    if (options?.colorColumn !== undefined && options.colorFn) {
      const value = r[options.colorColumn];
      const color = options.colorFn(value);
      if (color) {
        const cell = row.getCell(options.colorColumn + 1);
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: color } };
        cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
      }
    }
  });

  sheet.autoFilter = {
    from: { row: headerRowIndex, column: 1 },
    to: { row: headerRowIndex, column: headers.length },
  };

  if (options?.dataBarColumn !== undefined && rows.length > 0) {
    const colLetter = sheet.getColumn(options.dataBarColumn + 1).letter;
    addDataBar(
      sheet,
      `${colLetter}${headerRowIndex + 1}:${colLetter}${headerRowIndex + rows.length}`,
      GOAT_GOLD,
    );
  }

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function severityFillColor(value: string | number): string | undefined {
  const v = String(value ?? "").toLowerCase();
  if (v.includes("ban")) return EXCEL_COLORS.red;
  if (v.includes("kick")) return EXCEL_COLORS.amber;
  if (v.includes("flag")) return EXCEL_COLORS.gold;
  if (v.includes("critical") || v === "suspeito") return EXCEL_COLORS.red;
  if (v.includes("warning")) return EXCEL_COLORS.amber;
  if (v === "limpo" || v.includes("success")) return EXCEL_COLORS.green;
  return undefined;
}
