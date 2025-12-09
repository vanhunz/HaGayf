# 🚀 HƯỚNG DẪN CÀI ĐẶT TRÊN MÁY MỚI

> Sau khi clone project từ GitHub về máy mới, làm theo các bước sau để cài đặt và chạy.

---

## 📋 **CHECKLIST TÀI NGUYÊN CẦN CÀI**

### **1. Java Development Kit (JDK) 17+**

#### **Kiểm tra đã có chưa:**
```bash
java -version
```

Nếu hiển thị `java version "17.x.x"` hoặc cao hơn → ✅ OK

#### **Nếu chưa có, tải tại:**

**Windows:**
- **OpenJDK 17:** https://adoptium.net/temurin/releases/?version=17
  - Chọn: `Windows x64` → `JDK` → `.msi` installer
  - Cài đặt và **tick "Set JAVA_HOME variable"**
  - Hoặc thêm vào PATH thủ công:
    ```
    JAVA_HOME = C:\Program Files\Eclipse Adoptium\jdk-17.x.x-hotspot
    PATH += %JAVA_HOME%\bin
    ```

**macOS:**
```bash
brew install openjdk@17
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install openjdk-17-jdk
```

---

### **2. Apache Maven 3.6+**

#### **Kiểm tra:**
```bash
mvn -version
```

Nếu hiển thị `Apache Maven 3.x.x` → ✅ OK

#### **Nếu chưa có:**

**Windows:**
1. Tải: https://maven.apache.org/download.cgi
2. Chọn: `apache-maven-3.9.6-bin.zip`
3. Giải nén vào: `C:\Program Files\Apache\maven`
4. Thêm vào PATH:
   ```
   MAVEN_HOME = C:\Program Files\Apache\maven
   PATH += %MAVEN_HOME%\bin
   ```
5. Khởi động lại terminal

**macOS:**
```bash
brew install maven
```

**Linux:**
```bash
sudo apt install maven
```

---

### **3. Node.js 18+ và npm**

#### **Kiểm tra:**
```bash
node -v
npm -v
```

Nếu hiển thị `v18.x.x` hoặc cao hơn → ✅ OK

#### **Nếu chưa có:**

**Windows/macOS/Linux:**
- Tải tại: https://nodejs.org/
- Chọn **LTS version** (Long Term Support)
- Cài đặt bình thường, npm sẽ tự động đi kèm

**Hoặc dùng nvm (Node Version Manager):**
```bash
# Windows
winget install CoreyButler.NVMforWindows

# macOS/Linux
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Sau đó cài Node
nvm install 18
nvm use 18
```

---

### **4. Git (để clone project)**

#### **Kiểm tra:**
```bash
git --version
```

#### **Nếu chưa có:**

**Windows:** https://git-scm.com/download/win

**macOS:**
```bash
brew install git
```

**Linux:**
```bash
sudo apt install git
```

---

## 📥 **BƯỚC 1: CLONE PROJECT**

```bash
# Clone từ GitHub
git clone https://github.com/YOUR_USERNAME/HaGayf.git

# Di chuyển vào thư mục
cd HaGayf

# Kiểm tra cấu trúc
ls
# Kết quả: backend/  frontend/  README.md  PRESENTATION_GUIDE.md  run.bat
```

---

## ⚙️ **BƯỚC 2: CÀI ĐẶT DEPENDENCIES**

### **A. Backend (Java + Maven)**

```bash
# Di chuyển vào thư mục backend
cd backend

# Tải tất cả dependencies và build project
mvn clean install

# Hoặc nếu muốn bỏ qua tests (nhanh hơn)
mvn clean install -DskipTests
```

**Quá trình này sẽ:**
- ✅ Tải Spring Boot 3.2.0
- ✅ Tải Jackson (JSON processing)
- ✅ Tải Lombok
- ✅ Compile Java source code
- ✅ Tạo file JAR: `target/federated-backend-0.0.1-SNAPSHOT.jar`

**Thời gian:** ~2-5 phút (lần đầu)

---

### **B. Frontend (React + Vite)**

```bash
# Quay lại thư mục gốc
cd ..

# Di chuyển vào thư mục frontend
cd frontend

# Cài đặt tất cả dependencies
npm install
```

**Quá trình này sẽ tải:**
- ✅ React 18.2.0
- ✅ React-DOM 18.2.0
- ✅ Recharts 2.10.0 (thư viện charts)
- ✅ Vite 5.0.0 (build tool)
- ✅ @vitejs/plugin-react (plugin React cho Vite)

**Thời gian:** ~1-3 phút

---

## 🚀 **BƯỚC 3: CHẠY ỨNG DỤNG**

### **Cách 1: Chạy thủ công (2 terminal)**

#### **Terminal 1 - Backend:**
```bash
# Từ thư mục gốc
cd backend

# Chạy Spring Boot application
mvn spring-boot:run

# Hoặc chạy từ JAR đã build
java -jar target/federated-backend-0.0.1-SNAPSHOT.jar
```

