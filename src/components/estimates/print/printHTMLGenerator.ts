
import { EstimatePrintStyles } from './EstimatePrintStyles';

interface CompanyDetails {
  companyName?: string;
  phone?: string;
  email?: string;
  taxId?: string;
}

interface CompanyAddress {
  street?: string;
  aptSuite?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}

interface CompanyLogo {
  logoUrl?: string;
}

interface EstimateItem {
  name: string;
  quantity: number;
  price: number;
}

interface Estimate {
  referenceNo: string;
  clientName: string;
  date: string;
  validUntil: string;
  status: string;
  items?: EstimateItem[];
  terms?: string;
  notes?: string;
}

export const generateEstimatePrintHTML = (
  estimate: Estimate,
  details: CompanyDetails,
  address: CompanyAddress,
  logo: CompanyLogo
): string => {
  // Calculate totals
  const subTotal = estimate.items?.reduce((sum: number, item: EstimateItem) => sum + (item.quantity * item.price), 0) || 0;
  const taxAmount = subTotal * 0.18;
  const grandTotal = subTotal + taxAmount;

  // Convert number to words (simplified)
  const numberToWords = (num: number): string => {
    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    
    if (num === 0) return 'Zero';
    if (num < 10) return ones[num];
    if (num < 20) return teens[num - 10];
    if (num < 100) return tens[Math.floor(num / 10)] + (num % 10 ? ' ' + ones[num % 10] : '');
    if (num < 1000) return ones[Math.floor(num / 100)] + ' Hundred' + (num % 100 ? ' ' + numberToWords(num % 100) : '');
    if (num < 100000) return numberToWords(Math.floor(num / 1000)) + ' Thousand' + (num % 1000 ? ' ' + numberToWords(num % 1000) : '');
    
    return 'Amount too large';
  };

  const amountInWords = numberToWords(Math.floor(grandTotal)) + ' Rupees Only';

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Estimate - ${estimate.referenceNo}</title>
        <style>
          @page {
            margin: 15mm;
            size: A4;
            /* Remove default browser headers/footers */
            @top-left { content: ""; }
            @top-center { content: ""; }
            @top-right { content: ""; }
            @bottom-left { content: ""; }
            @bottom-center { content: ""; }
            @bottom-right { content: ""; }
          }
          
          body {
            font-family: Arial, sans-serif;
            line-height: 1.3;
            color: black;
            background: white;
            margin: 0;
            font-size: 11px;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          
          /* Hide any browser-generated content */
          body::before,
          body::after,
          html::before,
          html::after {
            content: none !important;
            display: none !important;
          }
          
          h1 {
            font-size: 20px;
            margin-bottom: 4px;
            color: black;
            font-weight: bold;
          }
          
          h2 {
            font-size: 16px;
            color: #2563eb;
            font-weight: bold;
          }
          
          h3 {
            font-size: 11px;
            color: #2563eb;
            margin-bottom: 8px;
            font-weight: bold;
          }
          
          table {
            width: 100%;
            border-collapse: collapse;
            font-size: 10px;
            margin-bottom: 16px;
          }
          
          th {
            background-color: #2563eb;
            color: white;
            font-weight: bold;
            padding: 6px;
            border: 1px solid #374151;
            text-align: center;
          }
          
          td {
            border: 1px solid #374151;
            padding: 4px 6px;
            text-align: left;
            vertical-align: top;
          }
          
          .text-center { text-align: center; }
          .text-right { text-align: right; }
          .text-left { text-align: left; }
          .font-bold { font-weight: bold; }
          .font-semibold { font-weight: 600; }
          .text-xs { font-size: 9px; }
          .text-sm { font-size: 10px; }
          .text-lg { font-size: 13px; }
          .text-xl { font-size: 15px; }
          .text-2xl { font-size: 18px; }
          .text-blue-600 { color: #2563eb; }
          .text-gray-600 { color: #4b5563; }
          .text-gray-500 { color: #6b7280; }
          .text-gray-800 { color: #1f2937; }
          .bg-blue-100 { background-color: #dbeafe; }
          .bg-gray-50 { background-color: #f9fafb; }
          .border { border: 1px solid #d1d5db; }
          .border-t { border-top: 1px solid #d1d5db; }
          .border-t-2 { border-top: 2px solid #374151; }
          .border-b { border-bottom: 1px solid #d1d5db; }
          .border-gray-300 { border-color: #d1d5db; }
          .border-gray-600 { border-color: #4b5563; }
          .mb-1 { margin-bottom: 2px; }
          .mb-2 { margin-bottom: 4px; }
          .mb-3 { margin-bottom: 6px; }
          .mb-4 { margin-bottom: 8px; }
          .mb-6 { margin-bottom: 12px; }
          .mb-8 { margin-bottom: 16px; }
          .mt-2 { margin-top: 4px; }
          .mt-8 { margin-top: 16px; }
          .pt-2 { padding-top: 4px; }
          .pt-4 { padding-top: 8px; }
          .pb-1 { padding-bottom: 2px; }
          .p-2 { padding: 4px; }
          .p-3 { padding: 6px; }
          .flex { display: flex; }
          .flex-1 { flex: 1; }
          .flex-shrink-0 { flex-shrink: 0; }
          .items-start { align-items: flex-start; }
          .justify-between { justify-content: space-between; }
          .justify-end { justify-content: flex-end; }
          .flex-col { flex-direction: column; }
          .grid { display: grid; }
          .grid-cols-2 { grid-template-columns: 1fr 1fr; }
          .grid-cols-3 { grid-template-columns: 1fr 1fr 1fr; }
          .gap-6 { gap: 16px; }
          .gap-8 { gap: 20px; }
          .space-y-1 > * + * { margin-top: 2px; }
          .mx-4 { margin-left: 8px; margin-right: 8px; }
          .capitalize { text-transform: capitalize; }
          .w-12 { width: 48px; }
          .w-16 { width: 64px; }
          .w-24 { width: 96px; }
          .h-16 { height: 64px; }
          .min-w-200 { min-width: 200px; }
          .min-h-80 { min-height: 80px; }
          .object-contain { object-fit: contain; }
        </style>
      </head>
      <body>
        <!-- Header -->
        <div class="mb-6">
          <div class="flex items-start justify-between mb-4">
            <div class="flex-shrink-0">
              ${logo.logoUrl ? `<img src="${logo.logoUrl}" alt="Company Logo" class="h-16 w-16 object-contain">` : ''}
            </div>
            <div class="flex-1 text-center">
              <h1 class="text-2xl font-bold text-gray-800 mb-1">
                ${details.companyName || 'Your Company Name'}
              </h1>
            </div>
            <div class="text-right text-xs text-gray-600 space-y-1 flex-shrink-0 min-w-200">
              ${details.phone ? `<p>Mobile: ${details.phone}</p>` : ''}
              ${details.email ? `<p>Email: ${details.email}</p>` : ''}
              ${details.taxId ? `<p>GSTIN: ${details.taxId}</p>` : ''}
              ${address.street ? `
                <div class="mt-2">
                  <p>${address.street}</p>
                  ${address.aptSuite ? `<p>${address.aptSuite}</p>` : ''}
                  <p>
                    ${address.city}${address.state ? `, ${address.state}` : ''}${address.postalCode ? ` ${address.postalCode}` : ''}
                  </p>
                  ${address.country ? `<p>${address.country}</p>` : ''}
                </div>
              ` : ''}
            </div>
          </div>
          <div class="border-t-2 border-gray-800 mb-4"></div>
          <div class="text-center mb-4">
            <h2 class="text-xl font-bold text-blue-600">ESTIMATE</h2>
          </div>
        </div>

        <!-- Details Section -->
        <div class="grid grid-cols-2 gap-8 mb-6">
          <div>
            <h3 class="font-bold text-sm mb-3 text-blue-600 border-b border-gray-300 pb-1">Bill To:</h3>
            <div class="space-y-1 text-sm">
              <p class="font-semibold">${estimate.clientName}</p>
              <p class="text-gray-600">Client Address Line 1</p>
              <p class="text-gray-600">City, State - Pincode</p>
              <p class="text-gray-600">Mobile: +91 XXXXXXXXXX</p>
            </div>
          </div>
          <div>
            <h3 class="font-bold text-sm mb-3 text-blue-600 border-b border-gray-300 pb-1">Estimate Details:</h3>
            <div class="space-y-1 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-600">Estimate No:</span>
                <span class="font-semibold">${estimate.referenceNo}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Estimate Date:</span>
                <span>${new Date(estimate.date).toLocaleDateString('en-IN')}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Valid Until:</span>
                <span>${new Date(estimate.validUntil).toLocaleDateString('en-IN')}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Status:</span>
                <span class="capitalize font-semibold">${estimate.status}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Items Table -->
        <div class="mb-6">
          <table class="w-full border-collapse border border-gray-400 text-sm">
            <thead>
              <tr class="bg-blue-600 text-white">
                <th class="border border-gray-400 p-2 text-center font-semibold w-12">#</th>
                <th class="border border-gray-400 p-2 text-left font-semibold">Description of Goods</th>
                <th class="border border-gray-400 p-2 text-center font-semibold w-16">Qty</th>
                <th class="border border-gray-400 p-2 text-center font-semibold w-16">Unit</th>
                <th class="border border-gray-400 p-2 text-center font-semibold w-24">Rate</th>
                <th class="border border-gray-400 p-2 text-center font-semibold w-24">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${estimate.items?.map((item: EstimateItem, index: number) => `
                <tr>
                  <td class="border border-gray-400 p-2 text-center">${index + 1}</td>
                  <td class="border border-gray-400 p-2">${item.name}</td>
                  <td class="border border-gray-400 p-2 text-center">${item.quantity}</td>
                  <td class="border border-gray-400 p-2 text-center">Pcs</td>
                  <td class="border border-gray-400 p-2 text-right">₹${item.price?.toFixed(2)}</td>
                  <td class="border border-gray-400 p-2 text-right">₹${(item.quantity * item.price)?.toFixed(2)}</td>
                </tr>
              `).join('') || ''}
              ${Array.from({ length: Math.max(0, 5 - (estimate.items?.length || 0)) }).map(() => `
                <tr>
                  <td class="border border-gray-400 p-2 text-center">&nbsp;</td>
                  <td class="border border-gray-400 p-2">&nbsp;</td>
                  <td class="border border-gray-400 p-2 text-center">&nbsp;</td>
                  <td class="border border-gray-400 p-2 text-center">&nbsp;</td>
                  <td class="border border-gray-400 p-2 text-right">&nbsp;</td>
                  <td class="border border-gray-400 p-2 text-right">&nbsp;</td>
                </tr>
              `).join('')}
              <tr>
                <td colspan="5" class="border border-gray-400 p-2 text-right font-semibold">Sub Total:</td>
                <td class="border border-gray-400 p-2 text-right font-semibold">₹${subTotal.toFixed(2)}</td>
              </tr>
              <tr>
                <td colspan="5" class="border border-gray-400 p-2 text-right">CGST (9%):</td>
                <td class="border border-gray-400 p-2 text-right">₹${(taxAmount / 2).toFixed(2)}</td>
              </tr>
              <tr>
                <td colspan="5" class="border border-gray-400 p-2 text-right">SGST (9%):</td>
                <td class="border border-gray-400 p-2 text-right">₹${(taxAmount / 2).toFixed(2)}</td>
              </tr>
              <tr class="bg-blue-100">
                <td colspan="5" class="border border-gray-400 p-2 text-right font-bold text-lg">Grand Total:</td>
                <td class="border border-gray-400 p-2 text-right font-bold text-lg">₹${grandTotal.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Terms Section -->
        <div class="grid grid-cols-3 gap-6 mb-8">
          <div>
            <h3 class="font-bold text-sm mb-2 text-blue-600">Estimate Amount In Words:</h3>
            <div class="border border-gray-300 p-3 min-h-80 bg-gray-50">
              <p class="text-sm font-semibold">${amountInWords}</p>
            </div>
          </div>
          <div>
            <h3 class="font-bold text-sm mb-2 text-blue-600">Terms & Conditions:</h3>
            <div class="border border-gray-300 p-3 min-h-80 bg-gray-50">
              <div class="text-xs space-y-1">
                <p>1. Goods once sold will not be taken back.</p>
                <p>2. Interest @ 18% p.a. will be charged if the payment is not made within due date.</p>
                <p>3. Subject to jurisdiction only.</p>
                ${estimate.terms ? `<p>4. ${estimate.terms}</p>` : ''}
              </div>
            </div>
          </div>
          <div>
            <h3 class="font-bold text-sm mb-2 text-blue-600">For: ${details.companyName || 'Your Company Name'}</h3>
            <div class="border border-gray-300 p-3 min-h-80 bg-gray-50 flex flex-col justify-end">
              <div class="mt-8 text-center">
                <div class="border-t border-gray-600 pt-2 mx-4">
                  <p class="text-xs font-semibold">Authorized Signatory</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        ${estimate.notes ? `
          <div class="mb-6">
            <h3 class="font-bold text-sm mb-2 text-blue-600">Additional Notes:</h3>
            <div class="border border-gray-300 p-3 bg-gray-50">
              <p class="text-sm">${estimate.notes}</p>
            </div>
          </div>
        ` : ''}

        <div class="text-center text-xs text-gray-500 mt-8 pt-4 border-t border-gray-300">
          <p>This is a computer generated estimate and does not require physical signature.</p>
        </div>
      </body>
    </html>
  `;
};
