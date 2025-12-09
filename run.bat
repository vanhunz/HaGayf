@echo off
REM Start backend in background
start "Backend" cmd /c "java -jar backend/target/federated-backend-0.0.1-SNAPSHOT.jar"
timeout /t 5 /nobreak
REM Start frontend
cd frontend
npm run dev
