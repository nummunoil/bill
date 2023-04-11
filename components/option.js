import { useEffect, useState } from "react";
import { RadioGroup } from "@headlessui/react";

const options = [
  { name: "หารกัน", value: 1 },
  { name: "เก็บตามสัดส่วน", value: 2 },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Option({ selected, setSelected }) {
  useEffect(() => {
    const option = localStorage.getItem("option");
    option && setSelected(+option);
  }, [setSelected]);

  useEffect(() => {
    localStorage.setItem("option", selected);
  }, [selected]);

  return (
    <div>
      <RadioGroup value={selected} onChange={setSelected} className="mt-4">
        <RadioGroup.Label className="sr-only">
          เลือกวิธีการคำนวณ
        </RadioGroup.Label>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-1 lg:grid-cols-2">
          {options.map((option) => (
            <RadioGroup.Option
              key={option.name}
              value={option.value}
              className={({ active, checked }) =>
                classNames(
                  active ? "ring-2 ring-blue-500 " : "",
                  checked ? "bg-blue-50" : "bg-white",
                  "cursor-pointer text-gray-900 shadow-sm group relative flex items-center justify-center rounded-md border py-3 px-4 text-sm font-medium hover:bg-blue-50 focus:outline-none sm:flex-1"
                )
              }
            >
              {({ active, checked }) => (
                <>
                  <RadioGroup.Label as="span">{option.name}</RadioGroup.Label>
                  <span
                    className={classNames(
                      active ? "border" : "border-2",
                      checked ? "border-blue-500" : "border-transparent",
                      "pointer-events-none absolute -inset-px rounded-md"
                    )}
                    aria-hidden="true"
                  />
                </>
              )}
            </RadioGroup.Option>
          ))}
        </div>
      </RadioGroup>
    </div>
  );
}
