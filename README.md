# Nebula — React Frontend

Premium frontend-only productivity dashboard built with React + Vite.

## Functionality

- Task creation, completion and deletion
- Task filters
- Search
- Focus/Pomodoro timer
- Quick notes
- Responsive sidebar/dashboard
- No backend
- No database
- No authentication
- All state is intentionally client-side

## Local

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
```

## Docker

```bash
docker build -t nebula-frontend .
docker run -d --name nebula-frontend -p 80:80 nebula-frontend
```

Open http://localhost

## EC2

```bash
git clone YOUR_REPOSITORY
cd nebula-react-frontend
docker build -t nebula-frontend .
docker run -d --name nebula-frontend -p 80:80 nebula-frontend
```

Allow inbound TCP 80 in the EC2 Security Group and open:

```text
http://YOUR_EC2_PUBLIC_IP
```
