# Prayer Board Backend

Node.js/Express API for Prayer Board application.

## Setup

```bash
npm install
```

## Environment Variables

Create `.env` file:

```env
MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/prayer-board?retryWrites=true&w=majority
JWT_SECRET=your_secret_key_here
NODE_ENV=development
PORT=5000
```

## Run Development

```bash
npm start
```

Server runs on http://localhost:5000

## API Endpoints

### Auth
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (auth required)

### Prayer Requests
- `GET /api/requests` - Get all requests
- `POST /api/requests` - Create request
- `POST /api/requests/:id/pray` - Increment prayer count
- `PATCH /api/requests/:id/status` - Update status (auth required)
- `DELETE /api/requests/:id` - Delete request (admin only)

### Comments
- `GET /api/requests/:id/comments` - Get comments
- `POST /api/requests/:id/comments` - Add comment (auth required)
- `DELETE /api/comments/:id` - Delete comment (auth required)

## Deployment

See DEPLOYMENT.md in project root.
