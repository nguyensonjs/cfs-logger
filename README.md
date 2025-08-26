# CFS Logger

Một thư viện logger đơn giản, có màu sắc và hỗ trợ định dạng JSON cho các dự án Node.js.

## Tính năng

- ✨ Hỗ trợ 4 mức log: `error`, `warn`, `info`, `debug`
- 🎨 Console output có màu sắc với Chalk
- 📁 Tự động ghi log vào file theo ngày
- 📋 Hỗ trợ định dạng JSON hoặc text thông thường
- ⚙️ Cấu hình linh hoạt
- 📦 Viết bằng TypeScript với type definitions

## Cài đặt

```bash
npm install cfs-logger
```

## Sử dụng cơ bản

```typescript
import { Logger } from "cfs-logger";

// Khởi tạo logger với cấu hình mặc định
const logger = new Logger();

// Sử dụng các phương thức log
logger.info("Thông tin ứng dụng");
logger.warn("Cảnh báo");
logger.error("Lỗi xảy ra");
logger.debug("Thông tin debug");
```

## Cấu hình

### LoggerOptions

```typescript
interface LoggerOptions {
  level?: LogLevel; // Mức log tối thiểu (mặc định: "info")
  logDir?: string; // Thư mục lưu log files (mặc định: "./logs")
  enableConsole?: boolean; // Bật/tắt console output (mặc định: true)
  enableFile?: boolean; // Bật/tắt file logging (mặc định: true)
  jsonFormat?: boolean; // Định dạng JSON (mặc định: true)
}
```

### Các mức log

- `error`: Chỉ hiển thị lỗi
- `warn`: Hiển thị cảnh báo và lỗi
- `info`: Hiển thị thông tin, cảnh báo và lỗi (mặc định)
- `debug`: Hiển thị tất cả log

## Ví dụ sử dụng

### Cấu hình cơ bản

```typescript
import { Logger } from "cfs-logger";

const logger = new Logger({
  level: "debug",
  logDir: "./my-logs",
  enableConsole: true,
  enableFile: true,
  jsonFormat: true,
});

logger.debug("Debug message");
logger.info("Info message");
logger.warn("Warning message");
logger.error("Error message");
```

### Chỉ log ra console

```typescript
const logger = new Logger({
  enableFile: false,
  enableConsole: true,
});

logger.info("Chỉ hiển thị trên console");
```

### Chỉ log ra file

```typescript
const logger = new Logger({
  enableConsole: false,
  enableFile: true,
  logDir: "./logs",
});

logger.info("Chỉ ghi vào file");
```

### Định dạng text thay vì JSON

```typescript
const logger = new Logger({
  jsonFormat: false,
});

logger.info("Log với định dạng text");
// Output: [2024-08-26T10:30:00.123Z] [INFO]: Log với định dạng text
```

### Định dạng JSON (mặc định)

```typescript
const logger = new Logger({
  jsonFormat: true,
});

logger.info("Log với định dạng JSON");
// Output: {"timestamp":"2024-08-26T10:30:00.123Z","level":"info","message":"Log với định dạng JSON"}
```

## File log

- Log files được tạo tự động theo ngày trong format: `YYYY-MM-DD.log`
- Ví dụ: `2024-08-26.log`
- Thư mục mặc định: `./logs/`
- Nếu thư mục không tồn tại, sẽ được tạo tự động

## Màu sắc console

- 🔴 `error`: Đỏ
- 🟡 `warn`: Vàng
- 🔵 `info`: Xanh dương
- ⚫ `debug`: Xám

## TypeScript

Thư viện được viết hoàn toàn bằng TypeScript và bao gồm type definitions. Bạn có thể import types:

```typescript
import { Logger, LogLevel, LoggerOptions } from "cfs-logger";

const options: LoggerOptions = {
  level: "debug",
  logDir: "./logs",
};

const logger = new Logger(options);
```

## License

MIT

## Tác giả

nhson
