import { useState } from 'react';
import { Hotel, UtensilsCrossed, Ticket, ShoppingBag, Wallet, AlertTriangle, TrendingDown, TrendingUp, PiggyBank, Receipt } from 'lucide-react';
import ProgressBar from './ui/ProgressBar';
import { BUDGET_CATEGORIES, computeBudgetBreakdown } from '../utils/itinerary';

const CATEGORY_ICONS = {
  Accommodation: Hotel,
  Food: UtensilsCrossed,
  Activities: Ticket,
  Shopping: ShoppingBag,
  Miscellaneous: Wallet,
};

// Renders negative amounts as "-₹820" instead of the awkward "₹-820".
function formatCurrency(amount) {
  const sign = amount < 0 ? '-' : '';
  return `${sign}₹${Math.abs(amount).toLocaleString()}`;
}

export default function BudgetPlanner({ trip, itinerary, places, actualSpending, onSaveActualSpending }) {
  const [drafts, setDrafts] = useState(actualSpending || {});

  const estimatedByCategory = computeBudgetBreakdown({ itinerary, trip, places });
  const estimatedTotal = BUDGET_CATEGORIES.reduce((sum, c) => sum + estimatedByCategory[c], 0);
  const actualTotal = BUDGET_CATEGORIES.reduce((sum, c) => sum + (Number(drafts[c]) || 0), 0);
  const hasActuals = actualTotal > 0;

  const spentSoFar = hasActuals ? actualTotal : estimatedTotal;
  const remaining = trip.budget - spentSoFar;
  const overBudget = spentSoFar > trip.budget;

  function handleDraftChange(category, value) {
    setDrafts((prev) => ({ ...prev, [category]: value }));
  }

  function handleSave(category) {
    const updated = { ...drafts, [category]: Number(drafts[category]) || 0 };
    setDrafts(updated);
    onSaveActualSpending(updated);
  }

  const summaryStats = [
    { label: 'Total Budget', value: formatCurrency(trip.budget), icon: PiggyBank },
    { label: 'Estimated', value: formatCurrency(estimatedTotal), icon: Receipt },
    { label: 'Actual Spent', value: hasActuals ? formatCurrency(actualTotal) : '—', icon: Wallet },
    {
      label: 'Remaining',
      value: formatCurrency(remaining),
      icon: remaining < 0 ? TrendingDown : TrendingUp,
      tone: remaining < 0 ? 'text-danger' : 'text-success',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-ink/5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="font-semibold text-ink">Budget Summary</h3>
          {overBudget && (
            <span className="flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-danger">
              <AlertTriangle size={13} /> Over by {formatCurrency(Math.abs(remaining))}
            </span>
          )}
        </div>

        <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {summaryStats.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center gap-2 text-center sm:flex-row sm:text-left">
              <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 ${stat.tone || 'text-primary'}`}>
                <stat.icon size={16} />
              </span>
              <div>
                <p className="text-xs text-muted">{stat.label}</p>
                <p className={`text-lg font-semibold ${stat.tone || 'text-ink'}`}>{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        <ProgressBar
          value={Math.min(Math.max(spentSoFar, 0), trip.budget * 1.2)}
          max={trip.budget * 1.2}
          className="mt-5"
          barClassName={overBudget ? 'bg-danger' : 'bg-primary'}
        />
        <p className="mt-1.5 text-xs text-muted">
          {hasActuals ? 'Based on what you\'ve logged as actually spent.' : 'Based on the estimated cost — log actual spending below to track it for real.'}
        </p>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-ink/5">
        <h3 className="mb-5 font-semibold text-ink">By category</h3>
        <div className="space-y-5">
          {BUDGET_CATEGORIES.map((category) => {
            const Icon = CATEGORY_ICONS[category];
            const estimated = estimatedByCategory[category];
            const actual = drafts[category];
            const actualNum = Number(actual) || 0;
            const hasEntry = actual !== undefined && actual !== '';
            const overThisCategory = hasEntry && estimated > 0 && actualNum > estimated;

            return (
              <div key={category}>
                <div className="flex items-center gap-4">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon size={16} />
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-ink">{category}</p>
                    <p className="text-xs text-muted">Est. ₹{estimated.toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-muted">Spent ₹</span>
                    <input
                      type="number"
                      min="0"
                      placeholder="0"
                      value={actual ?? ''}
                      onChange={(e) => handleDraftChange(category, e.target.value)}
                      onBlur={() => handleSave(category)}
                      className={`h-9 w-24 rounded-lg border px-2 text-right text-sm focus:outline-none focus:ring-2 ${
                        overThisCategory
                          ? 'border-danger/40 text-danger focus:border-danger focus:ring-danger/20'
                          : 'border-ink/15 focus:border-primary focus:ring-primary/20'
                      }`}
                    />
                  </div>
                </div>
                {hasEntry && estimated > 0 && (
                  <div className="ml-[52px] mt-2">
                    <ProgressBar
                      value={Math.min(actualNum, estimated * 1.5)}
                      max={estimated * 1.5}
                      className="h-1.5"
                      barClassName={overThisCategory ? 'bg-danger' : 'bg-success'}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
