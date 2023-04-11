import { useState } from "react";

const inputClasses =
  "block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6";

const Equal = ({ total, setTotal, people, setPeople, pay, setPay }) => {
  const handleChangeTotal = (event) => {
    const inputValue = event.target.value.replace(/\D/g, "");
    const formattedValue = Number(inputValue).toLocaleString();
    setTotal(formattedValue);

    calculatePay(formattedValue, people);
  };

  const handleChangePeople = (event) => {
    const inputValue = event.target.value.replace(/\D/g, "");
    const formattedValue = Number(inputValue).toLocaleString();
    setPeople(formattedValue);

    calculatePay(total, formattedValue);
  };

  const calculatePay = (tt, pp) => {
    const totalF = parseFloat(tt.replace(/,/g, ""));
    const peopleF = parseFloat(pp.replace(/,/g, ""));
    const calPay = totalF / peopleF;
    const checked = calPay === Infinity ? 0 : calPay;
    const rounded = Math.ceil(checked * 100) / 100;
    const formattedPay = Number(rounded).toLocaleString();
    setPay(`${formattedPay} บาท`);
  };

  return (
    <div className="p-6">
      <div className="border-b border-gray-900/10 pb-12">
        <h2 className="text-base font-semibold leading-7 text-gray-900">
          หารเท่ากันทุกคนนะ
        </h2>
        <p className="mt-1 text-sm leading-6 text-gray-600">
          เราปัดเศษทศนิยมให้เหลือสองตำแหน่งด้วยนะ จะโอนแบบปัดต่อก็ได้จ้า
        </p>

        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          <div className="sm:col-span-2 sm:col-start-1">
            <label
              htmlFor="total"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              จำนวนเงินทั้งหมด
            </label>
            <div className="mt-2">
              <input
                name="total"
                id="total"
                value={total}
                onChange={handleChangeTotal}
                className={inputClasses}
              />
            </div>
          </div>

          <div className="sm:col-span-2">
            <label
              htmlFor="people"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              จำนวนคนทั้งหมด
            </label>
            <div className="mt-2">
              <input
                name="people"
                id="people"
                value={people}
                onChange={handleChangePeople}
                className={inputClasses}
              />
            </div>
          </div>

          <div className="sm:col-span-2">
            <label
              htmlFor="pay"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              แต่ละคนจ่าย
            </label>
            <div className="mt-2">
              <input
                name="pay"
                id="pay"
                disabled
                readOnly
                value={pay}
                className="py-1.5 appearance-none border-none bg-transparent leading-tight focus:outline-none w-full text-center font-semibold text-xl sm:text-left"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Equal;
