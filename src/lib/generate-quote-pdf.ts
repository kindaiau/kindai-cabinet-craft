import type jsPDF from "jspdf";

export interface QuoteLineItem {
  id: string;
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
}

export interface QuoteData {
  businessName: string;
  businessAbn: string;
  businessAddress: string;
  businessPhone: string;
  businessEmail: string;
  clientName: string;
  clientAddress: string;
  clientEmail: string;
  quoteNumber: string;
  quoteDate: string;
  validUntil: string;
  projectName: string;
  items: QuoteLineItem[];
  notes: string;
  gstRate: number;
}

export async function generateQuotePdf(data: QuoteData): Promise<jsPDF> {
  const [{ default: JsPdfCtor }, { default: autoTable }] = await Promise.all([
    import("jspdf"),
    import("jspdf-autotable"),
  ]);

  const doc = new JsPdfCtor();
  const pageWidth = doc.internal.pageSize.getWidth();

  doc.setFillColor(255, 70, 200);
  doc.rect(0, 0, pageWidth, 8, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(40, 40, 60);
  doc.text(data.businessName || "Your Business", 20, 28);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 120);
  let yPos = 34;
  if (data.businessAbn) { doc.text(`ABN: ${data.businessAbn}`, 20, yPos); yPos += 4; }
  if (data.businessAddress) { doc.text(data.businessAddress, 20, yPos); yPos += 4; }
  if (data.businessPhone) { doc.text(data.businessPhone, 20, yPos); yPos += 4; }
  if (data.businessEmail) { doc.text(data.businessEmail, 20, yPos); yPos += 4; }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(255, 70, 200);
  doc.text("QUOTE", pageWidth - 20, 28, { align: "right" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 120);
  doc.text(`Quote #: ${data.quoteNumber}`, pageWidth - 20, 36, { align: "right" });
  doc.text(`Date: ${data.quoteDate}`, pageWidth - 20, 41, { align: "right" });
  doc.text(`Valid Until: ${data.validUntil}`, pageWidth - 20, 46, { align: "right" });

  const dividerY = Math.max(yPos + 4, 52);
  doc.setDrawColor(220, 220, 230);
  doc.line(20, dividerY, pageWidth - 20, dividerY);

  let clientY = dividerY + 8;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(40, 40, 60);
  doc.text("QUOTE TO:", 20, clientY);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(60, 60, 80);
  clientY += 6;
  if (data.clientName) { doc.text(data.clientName, 20, clientY); clientY += 4; }
  if (data.clientAddress) { doc.text(data.clientAddress, 20, clientY); clientY += 4; }
  if (data.clientEmail) { doc.text(data.clientEmail, 20, clientY); clientY += 4; }

  if (data.projectName) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(40, 40, 60);
    doc.text("PROJECT:", pageWidth / 2, dividerY + 8);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(60, 60, 80);
    doc.text(data.projectName, pageWidth / 2, dividerY + 14);
  }

  const tableStartY = clientY + 8;
  const subtotal = data.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const gst = subtotal * (data.gstRate / 100);
  const total = subtotal + gst;

  autoTable(doc, {
    startY: tableStartY,
    head: [["Description", "Qty", "Unit", "Unit Price", "Total"]],
    body: data.items.map((item) => [
      item.description,
      item.quantity.toString(),
      item.unit,
      `$${item.unitPrice.toFixed(2)}`,
      `$${(item.quantity * item.unitPrice).toFixed(2)}`,
    ]),
    headStyles: {
      fillColor: [40, 40, 60],
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 9,
    },
    bodyStyles: { fontSize: 9, textColor: [60, 60, 80] },
    alternateRowStyles: { fillColor: [248, 248, 252] },
    columnStyles: {
      0: { cellWidth: "auto" },
      1: { halign: "center", cellWidth: 20 },
      2: { halign: "center", cellWidth: 25 },
      3: { halign: "right", cellWidth: 30 },
      4: { halign: "right", cellWidth: 30 },
    },
    margin: { left: 20, right: 20 },
    theme: "grid",
    styles: { lineColor: [220, 220, 230], lineWidth: 0.3 },
  });

  const autoTableDoc = doc as jsPDF & { lastAutoTable?: { finalY: number } };
  const finalY = (autoTableDoc.lastAutoTable?.finalY ?? tableStartY) + 6;
  const totalsX = pageWidth - 20;

  doc.setFontSize(9);
  doc.setTextColor(100, 100, 120);
  doc.text("Subtotal:", totalsX - 40, finalY);
  doc.text(`$${subtotal.toFixed(2)}`, totalsX, finalY, { align: "right" });

  doc.text(`GST (${data.gstRate}%):`, totalsX - 40, finalY + 6);
  doc.text(`$${gst.toFixed(2)}`, totalsX, finalY + 6, { align: "right" });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(255, 70, 200);
  doc.text("TOTAL:", totalsX - 40, finalY + 15);
  doc.text(`$${total.toFixed(2)}`, totalsX, finalY + 15, { align: "right" });

  if (data.notes) {
    const notesY = finalY + 28;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(40, 40, 60);
    doc.text("Notes & Terms:", 20, notesY);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 120);
    const splitNotes = doc.splitTextToSize(data.notes, pageWidth - 40);
    doc.text(splitNotes, 20, notesY + 6);
  }

  const pageHeight = doc.internal.pageSize.getHeight();
  doc.setFillColor(255, 70, 200);
  doc.rect(0, pageHeight - 6, pageWidth, 6, "F");
  doc.setFontSize(7);
  doc.setTextColor(180, 180, 200);
  doc.text("Generated with Kindai — kindai.app", pageWidth / 2, pageHeight - 9, { align: "center" });

  return doc;
}
