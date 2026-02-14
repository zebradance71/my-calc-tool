"use client";

import { useMemo, useState } from "react";

type Unit = "mm" | "cm";

const PI = Math.PI;
const SQRT3 = Math.sqrt(3);

function formatNumber(value: number | null, digits = 2) {
  if (value == null || Number.isNaN(value) || !Number.isFinite(value)) return "-";
  return value.toFixed(digits);
}

function shapeAreaFromRectangle(width: number, height: number, unit: Unit) {
  const factor = unit === "cm" ? 10 : 1; // convert to mm
  const w = width * factor;
  const h = height * factor;
  if (w <= 0 || h <= 0) return null;
  return w * h; // mm^2
}

function shapeAreaFromHexagon({
  side,
  flatToFlat,
  unit,
}: {
  side: number;
  flatToFlat: number;
  unit: Unit;
}) {
  const factor = unit === "cm" ? 10 : 1;
  let aMm: number | null = null;

  if (side > 0) {
    aMm = side * factor;
  } else if (flatToFlat > 0) {
    const f = flatToFlat * factor;
    aMm = f / SQRT3;
  }

  if (!aMm || aMm <= 0) return null;

  const area = (3 * SQRT3 * aMm * aMm) / 2; // regular hexagon area
  return area; // mm^2
}

function equivalentCircleDiameter(areaMm2: number | null) {
  if (!areaMm2 || areaMm2 <= 0) return null;
  const radius = Math.sqrt(areaMm2 / PI);
  return radius * 2; // diameter in mm
}

