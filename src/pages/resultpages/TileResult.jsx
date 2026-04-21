import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  Printer,
  RefreshCw,
  Building,
  Calendar,
  Beaker,
} from "lucide-react";
import nitclogo from "../../assets/NITC_logo.png";
import { calculateTileWithSubtests } from "../../utils/calculations/tileCalc";

const displayValue = (value, fallback = "-") => {
  if (value === null || value === undefined || value === "") {
    return fallback;
  }
  return value;
};

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

const TileResult = ({ onRestart }) => {
  const location = useLocation();
  const { inputs } = location.state || {};
  const status = "PASS";

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  if (!inputs) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <p className="text-slate-600 font-semibold">No data provided</p>
        </div>
      </div>
    );
  }

  const results = calculateTileWithSubtests(inputs);
  const { common, subtests, specimens, averages } = results;
  const commonData = common || {};

  const getStatusTheme = () => {
    if (status === "PASS") {
      return { badge: "bg-emerald-600" };
    }
    if (status === "FAIL") {
      return { badge: "bg-red-600" };
    }
    return { badge: "bg-amber-600" };
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
          <ReportHeader title="Tile Test Report" />

          <main className="flex-1 flex flex-col">
            <div className="mb-4 flex flex-row justify-between items-center bg-white/85 rounded-2xl p-3 border border-slate-300">
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
                Status: {status}
              </div>
            </div>

            <section className="grid grid-cols-2 gap-6 mb-4 text-[10px]">
              <div className="space-y-1.5">
                <h3 className="flex items-center gap-2 text-[9px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-100 pb-1">
                  <Building size={10} /> Client Details
                </h3>
                <div className="grid grid-cols-[70px_1fr] gap-y-1">
                  <span className="text-slate-600">Client:</span>
                  <span className="font-semibold text-slate-900">
                    {displayValue(commonData.client)}
                  </span>
                  <span className="text-slate-600">Address:</span>
                  <span className="font-medium text-slate-800">
                    {displayValue(commonData.clientAddress)}
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
                    {displayValue(commonData.sampleIdentification)}
                  </span>
                  <span className="text-slate-600">Type:</span>
                  <span className="font-medium text-slate-800">Ceramic Tiles</span>
                  <span className="text-slate-600">Test Date:</span>
                  <span className="font-medium text-slate-800">
                    {displayValue(commonData.dateTesting)}
                  </span>
                  <span className="text-slate-600">Remarks:</span>
                  <span className="font-medium text-slate-800">
                    {displayValue(commonData.remarks)}
                  </span>
                </div>
              </div>
            </section>

            <section className="mb-6 space-y-8">
              {subtests.dimension?.enabled && (
                <div>
                  <h3 className="text-[10px] font-bold text-slate-900 mb-2">
                    (1) Test for Dimension: Length (to the nearest 0.1 mm)
                  </h3>
                  <div className="overflow-hidden border border-slate-400 rounded-lg">
                    <table className="w-full text-[9px] text-left">
                      <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-400">
                        <tr>
                          <th className="px-2 py-1.5 border-r border-slate-400 text-center">Sl. No.</th>
                          <th className="px-2 py-1.5 border-r border-slate-400 text-center">Side 1</th>
                          <th className="px-2 py-1.5 border-r border-slate-400 text-center">Side 2</th>
                          <th className="px-2 py-1.5 border-r border-slate-400 text-center">Avg.</th>
                          <th className="px-2 py-1.5 border-r border-slate-400 text-center">% deviation from work size</th>
                          <th className="px-2 py-1.5 text-center">% deviation from avg. of tiles</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-400">
                        {specimens.map((spec, idx) => (
                          <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-slate-50/50"}>
                            <td className="px-2 py-1 border-r border-slate-400 text-center font-semibold">{idx + 1}</td>
                            <td className="px-2 py-1 border-r border-slate-400 text-center">{spec.dimensionCalc?.side1length || "-"}</td>
                            <td className="px-2 py-1 border-r border-slate-400 text-center">{spec.dimensionCalc?.side2length || "-"}</td>
                            <td className="px-2 py-1 border-r border-slate-400 text-center font-semibold">{spec.dimensionCalc?.lengthAvg || "-"}</td>
                            <td className="px-2 py-1 border-r border-slate-400 text-center">-</td>
                            <td className="px-2 py-1 text-center">-</td>
                          </tr>
                        ))}
                        <tr className="bg-slate-50 font-semibold border-t-2 border-slate-400">
                          <td colSpan="2" className="px-2 py-1 border-r border-slate-400 text-center">Avg. of tiles</td>
                          <td className="px-2 py-1 border-r border-slate-400 text-center">-</td>
                          <td className="px-2 py-1 border-r border-slate-400 text-center">{averages.dimension.lengthAvg}</td>
                          <td className="px-2 py-1 border-r border-slate-400 text-center">-</td>
                          <td className="px-2 py-1 text-center">-</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {subtests.dimension?.enabled && (
                <div>
                  <h3 className="text-[10px] font-bold text-slate-900 mb-2">
                    (2) Test for Dimension: Width (to the nearest 0.1 mm)
                  </h3>
                  <div className="overflow-hidden border border-slate-400 rounded-lg">
                    <table className="w-full text-[9px] text-left">
                      <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-400">
                        <tr>
                          <th className="px-2 py-1.5 border-r border-slate-400 text-center">Sl. No.</th>
                          <th className="px-2 py-1.5 border-r border-slate-400 text-center">Side 1</th>
                          <th className="px-2 py-1.5 border-r border-slate-400 text-center">Side 2</th>
                          <th className="px-2 py-1.5 border-r border-slate-400 text-center">Avg.</th>
                          <th className="px-2 py-1.5 border-r border-slate-400 text-center">% deviation from work size</th>
                          <th className="px-2 py-1.5 text-center">% deviation from avg. of tiles</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-400">
                        {specimens.map((spec, idx) => (
                          <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-slate-50/50"}>
                            <td className="px-2 py-1 border-r border-slate-400 text-center font-semibold">{idx + 1}</td>
                            <td className="px-2 py-1 border-r border-slate-400 text-center">{spec.dimensionCalc?.side1width || "-"}</td>
                            <td className="px-2 py-1 border-r border-slate-400 text-center">{spec.dimensionCalc?.side2width || "-"}</td>
                            <td className="px-2 py-1 border-r border-slate-400 text-center font-semibold">{spec.dimensionCalc?.widthAvg || "-"}</td>
                            <td className="px-2 py-1 border-r border-slate-400 text-center">-</td>
                            <td className="px-2 py-1 text-center">-</td>
                          </tr>
                        ))}
                        <tr className="bg-slate-50 font-semibold border-t-2 border-slate-400">
                          <td colSpan="2" className="px-2 py-1 border-r border-slate-400 text-center">Avg. of tiles</td>
                          <td className="px-2 py-1 border-r border-slate-400 text-center">-</td>
                          <td className="px-2 py-1 border-r border-slate-400 text-center">{averages.dimension.widthAvg}</td>
                          <td className="px-2 py-1 border-r border-slate-400 text-center">-</td>
                          <td className="px-2 py-1 text-center">-</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {subtests.dimension?.enabled && (
                <div>
                  <h3 className="text-[10px] font-bold text-slate-900 mb-2">
                    (3) Test for Dimension: Thickness (to the nearest 0.1 mm)
                  </h3>
                  <div className="overflow-hidden border border-slate-400 rounded-lg">
                    <table className="w-full text-[9px] text-left">
                      <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-400">
                        <tr>
                          <th className="px-2 py-1.5 border-r border-slate-400 text-center">Sl. No.</th>
                          <th className="px-2 py-1.5 border-r border-slate-400 text-center">Corner 1</th>
                          <th className="px-2 py-1.5 border-r border-slate-400 text-center">Corner 2</th>
                          <th className="px-2 py-1.5 border-r border-slate-400 text-center">Corner 3</th>
                          <th className="px-2 py-1.5 border-r border-slate-400 text-center">Corner 4</th>
                          <th className="px-2 py-1.5 text-center">Avg.</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-400">
                        {specimens.map((spec, idx) => (
                          <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-slate-50/50"}>
                            <td className="px-2 py-1 border-r border-slate-400 text-center font-semibold">{idx + 1}</td>
                            <td className="px-2 py-1 border-r border-slate-400 text-center">{spec.dimensionCalc?.side1thickness || "-"}</td>
                            <td className="px-2 py-1 border-r border-slate-400 text-center">{spec.dimensionCalc?.side2thickness || "-"}</td>
                            <td className="px-2 py-1 border-r border-slate-400 text-center">{spec.dimensionCalc?.side3thickness || "-"}</td>
                            <td className="px-2 py-1 border-r border-slate-400 text-center">{spec.dimensionCalc?.side4thickness || "-"}</td>
                            <td className="px-2 py-1 text-center font-semibold">{spec.dimensionCalc?.thicknessAvg || "-"}</td>
                          </tr>
                        ))}
                        <tr className="bg-slate-50 font-semibold border-t-2 border-slate-400">
                          <td colSpan="2" className="px-2 py-1 border-r border-slate-400 text-center">Avg. of tiles</td>
                          <td className="px-2 py-1 border-r border-slate-400 text-center">-</td>
                          <td colSpan="2" className="px-2 py-1 border-r border-slate-400 text-center">-</td>
                          <td className="px-2 py-1 text-center">{averages.dimension.thicknessAvg}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {subtests.waterAbsorption?.enabled && (
                <div>
                  <h3 className="text-[10px] font-bold text-slate-900 mb-2">
                    (4) Test for Water Absorption
                  </h3>
                  <div className="overflow-hidden border border-slate-400 rounded-lg">
                    <table className="w-full text-[9px] text-left">
                      <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-400">
                        <tr>
                          <th className="px-2 py-1.5 border-r border-slate-400 text-center">Sl. No.</th>
                          <th className="px-2 py-1.5 border-r border-slate-400 text-center">Specimen Size (mm)</th>
                          <th className="px-2 py-1.5 border-r border-slate-400 text-center">Dry Weight (g)</th>
                          <th className="px-2 py-1.5 border-r border-slate-400 text-center">Wet Weight (g)</th>
                          <th className="px-2 py-1.5 border-r border-slate-400 text-center">Suspended Weight (g)</th>
                          <th className="px-2 py-1.5 text-center">Water Absorption (%)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-400">
                        {specimens.map((spec, idx) => (
                          <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-slate-50/50"}>
                            <td className="px-2 py-1 border-r border-slate-400 text-center font-semibold">{idx + 1}</td>
                            <td className="px-2 py-1 border-r border-slate-400 text-center">{spec.waterAbsorption?.specimenSize || "-"}</td>
                            <td className="px-2 py-1 border-r border-slate-400 text-center">{spec.waterAbsorptionCalc?.dryWeight || "-"}</td>
                            <td className="px-2 py-1 border-r border-slate-400 text-center">{spec.waterAbsorptionCalc?.wetWeight || "-"}</td>
                            <td className="px-2 py-1 border-r border-slate-400 text-center">{spec.waterAbsorptionCalc?.suspendedWeight || "-"}</td>
                            <td className="px-2 py-1 text-center">{spec.waterAbsorptionCalc?.absorption || "-"}</td>
                          </tr>
                        ))}
                        <tr className="bg-slate-50 font-semibold border-t-2 border-slate-400">
                          <td className="px-2 py-1 border-r border-slate-400 text-center">Avg.</td>
                          <td className="px-2 py-1 border-r border-slate-400 text-center">-</td>
                          <td className="px-2 py-1 border-r border-slate-400 text-center">-</td>
                          <td className="px-2 py-1 border-r border-slate-400 text-center">-</td>
                          <td className="px-2 py-1 border-r border-slate-400 text-center">-</td>
                          <td className="px-2 py-1 text-center">{averages.waterAbsorption}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {subtests.crazingResistance?.enabled && (
                <div>
                  <h3 className="text-[10px] font-bold text-slate-900 mb-2">
                    (5) Test for Crazing Resistance (As per IS 13630 Part 4)
                  </h3>
                  <div className="overflow-hidden border border-slate-400 rounded-lg">
                    <table className="w-full text-[9px] text-left">
                      <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-400">
                        <tr>
                          <th className="px-2 py-1.5 border-r border-slate-400 text-center">Sl. No.</th>
                          <th className="px-2 py-1.5 border-r border-slate-400 text-center">Specimen Size (mm)</th>
                          <th className="px-2 py-1.5 border-r border-slate-400 text-center">Remarks</th>
                          <th className="px-2 py-1.5 text-center">Description</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-400">
                        {specimens.map((spec, idx) => (
                          <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-slate-50/50"}>
                            <td className="px-2 py-1 border-r border-slate-400 text-center font-semibold">{idx + 1}</td>
                            <td className="px-2 py-1 border-r border-slate-400 text-center">{spec.crazingResistance?.specimenSize || "-"}</td>
                            <td className="px-2 py-1 border-r border-slate-400 text-left text-[8px]">{spec.crazingResistance?.remarks || "-"}</td>
                            <td className="px-2 py-1 text-left text-[8px]">{spec.crazingResistance?.description || "-"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {subtests.rupture?.enabled && (
                <div>
                  <h3 className="text-[10px] font-bold text-slate-900 mb-2">
                    (6) Test for Modulus of Rupture and Breaking Strength
                  </h3>
                  <div className="overflow-hidden border border-slate-400 rounded-lg">
                    <table className="w-full text-[9px] text-left">
                      <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-400">
                        <tr>
                          <th className="px-2 py-1.5 border-r border-slate-400 text-center">Sl. No.</th>
                          <th className="px-2 py-1.5 border-r border-slate-400 text-center">Length (mm)</th>
                          <th className="px-2 py-1.5 border-r border-slate-400 text-center">Breadth (mm)</th>
                          <th className="px-2 py-1.5 border-r border-slate-400 text-center">Thickness (mm)</th>
                          <th className="px-2 py-1.5 border-r border-slate-400 text-center">Breaking Load (N)</th>
                          <th className="px-2 py-1.5 border-r border-slate-400 text-center">Breaking Strength (N)</th>
                          <th className="px-2 py-1.5 text-center">Modulus of Rupture (N/mm²)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-400">
                        {specimens.map((spec, idx) => (
                          <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-slate-50/50"}>
                            <td className="px-2 py-1 border-r border-slate-400 text-center font-semibold">{idx + 1}</td>
                            <td className="px-2 py-1 border-r border-slate-400 text-center">{spec.ruptureCalc?.length || "-"}</td>
                            <td className="px-2 py-1 border-r border-slate-400 text-center">{spec.ruptureCalc?.breadth || "-"}</td>
                            <td className="px-2 py-1 border-r border-slate-400 text-center">{spec.ruptureCalc?.thickness || "-"}</td>
                            <td className="px-2 py-1 border-r border-slate-400 text-center">{spec.ruptureCalc?.breakingLoad || "-"}</td>
                            <td className="px-2 py-1 border-r border-slate-400 text-center">{spec.ruptureCalc?.breakingStrength || "-"}</td>
                            <td className="px-2 py-1 text-center">{spec.ruptureCalc?.modulusOfRupture || "-"}</td>
                          </tr>
                        ))}
                        <tr className="bg-slate-50 font-semibold border-t-2 border-slate-400">
                          <td className="px-2 py-1 border-r border-slate-400 text-center">Avg.</td>
                          <td colSpan="5" className="px-2 py-1 text-center">-</td>
                          <td className="px-2 py-1 text-center">{averages.rupture.modulusAvg}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </section>

            <section className="flex flex-col flex-1">
              <div className="mb-6">
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1 border-b border-slate-100 inline-block">
                  Remarks
                </p>
                <div className="text-[9px] text-slate-600 space-y-0.5 leading-tight">
                  <p>
                    <span className="font-bold text-slate-700">Note 1:</span> All
                    measurements in millimeters unless otherwise specified.
                  </p>
                  <p>
                    <span className="font-bold text-slate-700">Note 2:</span> Tests
                    conducted as per relevant Indian Standards.
                  </p>
                </div>
              </div>

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

        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-white p-2 rounded-2xl shadow-xl border border-slate-200 print:hidden">
          <button
            onClick={onRestart}
            className="flex items-center gap-2 px-5 py-2.5 text-slate-600 font-bold text-sm hover:bg-slate-50 rounded-xl transition-colors"
          >
            <RefreshCw size={16} />
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

export default TileResult;