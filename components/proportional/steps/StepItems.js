import { fmt } from "../../../lib/bill-calc";

export default function StepItems({
  items,
  addItem,
  rmItem,
  updateItem,
  discountEditor,
  setDiscountEditor,
}) {
  return (
    <div className="space-y-2">
      {items.length === 0 && (
        <div className="rounded-xl border border-dashed border-gray-200 px-4 py-6 text-center text-sm text-gray-500">
          ยังไม่มีเมนู กดด้านล่างเพื่อเพิ่ม
        </div>
      )}

      {items.map((it) => {
        const hasDisc = it.discount > 0;
        const sub = it.price * it.qty;
        const discAmt = hasDisc
          ? it.discountType === "baht"
            ? it.discount
            : (sub * it.discount) / 100
          : 0;
        const editing = discountEditor === it.id;
        return (
          <div
            key={it.id}
            className="rounded-xl border border-gray-200 bg-white px-3 py-2.5"
          >
            <div className="flex items-center gap-2">
              <input
                value={it.name}
                onChange={(e) => updateItem(it.id, { name: e.target.value })}
                placeholder="ชื่อเมนู"
                className="min-w-0 flex-1 border-0 bg-transparent text-sm font-medium outline-none focus:ring-0"
              />
              <span className="text-[11px] text-gray-400">·</span>
              <input
                type="number"
                min={1}
                value={it.qty}
                onChange={(e) =>
                  updateItem(it.id, { qty: parseInt(e.target.value) || 1 })
                }
                className="w-9 border-0 bg-transparent text-center text-sm text-gray-600 outline-none focus:ring-0"
              />
              <span className="text-xs text-gray-400">฿</span>
              <input
                type="number"
                value={it.price || ""}
                onChange={(e) =>
                  updateItem(it.id, { price: parseFloat(e.target.value) || 0 })
                }
                className="w-16 border-0 bg-transparent text-right text-sm font-semibold outline-none focus:ring-0"
              />
              <button
                type="button"
                title="ส่วนลดเฉพาะเมนูนี้"
                onClick={() => setDiscountEditor(editing ? null : it.id)}
                className={`flex h-7 w-7 items-center justify-center rounded-md border text-[11px] font-bold ${
                  hasDisc
                    ? "border-blue-600 bg-blue-50 text-blue-700"
                    : "border-gray-200 text-gray-500 hover:bg-gray-50"
                }`}
              >
                %
              </button>
              <button
                type="button"
                onClick={() => rmItem(it.id)}
                className="px-1 text-base leading-none text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>

            {hasDisc && (
              <div className="mt-1.5 flex justify-between border-t border-dashed border-gray-100 pt-1.5 text-[11px] text-blue-700">
                <span>
                  ส่วนลด{" "}
                  {it.discountType === "percent"
                    ? `${it.discount}%`
                    : `฿${it.discount}`}
                </span>
                <span>−฿{fmt(discAmt)}</span>
              </div>
            )}

            {editing && (
              <div className="mt-2 rounded-lg bg-gray-50 p-2.5">
                <div className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                  ส่วนลดเฉพาะเมนูนี้
                </div>
                <div className="mt-1.5 flex items-center gap-2">
                  <input
                    type="number"
                    value={it.discount || ""}
                    placeholder="0"
                    onChange={(e) =>
                      updateItem(it.id, {
                        discount: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-20 rounded-md border border-gray-200 bg-white px-2.5 py-1.5 text-sm font-semibold outline-none focus:border-blue-600"
                  />
                  <div className="inline-flex shrink-0 overflow-hidden rounded-md border border-gray-200 bg-white">
                    {["percent", "baht"].map((t) => (
                      <button
                        type="button"
                        key={t}
                        onClick={() => updateItem(it.id, { discountType: t })}
                        className={`px-3 py-1.5 text-sm font-semibold ${
                          it.discountType === t
                            ? "bg-gray-900 text-white"
                            : "text-gray-700"
                        }`}
                      >
                        {t === "percent" ? "%" : "฿"}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => updateItem(it.id, { discount: 0 })}
                    className="flex-1 rounded-md border border-gray-200 bg-white py-1 text-xs text-gray-700"
                  >
                    ไม่มีส่วนลด
                  </button>
                  <button
                    type="button"
                    onClick={() => setDiscountEditor(null)}
                    className="flex-1 rounded-md bg-blue-600 py-1 text-xs text-white"
                  >
                    เสร็จ
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}

      <button
        type="button"
        onClick={() => addItem()}
        className="w-full rounded-xl border border-dashed border-gray-300 px-3 py-3 text-sm text-gray-500 hover:bg-gray-50"
      >
        + เพิ่มเมนู
      </button>
    </div>
  );
}
