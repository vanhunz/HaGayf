# ⚡ QUICK REFERENCE - CHEAT SHEET

> Commands nhanh để chạy project sau khi đã setup xong

---

## 🚀 **START APPLICATION**

### **Development Mode:**

```bash
# Terminal 1 - Backend
cd backend
mvn spring-boot:run

# Terminal 2 - Frontend  
cd frontend
npm run dev
```

### **Windows - Script tự động:**
```bash
.\run.bat
```

### **Production Mode:**
```bash
# Backend
cd backend
java -jar target/federated-backend-0.0.1-SNAPSHOT.jar

# Frontend (sau khi build)
cd frontend
npm run preview
```

---

## 🔧 **BUILD COMMANDS**

```bash
# Backend - Build JAR
cd backend
mvn clean package -DskipTests

# Frontend - Build static files
cd frontend
npm run build
```

---

## 📥 **INSTALL DEPENDENCIES**

```bash
# Backend
cd backend
mvn clean install

# Frontend
cd frontend
npm install
```

---

## 🧪 **TESTING**

```bash
# Backend tests
cd backend
mvn test

# Frontend tests
cd frontend
npm test

# Check backend health
curl http://localhost:8080/api/status
```

---

## 🔍 **CHECK VERSIONS**

```bash
java -version         # Java 17+
mvn -version          # Maven 3.6+
node -v               # Node 18+
npm -v                # npm 9+
```

---

## 🛑 **STOP PROCESSES**

```bash
# Windows - Kill ports
netstat -ano | findstr :8080
taskkill /PID <PID> /F

netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Linux/macOS
lsof -ti:8080 | xargs kill -9
lsof -ti:5173 | xargs kill -9
```

---

## 🌐 **URLS**

- **Frontend:** http://localhost:5173
- **Backend:** http://localhost:8080
- **API Status:** http://localhost:8080/api/status
- **Heartbeat:** http://localhost:8080/api/heartbeat?points=60
- **Actuator:** http://localhost:8080/actuator/health

---

## 📂 **PROJECT STRUCTURE**

```
HaGayf/
├── backend/
│   ├── src/main/java/com/example/federated/
│   │   ├── FederatedApplication.java
│   │   ├── web/FederatedController.java
│   │   ├── service/FedAvgService.java
│   │   └── model/
│   ├── pom.xml
│   └── target/
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── api.js
│   │   └── styles.css
│   ├── package.json
│   └── node_modules/
└── docs/
    ├── README.md
    ├── SETUP_GUIDE.md
    └── PRESENTATION_GUIDE.md
```

---

## 🔄 **GIT COMMANDS**

```bash
# First time push
git init
git add .
git commit -m "Initial commit"
git remote add origin <YOUR_REPO_URL>
git push -u origin main

# Regular updates
git add .
git commit -m "Update: description"
git push

# Clone to new machine
git clone <YOUR_REPO_URL>
cd HaGayf
```

---

## 🛠️ **TROUBLESHOOTING QUICK FIX**

```bash
# Backend not starting
rm -rf ~/.m2/repository
mvn clean install

# Frontend not starting
rm -rf node_modules package-lock.json
npm install

# Port already in use
# Windows
netstat -ano | findstr :<PORT>
taskkill /PID <PID> /F

# Linux/macOS
lsof -ti:<PORT> | xargs kill -9

# Clear Maven cache
mvn dependency:purge-local-repository

# Clear npm cache
npm cache clean --force
```

---

## 📦 **DEPENDENCIES**

### **Backend (Maven):**
- Spring Boot 3.2.0
- Spring Boot Web
- Spring Boot Actuator
- Jackson Databind 2.16.1
- Lombok 1.18.30

### **Frontend (npm):**
- React 18.2.0
- React-DOM 18.2.0
- Recharts 2.10.0
- Vite 5.0.0

---

## 🎯 **API ENDPOINTS**

```bash
# Health check
GET http://localhost:8080/api/status

# Get heartbeat data
GET http://localhost:8080/api/heartbeat?points=60

# Simulate Federated Learning
POST http://localhost:8080/api/fl/simulate
Content-Type: application/json
{
  "clients": 5,
  "rounds": 8
}
```

---

## 🐛 **COMMON ERRORS**

| Error | Fix |
|-------|-----|
| JAVA_HOME not set | Set env var to JDK path |
| Port 8080 in use | Kill process or change port |
| Maven build failed | `mvn clean install -U` |
| npm ERR! | Delete node_modules, npm install |
| CORS error | Check @CrossOrigin in controller |
| 404 on API | Check backend is running |

---

## 💻 **SYSTEM REQUIREMENTS**

- **OS:** Windows 10+, macOS 10.15+, Linux
- **RAM:** 4GB minimum, 8GB recommended
- **Disk:** 500MB for project + 2GB for dependencies
- **Java:** 17 or higher
- **Node.js:** 18 or higher
- **Maven:** 3.6 or higher

---

## 📚 **HELPFUL COMMANDS**

```bash
# Check Java classpath
mvn dependency:tree

# Check npm packages
npm list

# Update dependencies
mvn versions:display-dependency-updates
npm outdated

# Clean everything
mvn clean
rm -rf node_modules

# Format code (if prettier installed)
npm run format
```

---

## 🎓 **LEARNING RESOURCES**

- **Federated Learning:** [McMahan et al. 2017 paper](https://arxiv.org/abs/1602.05629)
- **Spring Boot:** https://spring.io/guides
- **React:** https://react.dev/learn
- **Vite:** https://vitejs.dev/guide/

---

<div align="center">

**Bookmark this page for quick reference! 📌**

</div>
