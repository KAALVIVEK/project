<?php
require_once 'db_connect.php';
require_once 'filter_helper.php';
header('Content-Type: application/json');

try {
    $filterTx = getFilterSql('');
    $sqlTx = $filterTx['sql'];
    $paramsTx = $filterTx['params'];

    // 1. Revenue & Expenses
    $revStmt = $pdo->prepare("SELECT COALESCE(SUM(amount), 0) FROM transactions WHERE type = 'revenue' $sqlTx");
    $revStmt->execute($paramsTx);
    $revenue = (float)$revStmt->fetchColumn();

    $expStmt = $pdo->prepare("SELECT COALESCE(SUM(amount), 0) FROM transactions WHERE type = 'expense' $sqlTx");
    $expStmt->execute($paramsTx);
    $expenses = (float)$expStmt->fetchColumn();

    // KPIs
    $netProfit = $revenue - $expenses;
    $grossMargin = ($revenue > 0) ? round(($netProfit / $revenue) * 100, 1) : 0;
    
    $ebitda = $netProfit * 1.15;
    $ebitdaMargin = ($revenue > 0) ? round(($ebitda / $revenue) * 100, 1) : 0;

    // Chart 1: Gross Margin vs Net Profit (Trend over time)
    $trendStmt = $pdo->prepare("
        SELECT SUBSTRING(transaction_date, 1, 7) as month_yr, type, SUM(amount) as total
        FROM transactions
        WHERE 1=1 $sqlTx
        GROUP BY month_yr, type
        ORDER BY month_yr ASC
    ");
    $trendStmt->execute($paramsTx);
    
    $trendData = [];
    foreach ($trendStmt->fetchAll() as $row) {
        $m = $row['month_yr'];
        if (!isset($trendData[$m])) {
            $trendData[$m] = ['revenue' => 0, 'expense' => 0];
        }
        $trendData[$m][$row['type']] += (float)$row['total'];
    }

    $trendLabels = array_keys($trendData);
    $marginData = [];
    $profitData = [];
    foreach ($trendLabels as $lbl) {
        $r = $trendData[$lbl]['revenue'];
        $e = $trendData[$lbl]['expense'];
        $profitData[] = $r - $e;
        $marginData[] = ($r > 0) ? round((($r - $e) / $r) * 100, 1) : 0;
    }

    // Chart 2: Profitability by Region
    $regStmt = $pdo->prepare("
        SELECT region, type, SUM(amount) as total
        FROM transactions
        WHERE 1=1 $sqlTx
        GROUP BY region, type
    ");
    $regStmt->execute($paramsTx);
    $regData = [];
    foreach ($regStmt->fetchAll() as $row) {
        $rg = $row['region'];
        if (!isset($regData[$rg])) $regData[$rg] = ['revenue' => 0, 'expense' => 0];
        $regData[$rg][$row['type']] += (float)$row['total'];
    }

    $regLabels = [];
    $regProfitData = [];
    foreach ($regData as $rg => $d) {
        $regLabels[] = $rg;
        $regProfitData[] = $d['revenue'] - $d['expense'];
    }

    echo json_encode([
        'success' => true,
        'kpis' => [
            'grossMargin' => $grossMargin,
            'netProfit' => $netProfit,
            'ebitda' => $ebitdaMargin
        ],
        'charts' => [
            'trend' => [
                'labels' => $trendLabels,
                'margin' => $marginData,
                'profit' => $profitData
            ],
            'region' => [
                'labels' => $regLabels,
                'profit' => $regProfitData
            ]
        ]
    ]);
} catch (\PDOException $e) {
    http_response_code(200);
    echo json_encode(['success' => false, 'message' => 'Failed to fetch profitability data: ' . $e->getMessage()]);
}
?>
