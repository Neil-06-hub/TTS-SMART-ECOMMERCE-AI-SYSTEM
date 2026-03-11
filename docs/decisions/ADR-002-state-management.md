# ADR-002: Zustand cho State Management

**Status**: Accepted
**Date**: 2025

## Context
Frontend cần quản lý:
- Auth state (token, user info) — persist qua reload
- Cart state (items, quantities) — persist qua reload
- Server state (products, orders) — cần cache và refetch

## Decision
- **Zustand** với `persist` middleware cho auth + cart (localStorage)
- **React Query** (`@tanstack/react-query`) cho server state (API calls)

## Rationale
- Zustand: nhẹ, boilerplate ít hơn Redux, persist built-in
- React Query: tự động cache, background refetch, loading/error states
- Không dùng Context API để tránh re-render toàn cây

## Consequences
- Cart và auth tồn tại trong localStorage → cần xóa khi logout
- React Query devtools hữu ích khi debug cache
