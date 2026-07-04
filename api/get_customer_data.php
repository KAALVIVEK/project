<?php
require_once 'db_connect.php';
require_once 'filter_helper.php';
header('Content-Type: application/json');

try {
    $filterCust = getFilterSql('c');
    $filterInv = getFilterSql('i');
    
    $custSql = $filterCust['sql'];
    $custParams = $filterCust['params'];
    
    $invSql = $filterInv['sql'];
    $invParams = $filterInv['params'];

    // 1. Active Customers
    $custStmt = $pdo->prepare("SELECT COUNT(*) FROM customers c WHERE c.status = 'Active' $custSql");
    $custStmt->execute($custParams);
    $activeCustomers = (int)$custStmt->fetchColumn();

    // Invoices join customers for region/department(if mapped to customer) filters
    $joinInvSql = "
        SELECT COALESCE(SUM(i.amount), 0) 
        FROM invoices i 
        JOIN customers c ON i.customer_id = c.id 
        WHERE i.status != 'Paid'
    ";
    // Construct merged filters
    $mergedFilters = array_merge($invParams, $custParams);
    $mergedSql = $invSql . $custSql;

    // 2. Total AR
    $arStmt = $pdo->prepare($joinInvSql . $mergedSql);
    $arStmt->execute($mergedFilters);
    $totalAR = (float)$arStmt->fetchColumn();

    // 3. Overdue AR
    $overdueSql = str_replace("i.status != 'Paid'", "i.status = 'Overdue'", $joinInvSql);
    $overdueStmt = $pdo->prepare($overdueSql . $mergedSql);
    $overdueStmt->execute($mergedFilters);
    $overdueAR = (float)$overdueStmt->fetchColumn();

    // 4. Accounts Receivable Aging Chart
    $agingStmt = $pdo->prepare("
        SELECT 
            SUM(CASE WHEN DATEDIFF(CURDATE(), i.due_date) <= 0 THEN i.amount ELSE 0 END) as 'Current',
            SUM(CASE WHEN DATEDIFF(CURDATE(), i.due_date) BETWEEN 1 AND 30 THEN i.amount ELSE 0 END) as '1-30 Days',
            SUM(CASE WHEN DATEDIFF(CURDATE(), i.due_date) BETWEEN 31 AND 60 THEN i.amount ELSE 0 END) as '31-60 Days',
            SUM(CASE WHEN DATEDIFF(CURDATE(), i.due_date) > 60 THEN i.amount ELSE 0 END) as '60+ Days'
        FROM invoices i
        JOIN customers c ON i.customer_id = c.id
        WHERE i.status != 'Paid' $mergedSql
    ");
    $agingStmt->execute($mergedFilters);
    $aging = $agingStmt->fetch();
    
    $agingLabels = ['Current', '1-30 Days Overdue', '31-60 Days Overdue', '60+ Days Overdue'];
    $agingData = [
        (float)$aging['Current'],
        (float)$aging['1-30 Days'],
        (float)$aging['31-60 Days'],
        (float)$aging['60+ Days']
    ];

    // 5. Top Customers by Revenue Chart
    $topCustStmt = $pdo->prepare("
        SELECT c.company_name, SUM(i.amount) as total_billed
        FROM customers c
        JOIN invoices i ON c.id = i.customer_id
        WHERE 1=1 $mergedSql
        GROUP BY c.id
        ORDER BY total_billed DESC
        LIMIT 5
    ");
    $topCustStmt->execute($mergedFilters);
    
    $topCustLabels = [];
    $topCustData = [];
    foreach ($topCustStmt->fetchAll() as $row) {
        $topCustLabels[] = $row['company_name'];
        $topCustData[] = (float)$row['total_billed'];
    }

    echo json_encode([
        'success' => true,
        'kpis' => [
            'activeCustomers' => $activeCustomers,
            'totalAR' => $totalAR,
            'overdueAR' => $overdueAR
        ],
        'charts' => [
            'aging' => [
                'labels' => $agingLabels,
                'data' => $agingData
            ],
            'topCustomers' => [
                'labels' => $topCustLabels,
                'data' => $topCustData
            ]
        ]
    ]);
} catch (\PDOException $e) {
    http_response_code(200);
    echo json_encode(['success' => false, 'message' => 'Failed to fetch customer finance data: ' . $e->getMessage()]);
}
?>
