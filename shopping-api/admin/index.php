<?php
require_once 'header.php';

// Fetch stats
$stats = [
    'orders_today' => $conn->query("SELECT COUNT(*) as count FROM orders WHERE DATE(created_at) = CURDATE()")->fetch_assoc()['count'],
    'total_sales' => $conn->query("SELECT SUM(total_price) as sum FROM orders WHERE status = 'completed'")->fetch_assoc()['sum'] ?? 0,
    'new_users' => $conn->query("SELECT COUNT(*) as count FROM users WHERE DATE(created_at) = CURDATE()")->fetch_assoc()['count'],
    'pending_orders' => $conn->query("SELECT COUNT(*) as count FROM orders WHERE status = 'verifying' OR status = 'waiting'")->fetch_assoc()['count'],
];

$recent_orders = $conn->query("SELECT o.*, u.name as user_name FROM orders o JOIN users u ON o.user_id = u.id ORDER BY o.created_at DESC LIMIT 5");
?>

<div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
    <h1 class="h2">Dashboard</h1>
</div>

<div class="row">
    <div class="col-md-3 mb-4">
        <div class="card bg-primary text-white h-100">
            <div class="card-body">
                <h6 class="card-title text-uppercase small">ออเดอร์วันนี้</h6>
                <h2 class="display-6"><?= $stats['orders_today'] ?></h2>
            </div>
        </div>
    </div>
    <div class="col-md-3 mb-4">
        <div class="card bg-success text-white h-100">
            <div class="card-body">
                <h6 class="card-title text-uppercase small">ยอดขายสุทธิ</h6>
                <h2 class="display-6">฿<?= number_format($stats['total_sales']) ?></h2>
            </div>
        </div>
    </div>
    <div class="col-md-3 mb-4">
        <div class="card bg-info text-white h-100">
            <div class="card-body">
                <h6 class="card-title text-uppercase small">สมาชิกใหม่วันนี้</h6>
                <h2 class="display-6"><?= $stats['new_users'] ?></h2>
            </div>
        </div>
    </div>
    <div class="col-md-3 mb-4">
        <div class="card bg-warning text-dark h-100">
            <div class="card-body">
                <h6 class="card-title text-uppercase small">รอตรวจสอบ/จัดส่ง</h6>
                <h2 class="display-6"><?= $stats['pending_orders'] ?></h2>
            </div>
        </div>
    </div>
</div>

<div class="row">
    <div class="col-md-8 mb-4">
        <div class="card">
            <div class="card-header d-flex justify-content-between align-items-center bg-white py-3">
                <h6 class="m-0 font-weight-bold">คำสั่งซื้อล่าสุด</h6>
                <a href="orders.php" class="btn btn-sm btn-outline-primary">ดูทั้งหมด</a>
            </div>
            <div class="card-body">
                <div class="table-responsive">
                    <table class="table table-hover">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>ลูกค้า</th>
                                <th>ยอดรวม</th>
                                <th>สถานะ</th>
                                <th>วันที่</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php while($order = $recent_orders->fetch_assoc()): ?>
                            <tr>
                                <td>#<?= $order['id'] ?></td>
                                <td><?= $order['user_name'] ?></td>
                                <td>฿<?= number_format($order['total_price']) ?></td>
                                <td>
                                    <span class="badge badge-<?= $order['status'] ?>">
                                        <?= $order['status'] ?>
                                    </span>
                                </td>
                                <td><?= date('d/m/Y H:i', strtotime($order['created_at'])) ?></td>
                            </tr>
                            <?php endwhile; ?>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
    <div class="col-md-4 mb-4">
        <div class="card h-100">
            <div class="card-header bg-white py-3">
                <h6 class="m-0 font-weight-bold">ทางลัด</h6>
            </div>
            <div class="card-body">
                <div class="list-group list-group-flush">
                    <a href="products.php" class="list-group-item list-group-item-action py-3">
                        <i class="bi bi-plus-circle me-2"></i> เพิ่มสินค้าใหม่
                    </a>
                    <a href="banners.php" class="list-group-item list-group-item-action py-3">
                        <i class="bi bi-image me-2"></i> จัดการแบนเนอร์หน้าแรก
                    </a>
                    <a href="coupons.php" class="list-group-item list-group-item-action py-3">
                        <i class="bi bi-ticket-perforated me-2"></i> สร้างโค้ดส่วนลด
                    </a>
                </div>
            </div>
        </div>
    </div>
</div>

<?php require_once 'footer.php'; ?>
