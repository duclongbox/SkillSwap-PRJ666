# SkillSwap-PRJ666
### 1. Install dependencies

#### Backend
```sh
cd backend
npm install
```

#### Frontend
```sh
cd frontend
npm install
```


### 2. Run the app

- **Backend:**  
  ```sh
  cd backend
  npm start
  ```
- **Frontend:**  
  ```sh
  cd frontend
  npm run dev
  ```

---

### 3. Development Workflow

- **Frontend:**  
  - All React code goes in `frontend/src/`.
  - Use `components/` for reusable UI (ex: login Form, Card, Table, ...), 
  - Use the pages/ folder for route-level pages (e.g., Home page, Login page). Create your pages here.
  - Use the `services/` folder for API calls, or you can call APIs directly within your page .jsx files. Refer to the backend code in `routes/v1/index.js` to see available API endpoints and responses.
  -`context/` for global state authentication function, and `utils/` for helper functions.
  - Check App.jsx to see how to apply auth to each page routes
  - Use Tailwind CSS for styling.
  - Use environment variables for API URLs.

- **Backend:**  
  - All server code goes in `backend/`.
  - if you need to create a new API endpoint, define the endpoint in `routes/v1/index.js`, cCreate the corresponding function for that API in `controller/` 
  -  `models/` for Mongoose schemas, `routes/` for API endpoints, `middleware/` for Express middleware, and `config/` for configuration (e.g., Passport).


---


## Best Practices

- Use clear, descriptive names for files and functions.
- Keep components and functions small and focused.
- Use environment variables for configuration.
- Write comments for complex logic.
- Always pull the latest changes before starting new work.
- Create a new branch for each feature or bugfix.

---

## Contributing

1. **Fork the repo** and create your branch from `main`.
2. **Test your changes** before pushing.
3. **Open a Pull Request** with a clear description of your changes.



---

Happy coding! 🚀
