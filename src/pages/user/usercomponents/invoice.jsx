import React from 'react';
import { useLocation } from 'react-router-dom';
import { FaIndianRupeeSign } from "react-icons/fa6";
import Navbar from './navbar'
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import '../../../style/invoice.css'

const Invoice = () => {
  const location = useLocation();
  const { book } = location.state || {};
 

  if (!book) {
    return <div>No invoice data available</div>;
  }

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    

    // Use jsPDF Autotable for table formatting if necessary
    doc.text("INVOICE", 14, 20);
    doc.text("Talk to Pro", 14, 30);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 40);
    doc.text(`To: ${book.providedByUsername}`, 14, 50);

    const tableData = [
      ["SL NO", "BOOKING DATE", "BOOKING TIME", "COST"],
      ["1", book.date.slice(0, 10), book.slots.time, `${book.slots.amount} ₹`]
    ];

    doc.autoTable({
      head: [tableData[0]],
      body: [tableData[1]],
      startY: 60,
    });

    doc.text(`Total: ${book.slots.amount} ₹`, 14, doc.autoTable.previous.finalY + 10);

    doc.save('invoice.pdf');
  };

  return (
  <>
    <div className="navbar-invoice">
        <Navbar />
      </div>
    <div className="p-4 max-w-6xl mx-auto bg-white rounded-lg shadow-md mt-8" style={{ minWidth: '700px' }}>
    
      <div className="flex justify-between items-center mb-8">
        <div>
          <h3 className="text-xl font-bold text-blue-600">INVOICE FOR BOOKING</h3>
          <p className="text-sm text-gray-500">#258942</p>
        </div>
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600">Talk to Pro</h1>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Date: 23.08.2022</p>
        </div>
      </div>
      <div className="flex justify-between mb-8">
        <div>
          <h2 className="text-lg font-bold text-gray-800">TO</h2>
          <p className="text-gray-700">{book.providedByUsername}</p>
        </div>
      </div>
      <table className="w-full mb-9">
        <thead>
          <tr className="bg-gray-100">
            <th className="text-left p-2 text-gray-700 align-middle">SL NO</th>
            <th className="text-left p-2 text-gray-600 align-middle">BOOKING DATE</th>
            <th className="text-left p-2 text-gray-600 align-middle">BOOKING TIME</th>
            <th className="text-right p-2 text-gray-600 align-middle">COST</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="p-2 text-gray-700 align-middle">1</td>
            <td className="p-2 text-gray-700 align-middle">{book.date.slice(0, 10)}</td>
            <td className="p-2 text-left text-gray-700 align-middle">{book.slots.time}</td>
            <td className="p-2 text-right text-gray-700 align-middle flex items-center justify-end">
              <span>{book.slots.amount}</span>
              <FaIndianRupeeSign className="ml-1" />
            </td>
          </tr>
        </tbody>
      </table>
      <div className="flex justify-end mb-8">
        <div>
          <p className="text-xl font-bold text-blue-600">Total</p>
          <p className="text-xl font-bold text-blue-600 flex items-center">
            <FaIndianRupeeSign className="mr-1" />
            {book.slots.amount}
          </p>
        </div>
      </div>
      <div className="flex justify-end">
        <button id='print-btn' className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md" onClick={handlePrint}>PRINT</button>
        <button id='pdf-btn' className="bg-blue-600 text-white px-4 py-2 rounded-md ml-2" onClick={handleDownloadPDF}>PDF DOWNLOAD</button>
      </div>
    </div>
    </>
  );
};

export default Invoice;
