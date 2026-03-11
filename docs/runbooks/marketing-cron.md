# Runbook: Marketing Automation & Cron Jobs

## Cron Schedule

| Job | Lịch | Mô tả |
|-----|------|-------|
| Abandoned Cart | Mỗi giờ `0 * * * *` | Email nhắc giỏ hàng bỏ quên > 24h |
| Newsletter | Thứ Hai 9:00 AM `0 9 * * 1` | Newsletter sản phẩm hot tuần qua |
| Welcome Email | Ngay khi register | Gửi ngay sau khi user đăng ký thành công |

## Kiểm tra Cron hoạt động

```bash
# Xem log marketing
cd backend
# Cron log xuất ra console và lưu vào MarketingLog collection

# Xem logs trong MongoDB
db.marketinglogs.find().sort({ createdAt: -1 }).limit(10)
```

## Trigger thủ công (Admin Dashboard)

Vào `/admin/marketing` → nhấn "Gửi Campaign" để trigger ngay.

## Xử lý lỗi Email

Nếu email không gửi được:
1. Kiểm tra `EMAIL_USER` và `EMAIL_PASS` trong `.env`
2. Gmail App Password (không phải password thường)
3. Kiểm tra `EMAIL_PASS` không có space thừa
4. Bật 2-Factor Auth trên Gmail trước khi tạo App Password

## Debug Gemini Content Generation

Nếu AI content trống hoặc lỗi:
1. Kiểm tra `GEMINI_API_KEY` còn hạn
2. Xem log: response Gemini thường bọc trong ```json ... ```
3. `gemini.service.js` tự strip markdown trước parse
