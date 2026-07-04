<?php
require_once 'db_connect.php';
header('Content-Type: application/json');
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $fullName = filter_var($_POST['fullName'] ?? '', FILTER_SANITIZE_STRING);
    $email = filter_var($_POST['email'] ?? '', FILTER_SANITIZE_EMAIL);
    $password = $_POST['password'] ?? '';
    if (empty($fullName) || empty($email) || empty($password)) {
        echo json_encode(['success' => false, 'message' => 'All fields are required']);
        exit;
    }
    if (strlen($password) < 6) {
        echo json_encode(['success' => false, 'message' => 'Password must be at least 6 characters']);
        exit;
    }
    try {
        $checkStmt = $pdo->prepare("SELECT id FROM users WHERE email = :email");
        $checkStmt->execute(['email' => $email]);
        if ($checkStmt->fetch()) {
            echo json_encode(['success' => false, 'message' => 'Email is already registered']);
            exit;
        }
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
        $stmt = $pdo->prepare("INSERT INTO users (full_name, email, password, role) VALUES (:name, :email, :pass, 'user')");
        $stmt->execute([
            'name' => $fullName,
            'email' => $email,
            'pass' => $hashedPassword
        ]);
        echo json_encode(['success' => true, 'message' => 'Account created successfully']);
    } catch (\PDOException $e) {
        http_response_code(200);
        echo json_encode(['success' => false, 'message' => 'Database error during registration']);
    }
} else {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method Not Allowed']);
}
?>
