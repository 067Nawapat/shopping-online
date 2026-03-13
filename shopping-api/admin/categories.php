<?php
require_once 'header.php';

if (isset($_POST['add_cat'])) {
    $name = $_POST['name'];
    $stmt = $conn->prepare("INSERT INTO categories (name) VALUES (?)");
    $stmt->bind_param("s", $name);
    $stmt->execute();
}

if (isset($_GET['delete'])) {
    $id = $_GET['delete'];
    $conn->query("DELETE FROM categories WHERE id = $id");
    header('Location: categories.php');
}

$categories = $conn->query("SELECT c.*, (SELECT COUNT(*) FROM products WHERE category_id = c.id) as p_count FROM categories c");
?>

<div class="d-flex justify-content-between align-items-center pt-3 pb-2 mb-3 border-bottom">
    <h1 class="h2">จัดการหมวดหมู่</h1>
    <form class="row g-2" method="POST">
        <div class="col-auto">
            <input type="text" name="name" class="form-control form-control-sm" placeholder="ชื่อหมวดหมู่ใหม่" required>
        </div>
        <div class="col-auto">
            <button type="submit" name="add_cat" class="btn btn-sm btn-primary">เพิ่ม</button>
        </div>
    </form>
</div>

<div class="card">
    <div class="table-responsive">
        <table class="table table-hover align-middle mb-0">
            <thead class="table-light">
                <tr>
                    <th>ID</th>
                    <th>ชื่อหมวดหมู่</th>
                    <th>จำนวนสินค้า</th>
                    <th>จัดการ</th>
                </tr>
            </thead>
            <tbody>
                <?php while($c = $categories->fetch_assoc()): ?>
                <tr>
                    <td>#<?= $c['id'] ?></td>
                    <td><?= $c['name'] ?></td>
                    <td><?= $c['p_count'] ?> ชิ้น</td>
                    <td>
                        <a href="?delete=<?= $c['id'] ?>" class="btn btn-sm btn-outline-danger" onclick="return confirm('ยืนยันการลบ?')">ลบ</a>
                    </td>
                </tr>
                <?php endwhile; ?>
            </tbody>
        </table>
    </div>
</div>

<?php require_once 'footer.php'; ?>
