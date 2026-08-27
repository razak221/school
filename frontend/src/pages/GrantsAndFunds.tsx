import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { BentoCard } from '../components/BentoCard';
import { StatCard } from '../components/StatCard';
import { Wallet, Utensils, ArrowUpRight, CheckCircle2, ShieldCheck, Plus, Download } from 'lucide-react';

export const GrantsAndFunds: React.FC = () => {
  const [grants, setGrants] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>({ totalAllocated: 250000, totalUtilized: 185000, balanceAvailable: 65000 });
  const [mdmLogs, setMdmLogs] = useState<any[]>([]);
  const [, setLoading] = useState(false);

  // Grant Modal State
  const [showGrantModal, setShowGrantModal] = useState(false);
  const [grantType, setGrantType] = useState('ssa_grant');
  const [grantTitle, setGrantTitle] = useState('');
  const [grantAmount, setGrantAmount] = useState<number>(10000);
  const [grantCategory, setGrantCategory] = useState<'credit' | 'debit'>('credit');
  const [grantSanctionNo, setGrantSanctionNo] = useState('');
  const [grantDesc, setGrantDesc] = useState('');
  const [savingGrant, setSavingGrant] = useState(false);

  // MDM Log Modal State
  const [showMdmModal, setShowMdmModal] = useState(false);
  const [mdmDate, setMdmDate] = useState(new Date().toISOString().split('T')[0]);
  const [mdmMenu, setMdmMenu] = useState('Rajma Chawal with Mixed Vegetable Greens');
  const [mdmRiceKg, setMdmRiceKg] = useState(25);
  const [mdmExpense, setMdmExpense] = useState(480);
  const [mdmServed, setMdmServed] = useState(232);
  const [mdmRemarks, setMdmRemarks] = useState('Fresh nutritious lunch inspected and approved by VEC committee.');
  const [savingMdm, setSavingMdm] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [gRes, mRes] = await Promise.all([api.getGrants(), api.getMdmLogs()]);
      if (gRes.success) {
        setGrants(gRes.grants);
        if (gRes.summary) setSummary(gRes.summary);
      }
      if (mRes.success) {
        setMdmLogs(mRes.logs);
      }
    } catch (err) {
      console.error('Failed to load grant data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddGrant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!grantTitle || !grantAmount) return;
    setSavingGrant(true);
    try {
      const res = await api.createGrant({
        type: grantType,
        title: grantTitle,
        amount: Number(grantAmount),
        category: grantCategory,
        sanctionNumber: grantSanctionNo || `SED/SSA/${new Date().getFullYear()}/${Math.floor(1000 + Math.random() * 9000)}`,
        description: grantDesc,
      });
      if (res.success) {
        setShowGrantModal(false);
        setGrantTitle('');
        setGrantDesc('');
        fetchData();
      }
    } catch (err) {
      console.error('Failed to add grant transaction', err);
    } finally {
      setSavingGrant(false);
    }
  };

  const handleAddMdm = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingMdm(true);
    try {
      const res = await api.saveMdmLog({
        date: mdmDate,
        menuServed: mdmMenu,
        riceConsumedKg: Number(mdmRiceKg),
        vegetablesExpense: Number(mdmExpense),
        studentsServedCount: Number(mdmServed),
        totalEnrolledCount: 248,
        remarks: mdmRemarks,
      });
      if (res.success) {
        setShowMdmModal(false);
        fetchData();
      }
    } catch (err) {
      console.error('Failed to record MDM log', err);
    } finally {
      setSavingMdm(false);
    }
  };

  const handleExportCsv = () => {
    if (!grants.length) return;
    const headers = ['Date', 'Title', 'Category', 'Scheme Type', 'Amount (INR)', 'Sanction / Bill No', 'Description'];
    const rows = grants.map((g) => [
      new Date(g.allocatedDate).toISOString().split('T')[0],
      `"${g.title}"`,
      g.category.toUpperCase(),
      g.type,
      g.amount,
      `"${g.sanctionNumber || 'N/A'}"`,
      `"${g.description || ''}"`,
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `SSA_Grants_Ledger_GMS_Awanpora_${new Date().toISOString().split('T')[0]}.csv`);
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-[#002147]">SSA Grants & Mid-Day Meal (PM-POSHAN)</h2>
            <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-blue-50 text-[#0c6780] border border-blue-200">
              Session 2026-27
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Govt Middle School Awanpora • Transparent fund tracking and daily nutritional distribution
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportCsv}
            title="Download Grants Statement CSV"
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-all flex items-center gap-1.5 text-xs font-bold"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export Statement</span>
          </button>
          <button
            onClick={() => setShowGrantModal(true)}
            className="px-3.5 py-1.5 rounded-xl bg-[#002147] text-white text-xs font-bold hover:bg-[#0c6780] transition-all flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            Record Transaction
          </button>
          <button
            onClick={() => setShowMdmModal(true)}
            className="px-3.5 py-1.5 rounded-xl bg-amber-500 text-white text-xs font-bold hover:bg-amber-600 transition-all flex items-center gap-1.5 shadow-sm"
          >
            <Utensils className="w-3.5 h-3.5" />
            Log Today's Meal
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-12 gap-4">
        <StatCard
          title="Total Grants Sanctioned"
          value={`₹${(summary.totalAllocated / 1000).toFixed(0)},000`}
          subtitle="Annual Composite & Special Grants"
          trend={{ value: "All Schemes Active", isPositive: true }}
          icon={<Wallet className="w-5 h-5" />}
          iconBg="bg-blue-50 text-[#002147]"
          span="col-span-12 sm:col-span-6 lg:col-span-4"
        />

        <StatCard
          title="Grants Utilized"
          value={`₹${(summary.totalUtilized / 1000).toFixed(0)},000`}
          subtitle="School infrastructure, library & repair"
          trend={{ value: "VEC Approved", isPositive: true }}
          icon={<ArrowUpRight className="w-5 h-5" />}
          iconBg="bg-indigo-50 text-indigo-700"
          span="col-span-12 sm:col-span-6 lg:col-span-4"
        />

        <StatCard
          title="Available Balance"
          value={`₹${(summary.balanceAvailable / 1000).toFixed(0)},000`}
          subtitle="Unspent balance in school account"
          trend={{ value: "Audited", isPositive: true }}
          icon={<ShieldCheck className="w-5 h-5" />}
          iconBg="bg-emerald-50 text-emerald-700"
          span="col-span-12 sm:col-span-6 lg:col-span-4"
        />
      </div>

      {/* Two Column Bento */}
      <div className="grid grid-cols-12 gap-5">
        {/* Grants Ledger */}
        <BentoCard
          title="Grant Allocation & Expenditure Ledger"
          subtitle="Samagra Shiksha Abhiyan Sanctions & Receipts"
          icon={<Wallet className="w-4 h-4" />}
          span="col-span-12 lg:col-span-7"
        >
          <div className="space-y-3">
            {grants.map((g) => (
              <div
                key={g._id}
                className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3 hover:border-slate-300 transition-all"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                        g.category === 'credit'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {g.category === 'credit' ? 'Sanctioned' : 'Disbursed'}
                    </span>
                    <span className="text-[11px] text-slate-500 font-mono">
                      {g.sanctionNumber || 'GEN-EXP'}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900">{g.title}</h4>
                  <p className="text-[11px] text-slate-500">{g.description}</p>
                </div>

                <div className="text-right shrink-0">
                  <div
                    className={`text-sm font-extrabold ${
                      g.category === 'credit' ? 'text-emerald-700' : 'text-slate-800'
                    }`}
                  >
                    {g.category === 'credit' ? '+' : '-'}₹{g.amount.toLocaleString()}
                  </div>
                  <span className="text-[10px] text-slate-400">
                    {new Date(g.allocatedDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </BentoCard>

        {/* Mid-Day Meal Daily Log */}
        <BentoCard
          title="PM-POSHAN (MDM) Daily Distribution Log"
          subtitle="Nutrition, menu and cook attendance"
          icon={<Utensils className="w-4 h-4" />}
          span="col-span-12 lg:col-span-5"
        >
          <div className="space-y-3">
            {mdmLogs.map((m) => (
              <div
                key={m._id}
                className="p-3.5 rounded-xl bg-gradient-to-br from-amber-50/50 to-white border border-amber-200/70 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#002147]">{m.date}</span>
                  <span className="text-[10px] font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-full">
                    {m.studentsServedCount} / {m.totalEnrolledCount} Served
                  </span>
                </div>

                <div className="text-xs font-bold text-slate-800">
                  🍲 Menu: {m.menuServed}
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 bg-white/80 p-2 rounded-lg border border-amber-100">
                  <div>
                    Rice: <strong>{m.riceConsumedKg} kg</strong>
                  </div>
                  <div>
                    Veg Expense: <strong>₹{m.vegetablesExpense}</strong>
                  </div>
                </div>

                <p className="text-[11px] text-slate-500 italic">
                  "{m.remarks}"
                </p>

                <div className="pt-1 border-t border-amber-100 flex items-center justify-between text-[10px] text-slate-400">
                  <span>Inspected: <strong>Nissar Ahmad (GLT)</strong></span>
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Certified
                  </span>
                </div>
              </div>
            ))}
          </div>
        </BentoCard>
      </div>

      {/* Modal for Recording Grant Transaction */}
      {showGrantModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-sm text-[#002147]">Record Fund / Grant Transaction</h3>
              <button onClick={() => setShowGrantModal(false)} className="text-slate-400 font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleAddGrant} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-600 uppercase">Transaction Category</label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <button
                    type="button"
                    onClick={() => setGrantCategory('credit')}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                      grantCategory === 'credit'
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                        : 'bg-slate-50 text-slate-700'
                    }`}
                  >
                    + Grant Sanction (Credit)
                  </button>
                  <button
                    type="button"
                    onClick={() => setGrantCategory('debit')}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                      grantCategory === 'debit'
                        ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                        : 'bg-slate-50 text-slate-700'
                    }`}
                  >
                    - Expense / Bill (Debit)
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 uppercase">Scheme / Grant Type</label>
                <select
                  value={grantType}
                  onChange={(e) => setGrantType(e.target.value)}
                  className="w-full mt-1 px-3 py-2 text-xs border border-slate-300 rounded-xl"
                >
                  <option value="ssa_grant">SSA Annual Composite School Grant</option>
                  <option value="library_grant">Library & Reading Corner Grant</option>
                  <option value="sports_grant">Sports & Physical Education Fund</option>
                  <option value="maintenance_fund">School Maintenance & Winterization</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 uppercase">Transaction Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Science Lab Equipment Purchase"
                  value={grantTitle}
                  onChange={(e) => setGrantTitle(e.target.value)}
                  className="w-full mt-1 px-3 py-2 text-xs border border-slate-300 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-slate-600 uppercase">Amount (₹)</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={grantAmount}
                    onChange={(e) => setGrantAmount(Number(e.target.value))}
                    className="w-full mt-1 px-3 py-2 text-xs border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-600 uppercase">Sanction / Bill No.</label>
                  <input
                    type="text"
                    placeholder="Optional"
                    value={grantSanctionNo}
                    onChange={(e) => setGrantSanctionNo(e.target.value)}
                    className="w-full mt-1 px-3 py-2 text-xs border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 uppercase">Description</label>
                <textarea
                  rows={2}
                  placeholder="Details of the expenditure or sanction approval..."
                  value={grantDesc}
                  onChange={(e) => setGrantDesc(e.target.value)}
                  className="w-full mt-1 px-3 py-2 text-xs border border-slate-300 rounded-xl"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowGrantModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingGrant}
                  className="px-4 py-2 bg-[#002147] text-white text-xs font-bold hover:bg-[#0c6780] rounded-xl shadow-sm disabled:opacity-50"
                >
                  {savingGrant ? 'Saving...' : 'Save Transaction'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal for Recording Daily PM-POSHAN MDM Log */}
      {showMdmModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-sm text-[#002147]">Log Daily PM-POSHAN Meal</h3>
              <button onClick={() => setShowMdmModal(false)} className="text-slate-400 font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleAddMdm} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-600 uppercase">Date</label>
                <input
                  type="date"
                  required
                  value={mdmDate}
                  onChange={(e) => setMdmDate(e.target.value)}
                  className="w-full mt-1 px-3 py-2 text-xs border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 uppercase">Menu Served</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rajma Chawal with Boiled Egg"
                  value={mdmMenu}
                  onChange={(e) => setMdmMenu(e.target.value)}
                  className="w-full mt-1 px-3 py-2 text-xs border border-slate-300 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-slate-600 uppercase">Rice (kg)</label>
                  <input
                    type="number"
                    required
                    value={mdmRiceKg}
                    onChange={(e) => setMdmRiceKg(Number(e.target.value))}
                    className="w-full mt-1 px-3 py-2 text-xs border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-600 uppercase">Veg Expense (₹)</label>
                  <input
                    type="number"
                    required
                    value={mdmExpense}
                    onChange={(e) => setMdmExpense(Number(e.target.value))}
                    className="w-full mt-1 px-3 py-2 text-xs border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-600 uppercase">Meals Served</label>
                  <input
                    type="number"
                    required
                    value={mdmServed}
                    onChange={(e) => setMdmServed(Number(e.target.value))}
                    className="w-full mt-1 px-3 py-2 text-xs border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 uppercase">Inspection Remarks</label>
                <textarea
                  rows={2}
                  value={mdmRemarks}
                  onChange={(e) => setMdmRemarks(e.target.value)}
                  className="w-full mt-1 px-3 py-2 text-xs border border-slate-300 rounded-xl"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowMdmModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingMdm}
                  className="px-4 py-2 bg-amber-500 text-white text-xs font-bold hover:bg-amber-600 rounded-xl shadow-sm disabled:opacity-50"
                >
                  {savingMdm ? 'Saving...' : 'Record Meal Log'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
