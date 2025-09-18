# CFS Logger

Một thư viện logger đơn giản, có màu sắc và hỗ trợ định dạng JSON cho các dự án Node.js.

## Tính năng

- ✨ Hỗ trợ 4 mức log: `error`, `warn`, `info`, `debug`
- 🎨 Console output có màu sắc với Chalk
- 📁 Tự động ghi log vào file theo ngày
- 📋 Hỗ trợ định dạng JSON hoặc text thông thường
- 🎯 JSON colorization cho console output
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
  level?: LogLevel;           // Mức log tối thiểu (mặc định: "info")
  logDir?: string;           // Thư mục lưu log files (mặc định: "./logs")
  enableConsole?: boolean;   // Bật/tắt console output (mặc định: true)
  enableFile?: boolean;      // Bật/tắt file logging (mặc định: true)
  jsonFormat?: boolean;      // Định dạng JSON (mặc định: true)
  prettyPrint?: boolean;     // Làm đẹp JSON với indentation (mặc định: false)
  singleLine?: boolean;      // JSON một dòng, ưu tiên cao nhất (mặc định: false)
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
  prettyPrint: false,
  singleLine: false
});

logger.debug("Debug message");
logger.info("Info message", { userId: 123, action: "login" });
logger.warn("Warning message");
logger.error("Error message", new Error("Something went wrong"));
```

### JSON Format với Pretty Print

```typescript
const logger = new Logger({
  jsonFormat: true,
  prettyPrint: true,
  singleLine: false
});

logger.info("User logged in", { userId: 123, timestamp: new Date() });
// Console output (với màu sắc):
// {
//   "timestamp": "2024-08-26T10:30:00.123Z",
//   "level": "info", 
//   "messages": [
//     "User logged in",
//     {
//       "userId": 123,
//       "timestamp": "2024-08-26T10:30:00.123Z"
//     }
//   ]
// }
```

### JSON Format Single Line

```typescript
const logger = new Logger({
  jsonFormat: true,
  singleLine: true  // Ưu tiên cao nhất, ghi đè prettyPrint
});

logger.info("User logged in", { userId: 123 });
// Output: {"timestamp":"2024-08-26T10:30:00.123Z","level":"info","messages":["User logged in",{"userId":123}]}
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

logger.info("Log với định dạng text", { key: "value" });
// Output: [2024-08-26T10:30:00.123Z] [INFO]: Log với định dạng text {"key":"value"}
```

## Tính năng đặc biệt

### JSON Colorization

Khi sử dụng `jsonFormat: true` và `prettyPrint: true`, console output sẽ có màu sắc:
- 🔵 Tên thuộc tính (keys): Cyan
- 🟢 Chuỗi (strings): Green
- 🟡 Số (numbers): Yellow
- 🟣 Boolean: Magenta
- ⚫ null: Gray

### Multiple Arguments Support

```typescript
logger.info("User action:", { userId: 123 }, "additional data", true);
// Tất cả arguments sẽ được xử lý và lưu trong mảng messages
```

## File Log

- Log files được tạo tự động theo ngày trong format: `YYYY-MM-DD.log`
- Ví dụ: `2024-08-26.log`
- Thư mục mặc định: `./logs/`
- Nếu thư mục không tồn tại, sẽ được tạo tự động
- File logs luôn sử dụng định dạng được cấu hình (JSON hoặc text)

## Màu sắc Console

- 🔴 `error`: Đỏ
- 🟡 `warn`: Vàng
- 🔵 `info`: Xanh dương
- ⚫ `debug`: Xám

## TypeScript

Thư viện được viết hoàn toàn bằng TypeScript và bao gồm type definitions:

```typescript
import { Logger, LogLevel, LoggerOptions } from "cfs-logger";

const options: LoggerOptions = {
  level: "debug",
  logDir: "./logs",
  jsonFormat: true,
  prettyPrint: true,
  singleLine: false
};

const logger = new Logger(options);
```

### Type Definitions

```typescript
export type LogLevel = "error" | "warn" | "info" | "debug";

export interface LoggerOptions {
  level?: LogLevel;
  logDir?: string;
  enableConsole?: boolean;
  enableFile?: boolean;
  jsonFormat?: boolean;
  prettyPrint?: boolean;
  singleLine?: boolean;
}
```

## Ví dụ thực tế

```typescript
import { Logger } from "cfs-logger";

// Logger cho môi trường development
const devLogger = new Logger({
  level: "debug",
  jsonFormat: true,
  prettyPrint: true,
  singleLine: false
});

// Logger cho môi trường production
const prodLogger = new Logger({
  level: "info", 
  jsonFormat: true,
  singleLine: true,
  enableConsole: false  // Chỉ ghi file trong production
});

// Sử dụng
const isProduction = process.env.NODE_ENV === "production";
const logger = isProduction ? prodLogger : devLogger;

logger.info("Application started", { 
  env: process.env.NODE_ENV,
  port: 3000 
});
```

## Dependencies

- `chalk`: Tạo màu sắc cho console output
- `fs`: File system operations (built-in Node.js)
- `path`: Path utilities (built-in Node.js)

## License

MIT

## Tác giả

nhson