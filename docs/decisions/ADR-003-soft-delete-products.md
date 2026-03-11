# ADR-003: Soft Delete cho Products

**Status**: Accepted
**Date**: 2025

## Context
Khi admin xóa sản phẩm, các order cũ vẫn cần tham chiếu đến sản phẩm đó (hiển thị lịch sử mua hàng, báo cáo doanh thu).

## Decision
Sử dụng **soft delete**: thêm field `isActive: Boolean` trong Product schema.
- Xóa = set `isActive: false`
- Query mặc định: `{ isActive: true }`

## Consequences
- Order history vẫn hiển thị đúng tên/giá sản phẩm đã xóa
- Cần thêm `{ isActive: true }` vào mọi query public-facing
- Admin có thể restore sản phẩm nếu cần
