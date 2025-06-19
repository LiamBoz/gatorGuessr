# gatorGuessr

Follow these steps to get the app up and running:

### Clone the Repository

```bash
git clone https://github.com/your-username/your-repo.git
cd your-repo

Build the Docker Images

docker-compose build

Start the Services

docker-compose up



Port	Service	Description
5173	Frontend
8000	Backend	FastAPI server (Swagger: /api/docs)
5432	PostgreSQL	Database connection port
5050	pgAdmin	Access database GUI at localhost:5050

    📝 Note: The backend service is currently commented out in the docker-compose.yml. Uncomment it to activate FastAPI.

🔐 Credentials
PostgreSQL

    Username: admin

    Password: password

pgAdmin

    Email/Login: admin@email.com

    Password: password

📚 API Docs

Once the backend is running, access the interactive API documentation at:

http://localhost:8000/api/docs
