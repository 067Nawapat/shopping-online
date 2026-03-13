# Shopping Online

โปรเจกต์นี้เป็นระบบร้านค้าออนไลน์ที่แยกโครงสร้างออกเป็น 2 ส่วนชัดเจน:

- `shopping-online/` สำหรับแอปฝั่งผู้ใช้ด้วย React Native + Expo
- `shopping-api/` สำหรับ PHP API ที่รันกับ XAMPP/MySQL

โครงสร้างนี้ตั้งใจทำให้ใช้งานและอัปขึ้น GitHub ได้ง่ายขึ้น โดยแยกหน้าบ้านและหลังบ้านออกจากกันตั้งแต่ระดับโฟลเดอร์

## โครงสร้างโปรเจกต์

```text
Shopping-Online/
|- shopping-online/        # React Native Expo app
|- shopping-api/           # PHP API สำหรับ XAMPP
|- README.md
|- .gitignore
```

## ความสามารถหลักของระบบ

- สมัครสมาชิก / เข้าสู่ระบบ
- เลือกสินค้าและเพิ่มลงตะกร้า
- เลือกที่อยู่จัดส่งตอน checkout
- เลือกวิธีชำระเงินได้หลายแบบ
- รองรับ PromptPay และ TrueMoney Wallet
- สร้าง QR สำหรับ PromptPay ผ่าน EasySlip
- อัปโหลดสลิปและตรวจสอบผ่าน EasySlip
- กันการใช้สลิปซ้ำ
- ปฏิเสธสลิปที่ยอดเงินหรือข้อมูลไม่ตรง

## ส่วนที่ 1: Frontend `shopping-online/`

เทคโนโลยีที่ใช้:

- React Native
- Expo
- React Navigation
- Axios

ไฟล์สำคัญ:

- [shopping-online/App.js](/D:/shopping-online/shopping-online/App.js)
- [shopping-online/package.json](/D:/shopping-online/shopping-online/package.json)
- [shopping-online/src/api/apiService.js](/D:/shopping-online/shopping-online/src/api/apiService.js)

### วิธีติดตั้งและรัน Frontend

1. เปิด terminal ที่โฟลเดอร์ `shopping-online`
2. ติดตั้ง dependencies

```bash
npm install
```

3. รัน Expo

```bash
npm start
```

4. ถ้าต้องการรันบน Android

```bash
npm run android
```

## ส่วนที่ 2: Backend `shopping-api/`

เทคโนโลยีที่ใช้:

- PHP
- MySQL
- XAMPP
- cURL
- EasySlip API

ไฟล์สำคัญ:

- [shopping-api/api.php](/D:/shopping-online/shopping-api/api.php)
- [shopping-api/local-config.example.php](/D:/shopping-online/shopping-api/local-config.example.php)

### วิธีวาง Backend ใน XAMPP

1. คัดลอกโฟลเดอร์ `shopping-api` ไปไว้ที่:

```text
C:\xampp\htdocs\shopping-api
```

2. เปิด Apache และ MySQL ใน XAMPP
3. สร้างฐานข้อมูลชื่อ `shopping_db`
4. นำเข้าโครงสร้างตารางที่ระบบต้องใช้
5. เปิด API ผ่าน URL ตัวอย่าง:

```text
http://localhost/shopping-api/api.php
```

## การตั้งค่า API URL ในแอป

ฝั่ง frontend ควรชี้ไปยัง API ตาม environment ที่ใช้จริง เช่น:

- Android emulator: `http://10.0.2.2/shopping-api/api.php`
- iOS simulator / web: `http://localhost/shopping-api/api.php`
- มือถือจริงในวง LAN: `http://YOUR_LAN_IP/shopping-api/api.php`

## การตั้งค่า EasySlip อย่างปลอดภัย

สำคัญมาก: ห้ามใส่ token ลงใน source code ที่ commit ขึ้น GitHub

### วิธีที่แนะนำที่สุด

ตั้งค่า `EASYSLIP_ACCESS_TOKEN` เป็น environment variable ฝั่ง server

ตัวอย่าง:

```text
EASYSLIP_ACCESS_TOKEN=your_real_token
```

### วิธีสำรองสำหรับเครื่อง local

ถ้ายังไม่ได้ใช้ environment variable สามารถสร้างไฟล์:

```text
shopping-api/local-config.php
```

แล้วใส่ค่าแบบนี้:

```php
<?php

return [
    'EASYSLIP_ACCESS_TOKEN' => 'your_real_token',
];
```

ข้อสำคัญ:

- ไฟล์ `shopping-api/local-config.php` ถูกใส่ใน `.gitignore` แล้ว
- ให้ใช้ `shopping-api/local-config.example.php` เป็นตัวอย่าง
- ห้ามเปลี่ยนชื่อไฟล์ตัวอย่างแล้ว commit token จริงกลับขึ้น repo

## สิ่งที่ `.gitignore` กันไว้แล้ว

- `shopping-online/node_modules/`
- `shopping-online/.expo/`
- `shopping-online/android/`
- `shopping-api/uploads/`
- `shopping-api/local-config.php`
- `.env` ต่าง ๆ

จุดประสงค์คือกันไม่ให้:

- ไฟล์ runtime
- build output
- ไฟล์ลับ
- token
- รูปสลิปอัปโหลด

หลุดขึ้น GitHub อีก

## แนวทางการอัปเดตโค้ดอย่างปลอดภัย

ก่อน push ขึ้น GitHub ควรเช็กอย่างน้อย 3 อย่าง:

1. ไม่มี token หรือ secret จริงอยู่ในไฟล์โค้ด
2. ไม่มีไฟล์สลิปหรือไฟล์อัปโหลดจริงอยู่ใน `shopping-api/uploads/`
3. ไม่มี `.env`, `local-config.php` หรือข้อมูล production หลุดเข้า staging

ถ้าพบว่า token เคยหลุดขึ้น GitHub ไปแล้ว ให้ทำทันที:

1. ออก token ใหม่จาก EasySlip
2. ยกเลิก token เก่า
3. อัปเดต token ใหม่เฉพาะฝั่ง server

## คำสั่ง Git พื้นฐาน

```bash
git status
git add .
git commit -m "your message"
git push origin main
```

## หมายเหตุ

- repo นี้แยก frontend และ backend ในระดับโฟลเดอร์แล้ว
- เหมาะกับการพัฒนาต่อและอัปขึ้น GitHub แบบไม่ปนกัน
- ถ้าจะ deploy จริง ควรแยก secret ออกจาก repo เสมอ
