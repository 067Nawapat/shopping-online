<?php
require_once 'header.php';

if (isset($_POST['add_banner'])) {
    $title = $_POST['title'];
    $image = $_POST['image'];
    $status = $_POST['status'];
    $stmt = $conn->prepare("INSERT INTO banners (title, image, status) VALUES (?, ?, ?)");
    $stmt->bind_param("sss", $title, $image, $status);
    $stmt->execute();
}

if (isset($_GET['delete'])) {
    $id = $_GET['delete'];
    $conn->query("DELETE FROM banners WHERE id = $id");
    header('Location: banners.php');
}

$banners = $conn->query("SELECT * FROM banners ORDER BY id DESC");
?>

<div class="d-flex justify-content-between align-items-center pt-3 pb-2 mb-3 border-bottom">
    <h1 class="h2">จัดการแบนเนอร์</h1>
    <button class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#addBannerModal">เพิ่มแบนเนอร์</button>
</div>

<div class="row">
    <?php while($b = $banners->fetch_assoc()): ?>
    <div class="col-md-6 mb-4">
        <div class="card h-100">
            <img src="<?= $b['image'] ?>" class="card-img-top" style="height: 200px; object-fit: cover;">
            <div class="card-body">
                <h5 class="card-title"><?= $b['title'] ?></h5>
                <span class="badge <?= $b['status'] == 'active' ? 'bg-success' : 'bg-secondary' ?> mb-2"><?= $b['status'] ?></span>
            </div>
            <div class="card-footer bg-white border-top-0">
                <a href="?delete=<?= $b['id'] ?>" class="btn btn-sm btn-danger" onclick="return confirm('ลบแบนเนอร์นี้?')">ลบออก</a>
            </div>
        </div>
    </div>
    <?php endwhile; ?>
</div>

<div class="modal fade" id="addBannerModal" tabindex="-1">
    <div class="modal-dialog">
        <div class="modal-content">
            <form method="POST">
                <div class="modal-header">
                    <h5 class="modal-title">เพิ่มแบนเนอร์ใหม่</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <div class="mb-3">
                        <label class="form-label">หัวข้อ</label>
                        <input type="text" name="title" class="form-control" required>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">URL รูปภาพ</label>
                        <input type="text" name="image" class="form-control" required>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">สถานะ</label>
                        <select name="status" class="form-select">
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="submit" name="add_banner" class="btn btn-primary">บันทึก</button>
                </div>
            </form>
        </div>
    </div>
</div>

<?php require_once 'footer.php'; ?>
