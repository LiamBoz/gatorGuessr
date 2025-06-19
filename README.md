# gatorGuessr

Follow these steps to get the app up and running:

### Clone the Repository

```bash
git clone {link}
cd gatorGuessr
```

### Build the Docker Images

```bash
docker-compose build
```

### Start the Services

```bash
docker-compose up
```

> **Note** You may need to use sudo if you run into issues with the docker commands.
---

##  Service Ports

| Port | Service  | Description                              | Local URL                           |
|------|----------|------------------------------------------|-------------------------------------|
| 5173 | Frontend | React Development server                 | [http://localhost:5173](http://localhost:5173) |
| 8000 | Backend  | FastAPI server (Swagger: `/api/docs`)    | [http://localhost:8000/api/docs](http://localhost:8000/api/docs) |
| 5050 | pgAdmin  | Access database GUI                      | [http://localhost:5050](http://localhost:5050) |

---
## Credentials

### PostgreSQL

- **Username:** `admin`
- **Password:** `password`

### pgAdmin

- **Email/Login:** `admin@email.com`
- **Password:** `password`

---

## API Docs

Once the backend is running, you can access the API routes at:

```
http://localhost:8000/api/docs
```
