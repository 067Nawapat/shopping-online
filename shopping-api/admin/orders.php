<?php
require_once 'header.php';

// Update Order Status
if (isset($_POST['update_status'])) {
    $order_id = $_POST['order_id'];
    $new_status = $_POST['status'];
    $stmt = $conn->prepare("UPDATE orders SET status = ? WHERE id = ?");
    $stmt->bind_param("si", $new_status, $order_id);
    $stmt->execute();
    echo "<script>alert('อัปเดตสถานะสำเร็จ'); window.location.href='orders.php';</script>";
}

$status_filter = $_GET['status'] ?? '';
$where = $status_filter ? "WHERE o.status = '$status_filter'" : "";

$orders = $conn->query("SELECT o.*, u.name as user_name, u.email as user_email 
                       FROM orders o 
                       JOIN users u ON o.user_id = u.id 
                       $where 
                       ORDER BY o.created_at DESC");

$statuses = ['pending', 'waiting', 'verifying', 'rejected', 'shipping', 'cancelled', 'completed'];
?>

<div class="d-flex justify-content-between align-items-center pt-3 pb-2 mb-3 border-bottom">
    <h1 class="h2">จัดการคำสั่งซื้อ</h1>
    <div class="btn-group">
        <a href="orders.php" class="btn btn-sm btn-outline-secondary">ทั้งหมด</a>
        <a href="orders.php?status=verifying" class="btn btn-sm btn-outline-primary">รอตรวจสอบสลิป</a>
        <a href="orders.php?status=waiting" class="btn btn-sm btn-outline-info">รอจัดส่ง</a>
    </div>
</div>

<div class="card">
    <div class="card-body p-0">
        <div class="table-responsive">
            <table class="table table-hover align-middle mb-0">
                <thead class="table-light">
                    <tr>
                        <th>ID</th>
                        <th>ลูกค้า</th>
                        <th>ยอดรวม</th>
                        <th>การชำระ</th>
                        <th>สถานะ</th>
                        <th>วันที่สั่งซื้อ</th>
                        <th>จัดการ</th>
                    </tr>
                </thead>
                <tbody>
                    <?php while($order = $orders->fetch_assoc()): ?>
                    <tr>
                        <td>#<?= $order['id'] ?></td>
                        <td>
                            <strong><?= $order['user_name'] ?></strong><br>
                            <small class="text-muted"><?= $order['user_email'] ?></small>
                        </td>
                        <td>฿<?= number_format($order['total_price'], 2) ?></td>
                        <td><?= strtoupper($order['payment_method']) ?></td>
                        <td>
                            <span class="badge badge-<?= $order['status'] ?>">
                                <?= $order['status'] ?>
                            </span>
                        </td>
                        <td><?= date('d/m/Y H:i', strtotime($order['created_at'])) ?></td>
                        <td>
                            <button class="btn btn-sm btn-primary" data-bs-toggle="modal" data-bs-target="#modal-<?= $order['id'] ?>">
                                จัดการ
                            </button>

                            <!-- Modal -->
                            <div class="modal fade" id="modal-<?= $order['id'] ?>" tabindex="-1">
                                <div class="modal-dialog">
                                    <div class="modal-content">
                                        <form method="POST">
                                            <div class="modal-header">
                                                <h5 class="modal-title">จัดการออเดอร์ #<?= $order['id'] ?></h5>
                                                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                                            </div>
                                            <div class="modal-body">
                                                <input type="hidden" name="order_id" value="<?= $order['id'] ?>">
                                                
                                                <div class="mb-3">
                                                    <label class="form-label">เปลี่ยนสถานะ</label>
                                                    <select name="status" class="form-select">
                                                        <?php foreach($statuses as $s): ?>
                                                            <option value="<?= $s ?>" <?= $order['status'] == $s ? 'selected' : '' ?>><?= $s ?></option>
                                                        <?php endforeach; ?>
                                                    </select>
                                                </div>

                                                <h6>รายการสินค้า:</h6>
                                                <ul class="list-group mb-3">
                                                    <?php 
                                                    $items = $conn->query("SELECT oi.*, p.name FROM order_items oi JOIN product_variants pv ON oi.variant_id = pv.id JOIN products p ON pv.product_id = p.id WHERE oi.order_id = " . $order['id']);
                                                    while($item = $items->fetch_assoc()): ?>
                                                        <li class="list-group-item d-flex justify-content-between align-items-center">
                                                            <?= $item['name'] ?> (x<?= $item['quantity'] ?>)
                                                            <span>฿<?= number_format($item['price'] * $item['quantity'], 2) ?></span>
                                                        </li>
                                                    <?php endwhile; ?>
                                                </ul>

                                                <?php
                                                $payment = $conn->query("SELECT * FROM payments WHERE order_id = " . $order['id'])->fetch_assoc();
                                                if ($payment && $payment['slip_image']): ?>
                                                    <h6>สลิปการโอนเงิน:</h6>
                                                    <img src="../uploads/<?= $payment['slip_image'] ?>" class="img-fluid rounded border mb-2" style="max-height: 400px; width: 100%; object-fit: contain;">
                                                    <p class="small text-muted">Ref: <?= $payment['provider_ref'] ?></p>
                                                <?php endif; ?>
                                            </div>
                                            <div class="modal-footer">
                                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">ปิด</button>
                                                <button type="submit" name="update_status" class="btn btn-success">บันทึกการเปลี่ยนแปลง</button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </td>
                    </tr>
                    <?php endwhile; ?>
                </tbody>
            </table>
        </div>
    </div>
</div>

<?php require_once 'footer.php'; ?>
