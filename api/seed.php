<?php
require_once 'db_connect.php';
header('Content-Type: application/json');
try {
    $stmt = $pdo->query("SELECT COUNT(*) FROM customers");
    if ($stmt->fetchColumn() > 0) {
        echo json_encode(['success' => true, 'message' => 'Database fully seeded already.']);
        exit;
    }
    $pdo->beginTransaction();
    $stmt = $pdo->query("SELECT COUNT(*) FROM transactions");
    if ($stmt->fetchColumn() == 0) {
        $userId = 1;
        $revCats = ['Software Sales', 'Consulting', 'Support Contracts', 'Hardware'];
        $expCats = ['Payroll', 'Marketing', 'Software', 'Office', 'Legal', 'Travel'];
        $departments = ['Sales', 'Engineering', 'HR', 'Marketing', 'Executive'];
        $months = ['2026-01', '2026-02', '2026-03', '2026-04', '2026-05', '2026-06', '2026-07'];
        foreach ($months as $month) {
            $numTx = rand(10, 20);
            for ($i = 0; $i < $numTx; $i++) {
                $isRev = rand(1, 100) > 40;
                $type = $isRev ? 'revenue' : 'expense';
                $amount = $isRev ? rand(5000, 25000) : rand(2000, 15000);
                $cat = $isRev ? $revCats[array_rand($revCats)] : $expCats[array_rand($expCats)];
                $dept = $departments[array_rand($departments)];
                $day = str_pad(rand(1, 28), 2, '0', STR_PAD_LEFT);
                $date = "$month-$day";
                $stmt = $pdo->prepare("INSERT INTO transactions (user_id, type, amount, category, department, transaction_date) VALUES (?, ?, ?, ?, ?, ?)");
                $stmt->execute([$userId, $type, $amount, $cat, $dept, $date]);
            }
        }
    }
    $customers = ['Acme Corp', 'Global Tech', 'Stark Ind.', 'Wayne Ent.', 'Cyberdyne', 'InGen', 'Massive Dynamic'];
    $regions = ['North America', 'Europe', 'Asia', 'LATAM'];
    foreach ($customers as $c) {
        $stmt = $pdo->prepare("INSERT INTO customers (company_name, region) VALUES (?, ?)");
        $stmt->execute([$c, $regions[array_rand($regions)]]);
    }
    $stmt = $pdo->query("SELECT id FROM customers");
    $customerIds = $stmt->fetchAll(PDO::FETCH_COLUMN);
    $statuses = ['Paid', 'Pending', 'Overdue'];
    for ($i = 0; $i < 50; $i++) {
        $cid = $customerIds[array_rand($customerIds)];
        $amt = rand(1000, 50000) / 100 * 100;
        $daysAgo = rand(5, 120);
        $issue = date('Y-m-d', strtotime("-$daysAgo days"));
        $due = date('Y-m-d', strtotime("$issue +30 days"));
        $status = $statuses[array_rand($statuses)];
        if (strtotime($due) < time() && $status == 'Pending') $status = 'Overdue';
        $stmt = $pdo->prepare("INSERT INTO invoices (customer_id, amount, issue_date, due_date, status) VALUES (?, ?, ?, ?, ?)");
        $stmt->execute([$cid, $amt, $issue, $due, $status]);
    }
    $products = [
        ['name' => 'Enterprise Cloud', 'category' => 'Software', 'cost' => 500],
        ['name' => 'Data Center Server', 'category' => 'Hardware', 'cost' => 2500],
        ['name' => 'Consulting Retainer', 'category' => 'Services', 'cost' => 100],
        ['name' => 'Security Audit', 'category' => 'Services', 'cost' => 300]
    ];
    foreach ($products as $p) {
        $stmt = $pdo->prepare("INSERT INTO products (name, category, unit_cost) VALUES (?, ?, ?)");
        $stmt->execute([$p['name'], $p['category'], $p['cost']]);
    }
    $stmt = $pdo->query("SELECT id, unit_cost FROM products");
    $prodData = $stmt->fetchAll(PDO::FETCH_ASSOC);
    for ($i = 0; $i < 40; $i++) {
        $p = $prodData[array_rand($prodData)];
        $units = rand(5, 50);
        $price = $p['unit_cost'] * (rand(12, 30) / 10);
        $date = date('Y-m-d', strtotime('-' . rand(1, 180) . ' days'));
        $stmt = $pdo->prepare("INSERT INTO product_sales (product_id, units_sold, sale_price_per_unit, sale_date) VALUES (?, ?, ?, ?)");
        $stmt->execute([$p['id'], $units, $price, $date]);
    }
    $risks = ['Data Breach', 'Server Outage', 'Compliance Fine', 'Vendor Bankruptcy', 'Market Crash'];
    foreach ($risks as $r) {
        $impact = rand(2, 5);
        $prob = rand(1, 5);
        $comp = (rand(1,10) > 8) ? 'Fail' : 'Pass';
        $stmt = $pdo->prepare("INSERT INTO risk_assessments (risk_name, impact_score, probability_score, compliance_status) VALUES (?, ?, ?, ?)");
        $stmt->execute([$r, $impact, $prob, $comp]);
    }
    $pdo->commit();
    echo json_encode(['success' => true, 'message' => "Successfully seeded Customers, Invoices, Products, Sales, and Risks!"]);
} catch (\PDOException $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    http_response_code(200);
    echo json_encode(['success' => false, 'message' => 'Seeding failed: ' . $e->getMessage()]);
}
?>
