import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import PromptPay from "./prompt_pay";
import { fmt } from "../lib/bill-calc";

// Column count chosen by people count so everything fits on one viewport
// without scrolling — user is expected to screenshot the modal as-is.
function colsFor(n) {
  if (n <= 6) return "grid-cols-1";
  if (n <= 14) return "grid-cols-2";
  if (n <= 27) return "grid-cols-3";
  return "grid-cols-4";
}

export default function SummaryModal({ open, setOpen, peopleArr, result }) {
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/40 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 translate-y-2 scale-95"
              enterTo="opacity-100 translate-y-0 scale-100"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0 scale-100"
              leaveTo="opacity-0 translate-y-2 scale-95"
            >
              <Dialog.Panel className="relative w-full max-w-4xl rounded-2xl bg-white p-6 shadow-xl">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100"
                  aria-label="ปิด"
                >
                  ×
                </button>

                <Dialog.Title className="text-lg font-bold text-gray-900">
                  สรุปบิล
                </Dialog.Title>

                <div className="mt-4 grid grid-cols-[auto_1fr] gap-6">
                  <div className="flex flex-col items-center">
                    <PromptPay readOnly />
                  </div>

                  <div className="flex flex-col">
                    <div
                      className={`grid gap-x-6 gap-y-1.5 ${colsFor(peopleArr.length)}`}
                    >
                      {peopleArr.map((p, i) => (
                        <div
                          key={p.id}
                          className="flex items-baseline justify-between border-b border-dashed border-gray-200 py-1.5"
                        >
                          <span className="truncate pr-2 text-sm font-medium text-gray-900">
                            {p.name || `คน ${i + 1}`}
                          </span>
                          <span className="text-sm font-bold tabular-nums text-gray-900">
                            ฿{fmt(result.perPerson[p.id] || 0)}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 flex items-baseline justify-between rounded-xl border border-blue-100 bg-blue-50 px-4 py-3">
                      <span className="text-sm font-semibold text-blue-700">
                        รวมทั้งหมด
                      </span>
                      <span className="text-2xl font-bold tabular-nums text-blue-700">
                        ฿{fmt(result.finalTotal)}
                      </span>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
