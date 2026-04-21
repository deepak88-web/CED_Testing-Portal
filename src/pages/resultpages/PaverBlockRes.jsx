import { useEffect } from "react";
import {
  Printer,
  RefreshCw,
  Building,
  Calendar,
  ClipboardList,
  Beaker,
} from "lucide-react";
import nitclogo from "../../assets/NITC_logo.png";

const ReportHeader = ({ title }) => (
  <header className="relative mb-5 shrink-0 border-b-2 border-slate-300 pb-4">
    <div className="absolute inset-x-0 top-0 h-1 rounded-full bg-gradient-to-r from-sky-500 via-cyan-400 to-teal-400" />
    <div className="flex items-center justify-center gap-4 pt-1">
      <div className="w-16 h-16 shrink-0 flex items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-white">
        <img
          src={nitclogo}
          alt="NITC Logo"
          className="w-full h-full object-contain"
          onError={(e) => {
            e.target.style.display = "none";
            e.target.nextSibling.style.display = "flex";
          }}
        />
        <div
          style={{ display: "none" }}
          className="w-16 h-16 bg-slate-900 rounded-full items-center justify-center text-white"
        >
          <span className="text-[8px] font-bold">NITC</span>
        </div>
      </div>

      <div className="text-center">
        <p className="text-[15px] font-bold uppercase tracking-[0.35em] text-sky-700">
          Department of Civil Engineering
        </p>
        <h1 className="mt-2 text-[24px] font-black uppercase tracking-[0.02em] text-slate-900 leading-none whitespace-nowrap">
          National Institute of Technology Calicut
        </h1>
        <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
          Material Testing Laboratory
        </p>
      </div>
    </div>

    <div className="mt-3 flex items-center gap-3">
      <div className="h-px flex-1 bg-slate-300" />
      <h2 className="px-4 text-lg font-serif font-bold text-slate-900 text-center">
        {title || "Test Report"}
      </h2>
      <div className="h-px flex-1 bg-slate-300" />
    </div>
  </header>
);

const ReportFooter = ({ pageNum, totalPages }) => (
  <footer className="mt-auto pt-4 border-t-2 border-sky-100 flex justify-between items-center text-[10px] uppercase tracking-[0.2em] text-slate-400 shrink-0">
    <span className="text-slate-500">NITC Material Testing Lab</span>
    <span className="font-bold text-slate-600">
      Page {pageNum} of {totalPages}
    </span>
  </footer>
);

const Page = ({ children }) => (
  <div className="compstrength-print-fit relative w-full max-w-[210mm] min-h-[297mm] mx-auto bg-[linear-gradient(180deg,#f8fdff_0%,#ffffff_14%)] border-[5px] border-sky-200 shadow-[0_16px_50px_rgba(14,116,144,0.14)] mb-10 flex flex-col p-[20mm] box-border overflow-hidden print:shadow-none print:mb-0">
    <div className="pointer-events-none absolute inset-0 border-[10px] border-white/70" />
    <div className="pointer-events-none absolute left-0 top-0 h-20 w-20 rounded-br-[2.5rem] bg-sky-100/70" />
    <div className="pointer-events-none absolute right-0 bottom-0 h-24 w-24 rounded-tl-[3rem] bg-teal-100/60" />
    {children}
  </div>
);

