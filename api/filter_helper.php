<?php
function getFilterSql($tableAlias = '', $hasExistingWhere = true) {
    $where = [];
    $params = [];
    
    $prefix = $tableAlias ? $tableAlias . '.' : '';
    
    // Define which aliases support which filters
    // '' = transactions, 'b' = budgets, 'c' = customers, 'i' = invoices, 'p' = products, 'ps' = product_sales
    $supportsRegion = ($tableAlias === '' || $tableAlias === 'c');
    $supportsDept = ($tableAlias === '' || $tableAlias === 'b');
    $supportsProduct = ($tableAlias === '' || $tableAlias === 'p');
    $supportsDate = ($tableAlias === '' || $tableAlias === 'i' || $tableAlias === 'ps');
    
    if ($supportsRegion && !empty($_GET['region']) && $_GET['region'] !== 'All Regions') {
        $where[] = $prefix . "region = ?";
        $params[] = $_GET['region'];
    }
    
    if ($supportsDept && !empty($_GET['department']) && $_GET['department'] !== 'All Departments') {
        $where[] = $prefix . "department = ?";
        $params[] = $_GET['department'];
    }
    
    if ($supportsDate && !empty($_GET['date']) && $_GET['date'] !== 'all') {
        $dateCol = $prefix . "transaction_date";
        if ($tableAlias === 'i') $dateCol = $prefix . "issue_date";
        if ($tableAlias === 'ps') $dateCol = $prefix . "sale_date";
        
        $date = $_GET['date'];
        if ($date === 'this_month') {
            $where[] = "$dateCol >= DATE_FORMAT(CURRENT_DATE, '%Y-%m-01')";
        } else if ($date === 'last_month') {
            $where[] = "$dateCol >= DATE_FORMAT(CURRENT_DATE - INTERVAL 1 MONTH, '%Y-%m-01') AND $dateCol < DATE_FORMAT(CURRENT_DATE, '%Y-%m-01')";
        } else if ($date === 'quarter') {
            $where[] = "QUARTER($dateCol) = QUARTER(CURRENT_DATE) AND YEAR($dateCol) = YEAR(CURRENT_DATE)";
        } else if ($date === 'year') {
            $where[] = "YEAR($dateCol) = YEAR(CURRENT_DATE)";
        }
    }
    
    if ($supportsProduct && !empty($_GET['product']) && $_GET['product'] !== 'All Products') {
        if ($tableAlias === 'p') {
            $where[] = "p.category = ?";
            $params[] = $_GET['product'];
        } else if ($tableAlias === '') {
             $where[] = "category = ?";
             $params[] = $_GET['product'];
        }
    }
    
    $sql = '';
    if (count($where) > 0) {
        $sql = ($hasExistingWhere ? " AND " : " WHERE ") . implode(" AND ", $where);
    }
    
    return ['sql' => $sql, 'params' => $params];
}
?>
