<?php

// ใช้ shared config และ helpers เดียวกับ api หลัก
require __DIR__ . '/config/app.php';
require __DIR__ . '/helpers/response.php';
require __DIR__ . '/helpers/payment_utils.php';
require __DIR__ . '/helpers/easyslip.php';

/**
 * สคริปต์นี้ออกแบบให้รันเป็น cron / scheduled task
 * เพื่อ sync สถานะพัสดุจาก Thailand Post มายังตาราง shipments + orders
 *
 * กลยุทธ์:
 * - เลือกเฉพาะ shipments ที่ยังไม่จบ (status_code != 501) และ order ยังไม่ completed
 * - จำกัดจำนวนต่อรอบเพื่อลดการยิง API (สามารถปรับ $limit ได้)
 */

$limit = 50;

$sql = "
    SELECT s.id, s.order_id, s.tracking_number
    FROM shipments s
    JOIN orders o ON o.id = s.order_id
    WHERE o.status IN ('shipping', 'waiting', 'verifying')
      AND (s.status_code IS NULL OR s.status_code <> '501')
    ORDER BY s.id ASC
    LIMIT {$limit}
";

$result = $conn->query($sql);

if (!$result) {
    echo json_encode([
        'status'  => false,
        'message' => 'Query shipments failed',
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

$rows      = $result->fetch_all(MYSQLI_ASSOC);
$token     = get_thaipost_token();
$synced    = [];
$errors    = [];

if (!$token) {
    echo json_encode([
        'status'  => false,
        'message' => 'Missing THAIPOST token',
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

foreach ($rows as $row) {
    $barcode = $row['tracking_number'];

    if (!$barcode) {
        continue;
    }

    $tracking = thaipost_get_status($barcode, $token);

    if (!is_array($tracking) || empty($tracking['status']) || empty($tracking['response']['items'][$barcode])) {
        $errors[] = [
            'tracking_number' => $barcode,
            'error'           => $tracking['error'] ?? 'No data',
        ];
        continue;
    }

    $events = $tracking['response']['items'][$barcode];
    $latest = end($events);

    $statusCode      = isset($latest['status']) ? (string)$latest['status'] : null;
    $statusDesc      = isset($latest['status_description']) ? (string)$latest['status_description'] : null;
    $location        = isset($latest['location']) ? (string)$latest['location'] : null;
    $deliveryStatus  = isset($latest['delivery_status']) ? (string)$latest['delivery_status'] : null;

    // อัปเดตตาราง shipments
    $stmt = $conn->prepare("
        UPDATE shipments
        SET status_code = ?, status_description = ?, location = ?
        WHERE id = ?
    ");

    if ($stmt) {
        $stmt->bind_param(
            "sssi",
            $statusCode,
            $statusDesc,
            $location,
            $row['id']
        );
        $stmt->execute();
        $stmt->close();
    }

    // ถ้าสถานะล่าสุดคือ นำจ่ายสำเร็จ → mark order เป็น completed
    if ($statusCode === '501' || $deliveryStatus === 'S') {
        $updateOrder = $conn->prepare("
            UPDATE orders
            SET status = 'completed'
            WHERE id = ?
              AND status <> 'completed'
        ");

        if ($updateOrder) {
            $updateOrder->bind_param("i", $row['order_id']);
            $updateOrder->execute();
            $updateOrder->close();
        }
    }

    $synced[] = $barcode;
}

echo json_encode([
    'status'         => true,
    'synced_count'   => count($synced),
    'synced_barcodes'=> $synced,
    'errors'         => $errors,
], JSON_UNESCAPED_UNICODE);

$conn->close();

