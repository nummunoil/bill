import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import PromptPay from "./prompt_pay";

export default function SlideOver({ open, setOpen, total, setPeople, setPay }) {
  const [inputData, setInputData] = useState("");
  const [peopleList, setPeopleList] = useState([]);
  const [fixIndex, setFixIndex] = useState([]);
  const [newTotal, setNewTotal] = useState(0);

  useEffect(() => {
    setNewTotal(0);
    setPeopleList([]);
  }, [total]);

  const handleKeyDown = (e) => {
    if (e.keyCode === 13) {
      handleAddData();
    }
  };

  const handleAddData = () => {
    const newList = [...peopleList, { name: inputData, total: 0 }];
    cal(newList);
    setInputData("");
  };

  const handleRemoveData = (indexToRemove) => {
    const newList = peopleList.filter((_, index) => index !== indexToRemove);
    cal(newList);
  };

  const cal = (newList) => {
    setFixIndex([]);
    const length = newList.length;

    const totalF = parseFloat(total.replace(/,/g, ""));
    const newTotal = totalF / length;
    const checked = newTotal === Infinity ? 0 : newTotal;
    const rounded = Math.ceil(checked * 100) / 100;
    const formattedPay = Number(rounded).toLocaleString();

    const newPeopleList = newList.map((person) => ({
      ...person,
      total: formattedPay,
    }));

    const formattedPeople = Number(length).toLocaleString();
    setPeople(formattedPeople);
    setPay(formattedPay);

    setPeopleList(newPeopleList);
  };

  const fixPay = (indexFix, value) => {
    const set = new Set(fixIndex);
    set.add(indexFix);
    const newFixIndex = Array.from(set);
    setFixIndex(newFixIndex);
    const length = peopleList.length - newFixIndex.length;
    const updatedList = [...peopleList];
    updatedList[indexFix].total = Number(value).toLocaleString();
    const fixPay = newFixIndex.reduce(
      (total, index) =>
        total + parseFloat(updatedList[index].total.replace(/,/g, "")),
      0
    );
    if (length <= 0) {
      setNewTotal(Number(fixPay).toLocaleString());
    }
    const totalF = parseFloat(total.replace(/,/g, ""));
    const newTotal = (totalF - fixPay) / length;
    const checked = newTotal === Infinity ? 0 : newTotal;
    const rounded = Math.ceil(checked * 100) / 100;
    const formattedPay = Number(rounded).toLocaleString();
    const newPeopleList = updatedList.map((person, index) => {
      if (newFixIndex.includes(index)) return person;
      return {
        ...person,
        total: formattedPay,
      };
    });

    setPeopleList(newPeopleList);
  };

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-0">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                    <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                      <div className="flex items-start justify-between">
                        <Dialog.Title className="text-lg font-medium text-gray-900">
                          รายชื่อคนจ่ายทั้งหมด
                        </Dialog.Title>
                        <div className="ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            className="-m-2 p-2 text-gray-400 hover:text-gray-500"
                            onClick={() => setOpen(false)}
                          >
                            <span className="sr-only">Close</span>
                            <svg
                              className="h-6 w-6"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth="1.5"
                              stroke="currentColor"
                              aria-hidden="true"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>

                      <div className="mt-8">
                        <div className="flow-root">
                          <ul
                            role="list"
                            className="-my-6 divide-y divide-gray-200"
                          >
                            {peopleList.length === 0 ? (
                              <div className="text-center pt-4">
                                กรุณาเพิ่มรายชื่อ
                              </div>
                            ) : (
                              peopleList.map((person, index) => (
                                <li
                                  key={`product_${index}`}
                                  className="flex py-2"
                                >
                                  <div className="ml-4 flex flex-1 flex-col">
                                    <div className="flex justify-between text-base font-medium text-gray-900">
                                      <h3>{person.name}</h3>
                                      <input
                                        type="text"
                                        className="ml-4 text-right"
                                        value={person.total}
                                        onChange={(e) =>
                                          fixPay(
                                            index,
                                            e.target.value.replace(/\D/g, "")
                                          )
                                        }
                                      />
                                    </div>
                                    <div className="flex flex-1 items-end justify-between text-sm">
                                      <span className="text-xs text-red-500">
                                        {fixIndex.includes(index) &&
                                          "ช่วยออกเท่านี้นะ!!"}
                                      </span>
                                      <button
                                        type="button"
                                        className="font-medium text-blue-600 hover:text-blue-500"
                                        onClick={() => handleRemoveData(index)}
                                      >
                                        Remove
                                      </button>
                                    </div>
                                  </div>
                                </li>
                              ))
                            )}
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 px-2 py-6 sm:px-6">
                      <div className="flex justify-between">
                        <div className="overflow-auto">
                          <PromptPay />
                        </div>
                        <div className="flex flex-col justify-center">
                          <div className="flex justify-between text-sm sm:text-base font-medium text-gray-900">
                            <p>จำนวนเงินทั้งหมด</p>
                            <p>฿ {newTotal || total}</p>
                          </div>
                          <p className="mt-8 text-sm sm:text-base">
                            เพิ่มรายชื่อ
                          </p>
                          <div className="mt-2 text-sm sm:text-base">
                            <div className="flex">
                              <input
                                type="text"
                                value={inputData}
                                onChange={(e) => setInputData(e.target.value)}
                                className="flex-1 border-b border-blue-300 block w-full"
                                placeholder="ระบุชื่อ"
                                onKeyDown={handleKeyDown}
                              />
                              <button
                                className="flex-initial bg-blue-300 rounded-md px-2 py-1"
                                onClick={handleAddData}
                              >
                                เพิ่มคน
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
