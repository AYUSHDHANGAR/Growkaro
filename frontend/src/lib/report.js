import { formatPercent, getAdDecision, getBudgetAllocation, getTopResultAds } from "@/lib/analysis";
function escapeHtml(value) {
    return value.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[char] ?? char);
}
const currencyFormatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
});
export function openPdfReport(record, totalBudget = 10000) {
    const adDetails = getTopResultAds(record.stats);
    const budgetPlan = getBudgetAllocation(record.stats, totalBudget);
    const adRows = adDetails
        .map((ad, index) => {
        const decision = getAdDecision(ad, index, record.stats.overallCtr);
        const budget = budgetPlan.find((item) => item.ad === ad.ad);
        return `
        <tr>
          <td>#${ad.rank}</td>
          <td>${escapeHtml(ad.ad)}</td>
          <td>${ad.impressions.toLocaleString()}</td>
          <td>${ad.clicks.toLocaleString()}</td>
          <td>${formatPercent(ad.ctr)}</td>
          <td>${escapeHtml(decision.label)}</td>
          <td>${budget ? currencyFormatter.format(budget.budget) : "-"}</td>
          <td>${escapeHtml(decision.meaning)}</td>
        </tr>
      `;
    })
        .join("");
    const reportWindow = window.open("", "_blank", "noopener,noreferrer,width=960,height=720");
    if (!reportWindow)
        return;
    reportWindow.document.write(`
    <!doctype html>
    <html>
      <head>
        <title>GrowKaro Result Report</title>
        <style>
          body { font-family: Arial, Helvetica, sans-serif; margin: 40px; color: #162017; }
          .brand { color: #137A2F; font-weight: 900; font-size: 30px; }
          h1 { font-size: 28px; margin: 20px 0 8px; }
          .meta { color: #5b665e; }
          .cards { display: grid; grid-template-columns: repeat(5, 1fr); gap: 10px; margin: 24px 0; }
          .card { border: 1px solid #d7e4da; border-radius: 8px; padding: 14px; }
          .label { color: #637066; font-size: 11px; text-transform: uppercase; font-weight: 800; }
          .value { font-size: 22px; font-weight: 900; margin-top: 8px; }
          table { width: 100%; border-collapse: collapse; margin-top: 18px; }
          th, td { border-bottom: 1px solid #dbe7dd; padding: 10px; text-align: left; }
          th { color: #53615a; font-size: 12px; text-transform: uppercase; }
          .recommendation { border-left: 5px solid #58B535; background: #f3fbf5; padding: 14px; margin: 20px 0; }
          li { margin: 8px 0; }
          @media print { button { display: none; } body { margin: 24px; } }
        </style>
      </head>
      <body>
        <button onclick="window.print()" style="float:right;padding:10px 14px;border:0;border-radius:8px;background:#58B535;color:#07130B;font-weight:900;">Save as PDF</button>
        <div class="brand">GrowKaro</div>
        <p class="meta">Result report for ${escapeHtml(record.ownerName)} - ${new Date(record.createdAt).toLocaleString()}</p>
        <h1>${escapeHtml(record.qualityLabel)} ad performance</h1>
        <div class="recommendation">${escapeHtml(record.recommendation)}</div>
        <div class="recommendation"><strong>Plain answer:</strong> This report shows all ${adDetails.length} ads in rank order. Put the biggest budget into higher-ranked ads and improve lower-ranked ads before scaling them.</div>
        <div class="cards">
          <div class="card"><div class="label">GrowScore</div><div class="value">${record.growScore}</div></div>
          <div class="card"><div class="label">CTR</div><div class="value">${formatPercent(record.stats.overallCtr)}</div></div>
          <div class="card"><div class="label">Clicks</div><div class="value">${record.stats.totalClicks.toLocaleString()}</div></div>
          <div class="card"><div class="label">Ads ranked</div><div class="value">${adDetails.length}</div></div>
          <div class="card"><div class="label">Budget</div><div class="value">${currencyFormatter.format(totalBudget)}</div></div>
        </div>
        <h2>Top ranked ads and budget</h2>
        <table>
          <thead><tr><th>Rank</th><th>Ad</th><th>Impressions</th><th>Clicks</th><th>CTR</th><th>Decision</th><th>Budget</th><th>Meaning</th></tr></thead>
          <tbody>${adRows}</tbody>
        </table>
        <h2>Recommended actions</h2>
        <ul>${record.nextActions.map((action) => `<li>${escapeHtml(action)}</li>`).join("")}</ul>
      </body>
    </html>
  `);
    reportWindow.document.close();
    reportWindow.focus();
}
