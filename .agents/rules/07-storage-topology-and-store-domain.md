# Storage and ecommerce domain

Adapted from EasyCompaign's storage/domain rule; campaign and attribution infrastructure does not apply here.

- Django owns persisted catalog, accounts, orders and inventory. Browser state is not authoritative for prices, permissions or stock.
- SQLite is the current development database. Choose production storage from demonstrated concurrency, durability and operational requirements; do not introduce Redis, vectors or analytics clusters by default.
- Keep media in validated file/object storage with controlled delivery, not unbounded base64 database fields.
- Snapshot order-item prices and compute totals on the server. Deduct inventory atomically and guard against repeat checkout submissions.
- Preserve order history when catalog records change; choose deletion policies intentionally.
- Clear user-specific browser state on logout and avoid cross-account data leakage.
- Keep analytics events distinct from authoritative purchases. Public activity logging must not create trusted financial records.
- Document backup, restore and migration procedures before production deployment.
