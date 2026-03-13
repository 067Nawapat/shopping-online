<?php
session_start();
if (!isset($_SESSION['admin_id']) || $_SESSION['admin_role'] !== 'admin') {
    header('Location: login.php');
    exit;
}

$conn = new mysqli("localhost", "root", "", "shopping_db");
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
$conn->set_charset("utf8mb4");
?>