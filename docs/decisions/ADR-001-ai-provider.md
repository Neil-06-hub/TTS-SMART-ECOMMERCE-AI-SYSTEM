# ADR-001: Chọn Google Gemini làm AI Provider

**Status**: Accepted
**Date**: 2025

## Context
Cần AI để:
1. Generate nội dung email marketing cá nhân hóa
2. Phân tích dữ liệu kinh doanh và đề xuất chiến lược
3. Tạo newsletter tự động hàng tuần

## Decision
Sử dụng **Google Gemini 1.5 Flash** qua `@google/generative-ai`.

## Rationale
- Free tier đủ dùng cho prototype/production nhỏ
- Gemini 1.5 Flash: nhanh, chi phí thấp, đủ chất lượng cho text generation
- SDK đơn giản, dễ tích hợp với Node.js
- Không cần self-host, không overhead infrastructure

## Consequences
- Phụ thuộc vào Google API availability
- Response dạng markdown → cần strip trước khi JSON.parse()
- Rate limit của free tier có thể là bottleneck khi scale
