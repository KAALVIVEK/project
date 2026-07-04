<?php
require_once 'db_connect.php';
require_once 'filter_helper.php';
header('Content-Type: application/json');

try {
    $filterTx = getFilterSql('');
    $sqlTx = $filterTx['sql'];
    $paramsTx = $filterTx['params'];

    // 1. Operating Cash Flow (Revenue - OpEx)
    $stmt = $pdo->prepare("
        SELECT 
            SUM(CASE WHEN type='revenue' THEN amount ELSE 0 END) as total_rev,
            SUM(CASE WHEN type='expense' AND category NOT IN ('Hardware', 'Software') THEN amount ELSE 0 END) as opex,
            SUM(CASE WHEN type='expense' AND category IN ('Hardware', 'Software') THEN amount ELSE 0 END) as capex
        FROM transactions
        WHERE 1=1 $sqlTx
    ");
    $stmt->execute($paramsTx);
    $cf = $stmt->fetch();
    
    $opCashFlow = $cf['total_rev'] - $cf['opex'];
    $invCashFlow = -$cf['capex'];
    
    // Ending Balance = Starting Balance (mock 100k) + OpCashFlow + InvCashFlow
    $endingBalance = 100000 + $opCashFlow + $invCashFlow;

    // Charts
    $catLabels = ['Operating Inflows', 'Operating Outflows', 'Investing Outflows'];
    $catData = [(float)$cf['total_rev'], (float)$cf['opex'], (float)$cf['capex']];

    // Chart 2: Cash Balance Trend
    $trendStmt = $pdo->prepare("
        SELECT SUBSTRING(transaction_date, 1, 7) as month_yr, 
               SUM(CASE WHEN type='revenue' THEN amount ELSE -amount END) as net_flow
        FROM transactions
        WHERE 1=1 $sqlTx
        GROUP BY month_yr
        ORDER BY month_yr ASC
    ");
    $trendStmt->execute($paramsTx);
    
    $trendLabels = [];
    $trendData = [];
    $runningBalance = 100000; // starting balance
    
    foreach ($trendStmt->fetchAll() as $row) {
        $trendLabels[] = $row['month_yr'];
        $runningBalance += (float)$row['net_flow'];
        $trendData[] = $runningBalance;
    }

    echo json_encode([
        'success' => true,
        'kpis' => [
            'opCashFlow' => $opCashFlow,
            'invCashFlow' => $invCashFlow,
            'endingBalance' => $endingBalance
        ],
        'charts' => [
            'categories' => [
                'labels' => $catLabels,
                'data' => $catData
            ],
            'trend' => [
                'labels' => $trendLabels,
                'data' => $trendData
            ]
        ]
    ]);
} catch (\PDOException $e) {
    http_response_code(200);
    echo json_encode(['success' => false, 'message' => 'Failed to fetch cash flow data: ' . $e->getMessage()]);
}
?>