const ResultPage = ({ result, onRestart }) => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  const commonData = result?.formData?.commonData || {};
  const specimens = result?.specimens || result?.formData?.specimens || [];

  const getStatusTheme = () => {
    if (result.status === "PASS")
      return {
        color: "text-emerald-700",
        bg: "bg-emerald-50",
        border: "border-emerald-200",
        badge: "bg-emerald-600",
      };
    if (result.status === "FAIL")
      return {
        color: "text-red-700",
        bg: "bg-red-50",
        border: "border-red-200",
        badge: "bg-red-600",
      };
    return {
      color: "text-amber-700",
      bg: "bg-amber-50",
      border: "border-amber-200",
      badge: "bg-amber-600",
    };
  };

  const theme = getStatusTheme();
  return (
    <>
      <style>{`
        @media print {
          @page { size: A4; margin: 0; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; background: white; }
          html, body { overflow: visible; }
          .compstrength-print-fit {
            zoom: 0.96;
          }
        }
      `}</style>

      <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#e0f2fe_0%,_#f8fafc_28%,_#eef2ff_100%)] py-10 px-4 flex flex-col font-sans print:py-0 print:px-0 print:bg-white">
        <Page>
          <ReportHeader title={result?.name || "Test Report"} />
          <main className="flex-1 flex flex-col">

          {/* Meta Data Bar */}
          <div
            className="mb-4 flex flex-row justify-between items-center bg-white/85 rounded-2xl p-3 border border-slate-300"
          >
            <div className="flex gap-6 text-[10px]">
              <div className="flex items-center gap-2">
                <Calendar size={12} className="text-slate-500" />
                <span className="text-slate-600 font-medium">Date:</span>
                <span className="font-bold text-slate-800">
                  {new Date().toLocaleDateString()}
                </span>
              </div>
            </div>

            <div
              className={`px-2.5 py-1 rounded text-white text-[10px] font-bold uppercase tracking-wider print:hidden ${theme.badge}`}
            >
              Status: {result.status}
            </div>
          </div>

          {/* Details Grid */}
          <section className="grid grid-cols-2 gap-6 mb-4 text-[10px]">
            <div className="space-y-1.5">
              <h3 className="flex items-center gap-2 text-[9px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-100 pb-1">
                <Building size={10} /> Client Details
              </h3>
              <div className="grid grid-cols-[70px_1fr] gap-y-1">
                <span className="text-slate-600">Client:</span>
                <span className="font-semibold text-slate-900 ">
                  {commonData.client || "—"}
                </span>
                <span className="text-slate-600">Address:</span>
                <span className="font-medium text-slate-800">
                  {commonData.clientAddress || "—"}
                </span>
              </div>
            </div>

            <div className="space-y-1.5">
              <h3 className="flex items-center gap-2 text-[9px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-100 pb-1">
                <Beaker size={10} /> Sample Information
              </h3>
              <div className="grid grid-cols-[90px_1fr] gap-y-1">
                <span className="text-slate-600">Sample ID:</span>
                <span className="font-semibold text-slate-900">
                  {commonData.sampleIdentification || "Not Specified"}
                </span>
                <span className="text-slate-600">Description:</span>
                <span className="font-medium text-slate-800">
                  Paver blocks provided by party
                </span>
                <span className="text-slate-600">Test Standard:</span>
                <span className="font-medium text-slate-800 italic">
                  IS: 15658
                </span>
              </div>
            </div>
          </section>

          {/* Result Table */}
          <section className="mb-4">
            <h3 className="flex items-center gap-2 text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1.5">
              <ClipboardList size={10} /> Test Observations & Results
            </h3>

            <div className="overflow-hidden border border-slate-400 rounded-lg print:border-slate-400">
              <table className="w-full text-[10px] text-left">
                <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[9px] tracking-wider border-b border-slate-400 print:bg-slate-100">
                  <tr>
                    <th className="px-2 py-1.5 w-8 text-center border-r border-slate-400">
                      Sl. No.
                    </th>
                    <th className="px-3 py-1.5 text-center border-r border-slate-400">
                      Thickness (mm)
                    </th>
                    <th className="px-3 py-1.5 text-center border-r border-slate-400">
                      Load (kN)
                    </th>
                    <th className="px-3 py-1.5 text-center border-r border-slate-400">
                      Plan Area (mm²)
                    </th>
                    <th className="px-3 py-1.5 text-center border-r border-slate-400">
                      Corrected Compressive Strength (MPa)
                    </th>
                    <th className="px-3 py-1.5 text-center">
                      Average Compressive Strength (MPa)
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-400">
                  {specimens.map((s, i) => (
                    <tr
                      key={i}
                      className={`${i % 2 === 0 ? "bg-white" : "bg-slate-50/50"}`}
                    >
                      {/* Sl. No. */}
                      <td className="px-2 py-2 text-center font-bold text-slate-500 border-r border-slate-400 italic">
                        {i + 1}
                      </td>
                      {/* Thickness - Assuming thickness is part of commonData or specimenSize */}
                      <td className="px-3 py-2 text-center text-slate-700 border-r border-slate-400">
                        {commonData.thickness || "—"}
                      </td>
                      {/* Load */}
                      <td className="px-3 py-2 text-center text-slate-700 border-r border-slate-400">
                        {s.load || "—"}
                      </td>
                      {/* Plan Area */}
                      <td className="px-3 py-2 text-center text-slate-700 border-r border-slate-400">
                        {result.areaUsed || commonData.planArea || "—"}
                      </td>
                      {/* Corrected Compressive Strength */}
                      <td className="px-3 py-2 text-center text-slate-700 border-r border-slate-400">
                        {s.correctedStrengthDisplay ?? s.correctedStrength ?? "—"}
                      </td>
                      {/* Average Strength - Only show in the first row with a rowSpan to match the image layout */}
                      {i === 0 ? (
                        <td
                          className="px-3 py-2 text-center font-black text-slate-900 bg-white"
                          rowSpan={specimens.length}
                        >
                          {result.averageDisplay ?? result.calculatedValue ?? "—"}
                        </td>
                      ) : null}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Conclusion & Remarks */}
          <section className="flex flex-col flex-1">
            
            <div className="mb-6">
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1 border-b border-slate-100 inline-block">
                Remarks
              </p>
              <div className="text-[9px] text-slate-600 space-y-0.5 leading-tight">
                <p>
                  <span className="font-bold text-slate-700">Note 1:</span>{" "}
                  Specimen is not meeting the standard requirements.
                </p>
                <p>
                  <span className="font-bold text-slate-700">Note 2:</span>{" "}
                  Average Compressive strength is not in the range of the Grade.
                </p>
              </div>
            </div>

            {/* Signature Block */}
            <div className="mt-auto pt-10 pb-6">
              <div className="grid grid-cols-2 gap-10">
                <div className="text-center rounded-2xl border border-slate-200 bg-white/70 px-4 py-6">
                  <div className="h-14 border-b border-dashed border-slate-400 w-48 mx-auto mb-3" />
                  <p className="font-black text-slate-900 text-[11px] uppercase tracking-widest">
                  Tested By
                  </p>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider mt-1">
                    Lab Technician
                  </p>
                </div>
                <div className="text-center rounded-2xl border border-slate-200 bg-white/70 px-4 py-6">
                  <div className="h-14 border-b border-dashed border-slate-400 w-48 mx-auto mb-3" />
                  <p className="font-black text-slate-900 text-[11px] uppercase tracking-widest">
                  Verified By
                  </p>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider mt-1">
                    Faculty In-charge
                  </p>
                </div>
              </div>
            </div>
          </section>
          </main>
          <ReportFooter pageNum={1} totalPages={1} />
        </Page>

      {/* Action Bar */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-white p-2 rounded-2xl shadow-xl border border-slate-200 print:hidden">
        <button
          onClick={onRestart}
          className="flex items-center gap-2 px-5 py-2.5 text-slate-600 font-bold text-sm hover:bg-slate-50 rounded-xl transition-colors"
        >
          <RefreshCw size={16} />{" "}
          <span className="hidden md:inline">Restart</span>
        </button>
        <div className="w-px h-8 bg-slate-200 mx-1" />
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white font-bold text-sm rounded-xl hover:bg-slate-800 transition-all shadow-lg"
        >
          <Printer size={16} /> Print Report
        </button>
      </div>
      </div>
    </>
  );
};

export default ResultPage;