**Chờ đến khi thấy:**
```
Started FederatedApplication in X.XXX seconds
Tomcat started on port 8080
```

Backend đang chạy tại: `http://localhost:8080` ✅

---

#### **Terminal 2 - Frontend:**
```bash
# Từ thư mục gốc (terminal mới)
cd frontend

# Chạy Vite dev server
npm run dev
```

**Chờ đến khi thấy:**
```
VITE v5.x.x  ready in XXX ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

Frontend đang chạy tại: `http://localhost:5173` ✅

---

### **Cách 2: Dùng script tự động (Windows)**

```bash
# Từ thư mục gốc
.\run.bat
```

Script sẽ tự động:
1. Start backend ở terminal riêng
2. Start frontend ở terminal riêng
3. Mở browser tự động

---

### **Cách 3: Chạy production build**

```bash
# Build frontend thành static files
cd frontend
npm run build
# Kết quả: frontend/dist/

# Build backend thành JAR
cd ../backend
mvn clean package -DskipTests
# Kết quả: backend/target/federated-backend-0.0.1-SNAPSHOT.jar

# Chạy backend (serve cả backend + frontend static)
java -jar target/federated-backend-0.0.1-SNAPSHOT.jar
```

---

## 🌐 **BƯỚC 4: MỞ TRÌNH DUYỆT**

```
http://localhost:5173
```

**Bạn sẽ thấy:**
- 🏥 Header với status badges
- 💓 Dashboard với statistics cards
- 📊 ECG chart real-time
- 🤖 AI insights panel
- 📈 Trend bar
- ⚠️ Alert system

**Test các chức năng:**
1. Click **"▶ Đo liên tục"** → Xem ECG chạy
2. Click nút **"⚡ Nhanh (110)"** → Thấy alert popup
3. Cuộn xuống → Click **"Chạy mô phỏng FL"** → Xem loss chart
4. Click **"📥 Xuất"** → Download CSV

---

## 🔧 **XỬ LÝ SỰ CỐ THƯỜNG GẶP**

### **1. Backend không start**

**Lỗi:** `Error: JAVA_HOME not set`
```bash
# Windows
setx JAVA_HOME "C:\Program Files\Eclipse Adoptium\jdk-17.x.x-hotspot"

# macOS/Linux
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
```

**Lỗi:** `Port 8080 already in use`
```bash
# Tìm process đang dùng port 8080
# Windows
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:8080 | xargs kill -9
```

**Lỗi:** `Maven build failed`
```bash
# Xóa cache Maven và rebuild
rm -rf ~/.m2/repository
mvn clean install -DskipTests
```

---

### **2. Frontend không start**

**Lỗi:** `npm ERR! Cannot find module`
```bash
# Xóa node_modules và cài lại
rm -rf node_modules package-lock.json
npm install
```

**Lỗi:** `Port 5173 already in use`
```bash
# Tìm và kill process
# Windows
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:5173 | xargs kill -9
```

**Lỗi:** `Vite not found`
```bash
# Cài lại Vite global hoặc local
npm install -D vite
```

---

### **3. API không kết nối**

**Kiểm tra backend:**
```bash
curl http://localhost:8080/api/status
# Kết quả: "Federated backend running"
```

**Kiểm tra proxy config:**
```javascript
// frontend/vite.config.js
export default {
  server: {
    proxy: {
      '/api': 'http://localhost:8080'  // ← Phải trỏ đúng
    }
  }
}
```

**CORS issue:**
- Backend đã config `@CrossOrigin(origins="*")` trong controller
- Nếu vẫn lỗi, check firewall/antivirus

---

### **4. Dependencies conflict**

**Backend (Maven):**
```bash
# Xem dependency tree
mvn dependency:tree

# Resolve conflicts trong pom.xml
# Đã exclude slf4j-api từ spring-boot-starter-test
```

**Frontend (npm):**
```bash
# Xem dependency tree
npm ls

# Fix conflicts
npm audit fix
```

---

## 📁 **CẤU TRÚC PROJECT**

```
HaGayf/
├── backend/                          # Java Spring Boot
│   ├── src/main/java/
│   │   └── com/example/federated/
│   │       ├── FederatedApplication.java        # Entry point
│   │       ├── web/FederatedController.java     # REST API
│   │       ├── service/FedAvgService.java       # FedAvg logic
│   │       └── model/                           # DTOs
│   │           ├── HeartbeatSample.java
│   │           ├── RoundMetrics.java
│   │           └── SimulateRequest.java
│   ├── src/main/resources/
│   │   └── application.properties              # Config
│   ├── pom.xml                                  # Maven dependencies
│   └── target/                                  # Build output
│       └── federated-backend-0.0.1-SNAPSHOT.jar
│
├── frontend/                         # React + Vite
│   ├── src/
│   │   ├── App.jsx                   # Main component
│   │   ├── api.js                    # API calls
│   │   ├── main.jsx                  # Entry point
│   │   └── styles.css                # Styling
│   ├── index.html                    # HTML template
│   ├── vite.config.js                # Vite config (proxy)
│   ├── package.json                  # npm dependencies
│   └── node_modules/                 # Dependencies
│
├── .github/
│   └── copilot-instructions.md       # GitHub Copilot config
├── README.md                         # Project overview
├── PRESENTATION_GUIDE.md             # Presentation guide
└── run.bat                           # Windows startup script
```

