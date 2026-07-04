<?php
require_once 'db_connect.php';
require_once 'filter_helper.php';
header('Content-Type: application/json');

try {
    $filter = getFilterSql('');
    $sqlAppend = $filter['sql'];
    $params = $filter['params'];

    // Revenue
    $revStmt = $pdo->prepare("SELECT COALESCE(SUM(amount), 0) FROM transactions WHERE type = 'revenue' $sqlAppend");
    $revStmt->execute($params);
    $totalRevenue = (float)$revStmt->fetchColumn();

    // Expenses
    $expStmt = $pdo->prepare("SELECT COALESCE(SUM(amount), 0) FROM transactions WHERE type = 'expense' $sqlAppend");
    $expStmt->execute($params);
    $totalExpenses = (float)$expStmt->fetchColumn();

    // Chart Data
    // NOTE: For the chart, we might only want to apply region/department/product filters, not the date filter since it's a trend over time.
    // However, the user expects date filters to apply globally. If they select "This Month", the trend chart will just show 1 data point.
    // For simplicity, we apply all filters to all widgets.
    $chartStmt = $pdo->prepare("
        SELECT 
            SUBSTRING(transaction_date, 1, 7) as month_yr,
            type,
            SUM(amount) as total
        FROM transactions
        WHERE 1=1 $sqlAppend
        GROUP BY month_yr, type
        ORDER BY month_yr ASC
    ");
    $chartStmt->execute($params);
    $chartData = $chartStmt->fetchAll();
    
    // Dynamically build month labels based on the data to support filtered dates
    $revenueDataMap = [];
    $expenseDataMap = [];
    $allMonths = [];
    foreach ($chartData as $row) {
        $m = $row['month_yr'];
        if (!in_array($m, $allMonths)) $allMonths[] = $m;
        if ($row['type'] === 'revenue') {
            $revenueDataMap[$m] = (float)$row['total'];
        } else {
            $expenseDataMap[$m] = (float)$row['total'];
        }
    }
    
    // Sort months just in case
    sort($allMonths);
    if (empty($allMonths)) {
        // default empty state
        $allMonths = [date('Y-m')];
    }

    $revenueData = [];
    $expenseData = [];
    $displayLabels = [];
    foreach ($allMonths as $m) {
        $displayLabels[] = date('M Y', strtotime($m . '-01'));
        $revenueData[] = $revenueDataMap[$m] ?? 0;
        $expenseData[] = $expenseDataMap[$m] ?? 0;
    }

    // Donut Chart
    $catStmt = $pdo->prepare("
        SELECT category, SUM(amount) as total
        FROM transactions
        WHERE type = 'expense' $sqlAppend
        GROUP BY category
        ORDER BY total DESC
    ");
    $catStmt->execute($params);
    $donutRows = $catStmt->fetchAll();
    
    $donutLabels = [];
    $donutValues = [];
    foreach ($donutRows as $row) {
        $donutLabels[] = $row['category'];
        $donutValues[] = (float)$row['total'];
    }

    echo json_encode([
        'success' => true,
        'kpis' => [
            'totalRevenue' => $totalRevenue,
            'totalExpenses' => $totalExpenses,
            'grossProfit' => $totalRevenue - $totalExpenses,
            'netCashFlow' => ($totalRevenue - $totalExpenses) * 0.8
        ],
        'mainChart' => [
            'labels' => $displayLabels,
            'revenue' => $revenueData,
            'expenses' => $expenseData
        ],
        'donutChart' => [
            'labels' => $donutLabels,
            'data' => $donutValues
        ]
    ]);
} catch (\PDOException $e) {
    http_response_code(200);
    echo json_encode(['success' => false, 'message' => 'Failed to fetch dashboard data: ' . $e->getMessage()]);
}
?>
