<?php
require_once 'header.php';

// Add Product
if (isset($_POST['add_product'])) {
    $name = $_POST['name'];
    $category_id = $_POST['category_id'];
    $brand = $_POST['brand'];
    $desc = $_POST['description'];
    
    $stmt = $conn->prepare("INSERT INTO products (name, category_id, brand, description) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("siss", $name, $category_id, $brand, $desc);
    $stmt->execute();
    $product_id = $stmt->insert_id;

    // Add Variant
    $price = $_POST['price'];
    $stock = $_POST['stock'];
    $stmt_v = $conn->prepare("INSERT INTO product_variants (product_id, price, stock) VALUES (?, ?, ?)");
    $stmt_v->bind_param("idi", $product_id, $price, $stock);
    $stmt_v->execute();

    echo "<script>alert('เพิ่มสินค้าสำเร็จ'); window.location.href='products.php';</script>";
}

// Delete Product
if (isset($_GET['delete'])) {
    $id = $_GET['delete'];
    $conn->query("DELETE FROM product_variants WHERE product_id = $id");
    $conn->query("DELETE FROM product_images WHERE product_id = $id");
    $conn->query("DELETE FROM products WHERE id = $id");
    header('Location: products.php');
}

$products = $conn->query("SELECT p.*, c.name as cat_name FROM products p LEFT JOIN categories c ON p.category_id = c.id ORDER BY p.id DESC");
$categories = $conn->query("SELECT * FROM categories");
?>

<div class="d-flex justify-content-between align-items-center pt-3 pb-2 mb-3 border-bottom">
    <h1 class="h2">จัดการสินค้า</h1>
    <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addProductModal">
        <i class="bi bi-plus-lg"></i> เพิ่มสินค้าใหม่
    </button>
</div>

<div class="card">
    <div class="table-responsive">
        <table class="table table-hover align-middle mb-0">
            <thead class="table-light">
                <tr>
                    <th>ID</th>
                    <th>ชื่อสินค้า</th>
                    <th>หมวดหมู่</th>
                    <th>แบรนด์</th>
                    <th>จัดการ</th>
                </tr>
            </thead>
            <tbody>
                <?php while($p = $products->fetch_assoc()): ?>
                <tr>
                    <td>#<?= $p['id'] ?></td>
                    <td><?= $p['name'] ?></td>
                    <td><?= $p['cat_name'] ?></td>
                    <td><?= $p['brand'] ?></td>
                    <td>
                        <a href="?delete=<?= $p['id'] ?>" class="btn btn-sm btn-outline-danger" onclick="return confirm('ยืนยันการลบ?')">ลบ</a>
                    </td>
                </tr>
                <?php endwhile; ?>
            </tbody>
        </table>
    </div>
</div>

<!-- Add Product Modal -->
<div class="modal fade" id="addProductModal" tabindex="-1">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <form method="POST">
                <div class="modal-header">
                    <h5 class="modal-title">เพิ่มสินค้าใหม่</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <div class="row">
                        <div class="col-md-8 mb-3">
                            <label class="form-label">ชื่อสินค้า</label>
                            <input type="text" name="name" class="form-control" required>
                        </div>
                        <div class="col-md-4 mb-3">
                            <label class="form-label">หมวดหมู่</label>
                            <select name="category_id" class="form-select">
                                <?php 
                                $categories->data_seek(0);
                                while($c = $categories->fetch_assoc()): ?>
                                    <option value="<?= $c['id'] ?>"><?= $c['name'] ?></option>
                                <?php endwhile; ?>
                            </select>
                        </div>
                        <div class="col-md-6 mb-3">
                            <label class="form-label">แบรนด์</label>
                            <input type="text" name="brand" class="form-control">
                        </div>
                        <div class="col-md-3 mb-3">
                            <label class="form-label">ราคาเริ่มต้น</label>
                            <input type="number" name="price" class="form-control" required>
                        </div>
                        <div class="col-md-3 mb-3">
                            <label class="form-label">สต็อก</label>
                            <input type="number" name="stock" class="form-control" required>
                        </div>
                        <div class="col-12 mb-3">
                            <label class="form-label">รายละเอียด</label>
                            <textarea name="description" class="form-control" rows="3"></textarea>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">ยกเลิก</button>
                    <button type="submit" name="add_product" class="btn btn-primary">บันทึกสินค้า</button>
                </div>
            </form>
        </div>
    </div>
</div>

<?php require_once 'footer.php'; ?>