export default function Page() {
  const [unit, setUnit] = useState<Unit>("mm");

  const [rectWidth, setRectWidth] = useState<string>("");
  const [rectHeight, setRectHeight] = useState<string>("");

  const [hexSide, setHexSide] = useState<string>("");
  const [hexFlat, setHexFlat] = useState<string>("");

  const rectArea = useMemo(
    () =>
      shapeAreaFromRectangle(
        parseFloat(rectWidth.replace(",", ".")),
        parseFloat(rectHeight.replace(",", ".")),
        unit
      ),
    [rectWidth, rectHeight, unit]
  );

  const hexArea = useMemo(
    () =>
      shapeAreaFromHexagon({
        side: parseFloat(hexSide.replace(",", ".")),
        flatToFlat: parseFloat(hexFlat.replace(",", ".")),
        unit,
      }),
    [hexSide, hexFlat, unit]
  );

  const rectDiameter = useMemo(
    () => equivalentCircleDiameter(rectArea ?? null),
    [rectArea]
  );
  const hexDiameter = useMemo(
    () => equivalentCircleDiameter(hexArea ?? null),
    [hexArea]
  );

  const preferredDiameter = rectDiameter ?? hexDiameter ?? null;

  const materialUnitLabel = unit === "mm" ? "mm" : "cm（換算: mm）";
  const diameterForLink =
    preferredDiameter != null && Number.isFinite(preferredDiameter)
      ? preferredDiameter
      : null;

  const diameterForLinkRounded =
    diameterForLink != null ? Math.round(diameterForLink) : null;

  const amazonUrl =
    diameterForLinkRounded != null
      ? `https://www.amazon.co.jp/s?k=${encodeURIComponent(
          `丸棒 ${diameterForLinkRounded}mm`
        )}&tag=YOUR_AMAZON_AFFILIATE_TAG`
      : null;

  const monotaroUrl =
    diameterForLinkRounded != null
      ? `https://www.monotaro.com/s/?c=&q=${encodeURIComponent(
          `丸棒 ${diameterForLinkRounded}mm`
        )}`
      : null;

  const handlePrint = () => {
    if (typeof window === "undefined") return;
    window.print();
  };

  return ( <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
        <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
          <Image
            className="dark:invert"
            src="/next.svg"
            alt="Next.js logo"
            width={100}
            height={20}
            priority
          />
          <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
            <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
              To get started, edit the page.tsx file.
    <div className="min-h-screen bg-black text-zinc-50">
      <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-12 px-4 py-10 sm:px-6 sm:py-12">
        <section className="space-y-5">
          <p className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/70 px-3 py-1 text-xs font-medium text-zinc-200">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Shape Circle Converter
          </p>
          <h1 className="text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
            四角形・正六角形と同じ面積を持つ
            <span className="bg-gradient-to-r from-sky-400 via-rose-400 to-amber-300 bg-clip-text text-transparent">
              円の直径
            </span>
            をリアルタイムで計算。
          </h1>
          <p className="max-w-2xl text-sm leading-relaxed text-zinc-300">
            設計や材料手配のときに、「この四角形（あるいは六角形）と同じ面積の丸棒／円盤の直径が知りたい」
            という場面向けのプロトタイプツールです。
          </p>
          <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-zinc-800 bg-zinc-950/80 px-4 py-3 text-[11px] text-zinc-200">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-md bg-sky-500/20 text-sky-300">
                ■
              </span>
              <span>四角形</span>
            </div>
            <span className="text-zinc-500">と</span>
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-md bg-amber-500/20 text-amber-300">
                ⬡
              </span>
              <span>正六角形</span>
            </div>
            <span className="text-zinc-500">を、同じ面積の</span>
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-300">
                ●
              </span>
              <span>円</span>
            </div>
            <span className="text-zinc-500">に変換するイメージです。</span>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.9fr)]">
          <div className="space-y-4 rounded-2xl border border-zinc-800 bg-zinc-950/70 p-4 sm:p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-sm font-semibold text-zinc-50">
                入力（四角形・正六角形）
              </h2>
              <div className="flex items-center gap-2 text-[11px] text-zinc-400">
                <span>単位:</span>
                <div className="inline-flex rounded-full border border-zinc-700 bg-zinc-900/70 p-0.5">
                  <button
                    type="button"
                    className={`rounded-full px-2 py-0.5 text-[11px] ${
                      unit === "mm"
                        ? "bg-zinc-800 text-zinc-50"
                        : "text-zinc-300"
                    }`}
                    onClick={() => setUnit("mm")}
                  >
                    mm
                  </button>
                  <button
                    type="button"
                    className={`rounded-full px-2 py-0.5 text-[11px] ${
                      unit === "cm"
                        ? "bg-zinc-800 text-zinc-50"
                        : "text-zinc-300"
                    }`}
                    onClick={() => setUnit("cm")}
                  >
                    cm
                  </button>
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-3 rounded-xl border border-zinc-800 bg-zinc-950/80 p-4">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-md bg-sky-500/20 text-sky-300">
                      ■
                    </div>
                    <p className="text-xs font-semibold text-zinc-100">四角形</p>
                  </div>
                  <p className="text-[11px] text-zinc-500">縦・横の寸法</p>
                </div>
                <div className="space-y-2">
                  <label className="block text-[11px] text-zinc-300">
                    縦 ({materialUnitLabel})
                  </label>
                  <input
                    type="number"
                    inputMode="decimal"
                    value={rectHeight}
                    onChange={(e) => setRectHeight(e.target.value)}
                    className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-2.5 py-1.5 text-[13px] text-zinc-50 outline-none ring-0 transition focus:border-sky-400 focus:ring-2 focus:ring-sky-500/40"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-[11px] text-zinc-300">
                    横 ({materialUnitLabel})
                  </label>
                  <input
                    type="number"
                    inputMode="decimal"
                    value={rectWidth}
                    onChange={(e) => setRectWidth(e.target.value)}
                    className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-2.5 py-1.5 text-[13px] text-zinc-50 outline-none ring-0 transition focus:border-sky-400 focus:ring-2 focus:ring-sky-500/40"
                  />
                </div>
              </div>

              <div className="space-y-3 rounded-xl border border-zinc-800 bg-zinc-950/80 p-4">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="relative h-7 w-7">
                      <div className="absolute inset-0 flex items-center justify-center text-amber-300">
                        ⬡
                      </div>
                    </div>
                    <p className="text-xs font-semibold text-zinc-100">
                      正六角形
                    </p>
                  </div>
                  <p className="text-[11px] text-zinc-500">
                    対辺距離または一辺
                  </p>
                </div>
                <div className="space-y-2">
                  <label className="block text-[11px] text-zinc-300">
                    対辺距離 ({materialUnitLabel})
                  </label>
                  <input
                    type="number"
                    inputMode="decimal"
                    value={hexFlat}
                    onChange={(e) => setHexFlat(e.target.value)}
                    className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-2.5 py-1.5 text-[13px] text-zinc-50 outline-none ring-0 transition focus:border-sky-400 focus:ring-2 focus:ring-sky-500/40"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-[11px] text-zinc-300">
                    一辺の長さ ({materialUnitLabel})
                  </label>
                  <input
                    type="number"
                    inputMode="decimal"
                    value={hexSide}
                    onChange={(e) => setHexSide(e.target.value)}
                    className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-2.5 py-1.5 text-[13px] text-zinc-50 outline-none ring-0 transition focus:border-sky-400 focus:ring-2 focus:ring-sky-500/40"
                  />
                  <p className="text-[10px] text-zinc-500">
                    ※ 一辺と対辺距離の両方を入力した場合は、一辺の値を優先します。
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4 rounded-2xl border border-zinc-800 bg-zinc-950/80 p-4 sm:p-5">
            <h2 className="text-sm font-semibold text-zinc-50">
              出力（同じ面積の円の直径）
            </h2>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-300">
                  ●
                </div>
                <p className="text-xs font-semibold text-zinc-100">
                  四角形 → 円の直径
                </p>
              </div>
              <p className="text-2xl font-semibold tracking-tight text-emerald-300">
                {formatNumber(rectDiameter)}
                <span className="ml-1 text-xs text-zinc-300">mm</span>
              </p>
              <p className="text-[11px] text-zinc-400">
                入力した四角形と同じ面積を持つ円の直径（mm換算）です。
              </p>
            </div>

            <div className="h-px w-full bg-zinc-800" />

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-500/20 text-amber-300">
                  ●
                </div>
                <p className="text-xs font-semibold text-zinc-100">
                  正六角形 → 円の直径
                </p>
              </div>
              <p className="text-2xl font-semibold tracking-tight text-amber-300">
                {formatNumber(hexDiameter)}
                <span className="ml-1 text-xs text-zinc-300">mm</span>
              </p>
              <p className="text-[11px] text-zinc-400">
                入力した正六角形（対辺距離 or 一辺）と同じ面積を持つ円の直径（mm換算）です。
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-3 rounded-2xl border border-zinc-800 bg-zinc-950/80 p-4 sm:p-5 text-[12px]">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-semibold text-zinc-50">
                材料購入リンク（プロトタイプ）
              </h2>
              <p className="text-[11px] text-zinc-400">
                計算された円の直径に近いサイズの「丸棒」「円盤」を、Amazon / モノタロウで検索するリンクを自動生成します。
                実運用時は、ここにアフィリエイトID付きのリンクを設定してください。
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {diameterForLinkRounded == null ? (
              <p className="text-zinc-400">
                まずは四角形または正六角形の寸法を入力してください。
              </p>
            ) : (
              <>
                <p className="text-zinc-200">
                  目安直径:{" "}
                  <span className="font-semibold text-sky-300">
                    {diameterForLinkRounded} mm
                  </span>
                </p>
                {amazonUrl && (
                  <a
                    href={amazonUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center rounded-full bg-[#FF9900]/90 px-3 py-1 text-[11px] font-semibold text-zinc-900 hover:bg-[#ffac2b]"
                  >
                    Amazonで「丸棒 {diameterForLinkRounded}mm」を検索
                  </a>
                )}
                {monotaroUrl && (
                  <a
                    href={monotaroUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center rounded-full bg-emerald-500/90 px-3 py-1 text-[11px] font-semibold text-zinc-900 hover:bg-emerald-400"
                  >
                    モノタロウで「丸棒 {diameterForLinkRounded}mm」を検索
                  </a>
                )}
              </>
            )}
          </div>
        </section>

        <section className="space-y-3 rounded-2xl border border-zinc-800 bg-zinc-950/80 p-4 sm:p-5 text-[12px]">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-semibold text-zinc-50">
                設計仕様書 PDF レポート（プロトタイプ）
              </h2>
              <p className="text-[11px] text-zinc-400">
                現在はブラウザの印刷機能を利用してPDFとして保存するシンプルな実装です。
                本番運用では、ここに有料プランや広告枠を追加することを想定しています。
              </p>
            </div>
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center justify-center rounded-full bg-zinc-50 px-4 py-1.5 text-xs font-semibold text-black shadow-sm hover:bg-zinc-200 print:hidden"
            >
              PDFとして保存（印刷）
            </button>
          </div>

          <div className="space-y-3 rounded-xl border border-zinc-800 bg-black/40 p-4 text-[11px] print:border-zinc-300 print:bg-white print:text-zinc-900">
            <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-zinc-800 pb-2 print:border-zinc-300">
              <div>
                <p className="font-semibold">
                  Shape Circle Converter 設計仕様書
                </p>
                <p className="text-zinc-400 print:text-zinc-600">
                  四角形・正六角形 → 円の面積換算
                </p>
              </div>
              <p className="text-zinc-400 print:text-zinc-600">
                日時:{" "}
                {new Date().toLocaleString("ja-JP", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <p className="mb-1 font-semibold text-zinc-300 print:text-zinc-800">
                  入力条件
                </p>
                <table className="w-full border-collapse">
                  <tbody>
                    <tr>
                      <td className="border border-zinc-800 px-2 py-1 print:border-zinc-300">
                        単位
                      </td>
                      <td className="border border-zinc-800 px-2 py-1 print:border-zinc-300">
                        {unit}
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-zinc-800 px-2 py-1 print:border-zinc-300">
                        四角形 縦
                      </td>
                      <td className="border border-zinc-800 px-2 py-1 print:border-zinc-300">
                        {rectHeight || "-"}
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-zinc-800 px-2 py-1 print:border-zinc-300">
                        四角形 横
                      </td>
                      <td className="border border-zinc-800 px-2 py-1 print:border-zinc-300">
                        {rectWidth || "-"}
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-zinc-800 px-2 py-1 print:border-zinc-300">
                        正六角形 対辺距離
                      </td>
                      <td className="border border-zinc-800 px-2 py-1 print:border-zinc-300">
                        {hexFlat || "-"}
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-zinc-800 px-2 py-1 print:border-zinc-300">
                        正六角形 一辺
                      </td>
                      <td className="border border-zinc-800 px-2 py-1 print:border-zinc-300">
                        {hexSide || "-"}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div>
                <p className="mb-1 font-semibold text-zinc-300 print:text-zinc-800">
                  計算結果（mm換算）
                </p>
                <table className="w-full border-collapse">
                  <tbody>
                    <tr>
                      <td className="border border-zinc-800 px-2 py-1 print:border-zinc-300">
                        四角形 面積
                      </td>
                      <td className="border border-zinc-800 px-2 py-1 print:border-zinc-300">
                        {rectArea != null ? `${formatNumber(rectArea, 0)} mm²` : "-"}
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-zinc-800 px-2 py-1 print:border-zinc-300">
                        四角形 → 円 直径
                      </td>
                      <td className="border border-zinc-800 px-2 py-1 print:border-zinc-300">
                        {rectDiameter != null
                          ? `${formatNumber(rectDiameter)} mm`
                          : "-"}
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-zinc-800 px-2 py-1 print:border-zinc-300">
                        正六角形 面積
                      </td>
                      <td className="border border-zinc-800 px-2 py-1 print:border-zinc-300">
                        {hexArea != null ? `${formatNumber(hexArea, 0)} mm²` : "-"}
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-zinc-800 px-2 py-1 print:border-zinc-300">
                        正六角形 → 円 直径
                      </td>
                      <td className="border border-zinc-800 px-2 py-1 print:border-zinc-300">
                        {hexDiameter != null
                          ? `${formatNumber(hexDiameter)} mm`
                          : "-"}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <p className="border-t border-zinc-800 pt-2 text-[10px] text-zinc-500 print:border-zinc-300 print:text-zinc-600">
              ※ 本ツールはプロトタイプです。実際の設計・製造の際には、公差や加工方法を考慮した上で専門家の確認を行ってください。
            </p>
          </div>
        </section>
      </main>
    </div>
  );

