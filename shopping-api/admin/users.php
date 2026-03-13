<?php
require_once 'header.php';

// Change User Role
if (isset($_POST['change_role'])) {
    $user_id = (int)$_POST['user_id'];
    $new_role = $_POST['role'];
    
    // Prevent admin from de-ranking themselves (optional security)
    if ($user_id == $_SESSION['admin_id'] && $new_role !== 'admin') {
        echo "<script>alert('คุณไม่สามารถเปลี่ยนบทบาทของตัวเองได้');</script>";
    } else {
        $stmt = $conn->prepare("UPDATE users SET role = ? WHERE id = ?");
        $stmt->bind_param("si", $new_role, $user_id);
        $stmt->execute();
        echo "<script>window.location.href='users.php';</script>";
    }
}

// Delete User
if (isset($_GET['delete'])) {
    $id = (int)$_GET['delete'];
    if ($id == $_SESSION['admin_id']) {
        echo "<script>alert('คุณไม่สามารถลบบัญชีของตัวเองได้'); window.location.href='users.php';</script>";
    } else {
        $conn->query("DELETE FROM users WHERE id = $id");
        header('Location: users.php');
    }
}

$search = $_GET['search'] ?? '';
$where = $search ? "WHERE name LIKE '%$search%' OR email LIKE '%$search%'" : "";
$users = $conn->query("SELECT * FROM users $where ORDER BY id DESC");
?>

<div class="d-flex justify-content-between align-items-center pt-3 pb-2 mb-3 border-bottom">
    <h1 class="h2">จัดการผู้ใช้งาน</h1>
    <form class="d-flex" method="GET">
        <input class="form-control form-control-sm me-2" type="search" name="search" placeholder="ค้นหาชื่อหรืออีเมล..." value="<?= htmlspecialchars($search) ?>">
        <button class="btn btn-sm btn-outline-primary" type="submit">ค้นหา</button>
    </form>
</div>

<div class="card">
    <div class="table-responsive">
        <table class="table table-hover align-middle mb-0">
            <thead class="table-light">
                <tr>
                    <th>ID</th>
                    <th>ชื่อ-นามสกุล</th>
                    <th>อีเมล</th>
                    <th>เพศ</th>
                    <th>บทบาท</th>
                    <th>วันที่สมัคร</th>
                    <th>จัดการ</th>
                </tr>
            </thead>
            <tbody>
                <?php while($u = $users->fetch_assoc()): ?>
                <tr>
                    <td>#<?= $u['id'] ?></td>
                    <td>
                        <div class="d-flex align-items-center">
                            <?php if($u['avatar']): ?>
                                <img src="<?= $u['avatar'] ?>" class="rounded-circle me-2" width="32" height="32">
                            <?php else: ?>
                                <div class="bg-secondary rounded-circle me-2 text-white d-flex align-items-center justify-content-center" style="width:32px; height:32px; font-size:12px;">
                                    <?= substr($u['name'], 0, 1) ?>
                                </div>
                            <?php endif; ?>
                            <?= $u['name'] ?>
                        </div>
                    </td>
                    <td><?= $u['email'] ?></td>
                    <td><?= $u['gender'] ?></td>
                    <td>
                        <span class="badge <?= $u['role'] == 'admin' ? 'bg-danger' : 'bg-info' ?>">
                            <?= $u['role'] ?>
                        </span>
                    </td>
                    <td><?= date('d/m/Y', strtotime($u['created_at'])) ?></td>
                    <td>
                        <button class="btn btn-sm btn-outline-primary" data-bs-toggle="modal" data-bs-target="#editUser-<?= $u['id'] ?>">
                            แก้ไขสิทธิ์
                        </button>
                        <a href="?delete=<?= $u['id'] ?>" class="btn btn-sm btn-outline-danger" onclick="return confirm('ยืนยันการลบผู้ใช้? การลบจะทำให้ข้อมูลที่เกี่ยวข้องทั้งหมดหายไป')">
                            ลบ
                        </a>

                        <!-- Edit Role Modal -->
                        <div class="modal fade" id="editUser-<?= $u['id'] ?>" tabindex="-1">
                            <div class="modal-dialog modal-sm">
                                <div class="modal-content">
                                    <form method="POST">
                                        <div class="modal-header">
                                            <h5 class="modal-title">แก้ไขสิทธิ์: <?= $u['name'] ?></h5>
                                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                                        </div>
                                        <div class="modal-body">
                                            <input type="hidden" name="user_id" value="<?= $u['id'] ?>">
                                            <div class="mb-3">
                                                <label class="form-label">เลือกบทบาท</label>
                                                <select name="role" class="form-select">
                                                    <option value="user" <?= $u['role'] == 'user' ? 'selected' : '' ?>>User (ลูกค้าทั่วไป)</option>
                                                    <option value="admin" <?= $u['role'] == 'admin' ? 'selected' : '' ?>>Admin (ผู้ดูแลระบบ)</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="modal-footer">
                                            <button type="submit" name="change_role" class="btn btn-primary w-100">บันทึก</button>
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

<?php require_once 'footer.php'; ?>
