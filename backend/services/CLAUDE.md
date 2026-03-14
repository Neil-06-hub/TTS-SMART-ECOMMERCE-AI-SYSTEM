# Services — Claude Context

## gemini.service.js
Wrapper cho Google Gemini API.

**Pattern quan trọng**: Gemini trả response bọc trong markdown code block:
````
```json
{ ... }
```
````
Phải strip trước khi parse:
```js
const cleaned = text.replace(/```json\n?|\n?```/g, '').trim();
return JSON.parse(cleaned);
```

## recommendation.service.js
Hai chiến lược gợi ý:

**Content-based**: MongoDB Aggregate dùng `$setIntersection` trên `tags[]`
```js
// Sản phẩm có nhiều tags chung nhất với sản phẩm đang xem
{ $project: { commonTags: { $setIntersection: ['$tags', targetTags] } } }
```

**Collaborative Filtering**: Tìm user có hành vi tương tự qua `Activity` collection
```js
// User đã mua/xem sản phẩm tương tự → lấy SP khác họ đã mua
```

## marketing.service.js
Dùng Gemini để generate:
- Subject line cá nhân hóa
- Email body HTML với tên user và sản phẩm cụ thể
- Newsletter content từ dữ liệu sản phẩm hot

Input: `{ user, products, type }` → Output: `{ subject, htmlContent }`

## email.service.js
Nodemailer với Gmail SMTP transport.

```js
// Config
transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: EMAIL_USER, pass: EMAIL_PASS }  // App Password!
});
```

**Lưu ý**: `EMAIL_PASS` phải là **Gmail App Password** (16 ký tự), không phải password thường.
