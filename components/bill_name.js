import { useState } from "react";

const BillName = () => {
  const [billName, setBillName] = useState("Edit Bill Name");
  const [editBill, setEditBill] = useState(false);

  return (
    <div className="bg-blue-500 p-2">
      {!editBill ? (
        <div
          className="bg-blue-500 text-white px-5 py-4 text-lg font-medium"
          onClick={() => setEditBill(true)}
        >
          {billName}
        </div>
      ) : (
        <div className="relative w-full max-w-xl mx-auto bg-white rounded-full h-14 lg:max-w-none">
          <input
            className="rounded-full w-full h-14 bg-transparent py-0 sm:pl-6 pl-5 pr-16 sm:pr-32 outline-none border-2 border-blue-100 shadow-md hover:outline-none focus:ring-cool-indigo-200 focus:border-cool-indigo-200"
            placeholder="Enter your bill name"
            value={billName}
            onChange={(e) => setBillName(e.target.value)}
          />
          <button
            type="submit"
            className="absolute inline-flex items-center h-12 p-4 text-sm text-black transition duration-300 ease-in-out rounded-r-full rounded-bl-full outline-none right-1 top-1 bg-cool-indigo-600 sm:py-2 sm:px-6 sm:rounded-full sm:text-base sm:font-medium hover:bg-cool-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cool-indigo-500"
            onClick={() => setEditBill(false)}
          >
            <svg
              className="h-6 w-5 flex-none text-blue-600"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                clipRule="evenodd"
              />
            </svg>
            <span className="hidden sm:inline-block"> Save</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default BillName;