---

## 🎯 **DEPENDENCIES CHÍNH**

### **Backend (pom.xml)**
```xml
<!-- Web framework -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
    <version>3.2.0</version>
</dependency>

<!-- Health checks -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
    <version>3.2.0</version>
</dependency>

<!-- JSON processing -->
<dependency>
    <groupId>com.fasterxml.jackson.core</groupId>
    <artifactId>jackson-databind</artifactId>
    <version>2.16.1</version>
</dependency>

<!-- Reduce boilerplate -->
<dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
    <version>1.18.30</version>
</dependency>
```

### **Frontend (package.json)**
```json
{
  "dependencies": {
    "react": "^18.2.0",           // UI library
    "react-dom": "^18.2.0",       // DOM renderer
    "recharts": "^2.10.0"         // Chart library
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.0.0",  // React plugin
    "vite": "^5.0.0"                    // Build tool
  }
}
```

---

## 🔐 **ENVIRONMENT VARIABLES (Nếu cần)**

### **Backend:**
```bash
# Tạo file: backend/src/main/resources/application.properties

# Port
server.port=8080

# Logging
logging.level.root=INFO
logging.level.com.example.federated=DEBUG

# Actuator endpoints
management.endpoints.web.exposure.include=health,info
```

### **Frontend:**
Không cần env vars, proxy đã config trong `vite.config.js`

---

## 🧪 **TESTING**

### **Backend:**
```bash
cd backend
mvn test
```

### **Frontend:**
```bash
cd frontend
npm test
```

### **Manual testing checklist:**
- [ ] Backend health check: `curl http://localhost:8080/api/status`
- [ ] Heartbeat API: `curl http://localhost:8080/api/heartbeat?points=60`
- [ ] FL simulation: `curl -X POST http://localhost:8080/api/fl/simulate -H "Content-Type: application/json" -d '{"clients":5,"rounds":8}'`
- [ ] Frontend loads: `http://localhost:5173`
- [ ] Real-time monitoring works
- [ ] Quick preset buttons work
- [ ] Alert popup displays
- [ ] FL chart renders
- [ ] Export CSV works
- [ ] Theme toggle smooth

---

## 📦 **BUILD PRODUCTION**

### **Backend:**
```bash
cd backend
mvn clean package -DskipTests

# Kết quả: target/federated-backend-0.0.1-SNAPSHOT.jar
# Chạy: java -jar target/federated-backend-0.0.1-SNAPSHOT.jar
```

### **Frontend:**
```bash
cd frontend
npm run build

# Kết quả: dist/ folder
# Deploy: Upload dist/ lên Vercel/Netlify/S3
```

---

## 🌐 **DEPLOYMENT (Optional)**

### **Backend → Heroku/Railway:**
```bash
# Tạo Procfile
echo "web: java -jar backend/target/federated-backend-0.0.1-SNAPSHOT.jar" > Procfile

# Deploy
git push heroku main
```

### **Frontend → Vercel:**
```bash
npm install -g vercel
cd frontend
vercel --prod
```

### **Full-stack → Docker:**
```dockerfile
# Dockerfile.backend
FROM openjdk:17-alpine
COPY backend/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","/app.jar"]

# Dockerfile.frontend
FROM node:18-alpine
WORKDIR /app
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ .
RUN npm run build
EXPOSE 5173
CMD ["npm", "run", "preview"]
```

---

## ✅ **CHECKLIST HOÀN THÀNH**

- [ ] Java 17+ đã cài
- [ ] Maven 3.6+ đã cài
- [ ] Node.js 18+ đã cài
- [ ] Git đã cài
- [ ] Clone project thành công
- [ ] Backend dependencies tải xong (`mvn install`)
- [ ] Frontend dependencies tải xong (`npm install`)
- [ ] Backend chạy thành công (port 8080)
- [ ] Frontend chạy thành công (port 5173)
- [ ] Mở browser thấy dashboard
- [ ] Test các chức năng chính

---

## 🆘 **LIÊN HỆ HỖ TRỢ**

Nếu gặp vấn đề:
1. Đọc lỗi trong terminal
2. Google error message
3. Check issues trên GitHub repo
4. Liên hệ maintainer

---

## 📚 **TÀI LIỆU THAM KHẢO**

- [Spring Boot Documentation](https://docs.spring.io/spring-boot/docs/3.2.0/reference/html/)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Recharts Documentation](https://recharts.org/)
- [Maven Documentation](https://maven.apache.org/guides/)

---

<div align="center">

**🎉 CHÚC BẠN CÀI ĐẶT THÀNH CÔNG! 🎉**

Nếu hướng dẫn này hữu ích, hãy cho repo một ⭐!

</div>
