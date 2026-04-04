# Insurance STP — Intelligent Claim Processing

This repository implements an automated insurance claim processing system with Straight-Through Processing (STP) for Car and Travel claims. The system is designed to streamline the insurance claim lifecycle by automating the submission, validation, scoring, and settlement processes. It supports both car and travel insurance claims, with built-in mechanisms for manual review when required.

The backend provides RESTful APIs for:
- Submitting car and travel insurance claims.
- Automatically validating and scoring claims using machine learning models.
- Fetching claims that require manual review.
- Submitting decisions for claims under manual review.

The system integrates with external services such as:
- **Roboflow** for object detection in car damage claims.
- **OCR models** for extracting data from travel-related documents.
- **SMTP and Telegram** for notifications.

This backend serves as the foundation for building a frontend application that allows users to:
- Submit claims with relevant details and evidence.
- Track the status of their claims.
- Receive notifications about claim decisions.

---

## Frontend Development Prompt

### Context
This repository (`insurance-backend`) provides the backend services for the Insurance STP system. The frontend application, which interacts with this backend, is maintained in a separate repository. The frontend will consume the APIs provided here to enable users to submit and manage their insurance claims seamlessly.

### Objective
Build a user-friendly frontend application that interacts with the backend APIs to provide a seamless experience for users submitting and managing their insurance claims.

### Key Features
1. **Claim Submission**:
   - Create forms for submitting car and travel insurance claims.
   - Include fields for all required data (e.g., claimant details, policy number, description, evidence upload).
   - Validate user inputs before submission.

2. **Claim Status Tracking**:
   - Display the status of submitted claims.
   - Show detailed information about each claim, including scores and decisions.

3. **Manual Review Dashboard**:
   - Build an admin dashboard for manual reviewers.
   - List claims awaiting review with relevant details.
   - Provide options to approve or reject claims.

4. **Notifications**:
   - Integrate with the backend to display notifications for claim updates.
   - Use real-time updates (e.g., WebSockets or polling) to inform users of status changes.

### API Integration
- Use the provided RESTful APIs to interact with the backend.
- Ensure proper error handling and display user-friendly messages for API failures.

### Suggested Tech Stack
- **Frontend Framework**: React, Angular, or Vue.js.
- **State Management**: Redux, Context API, or Vuex.
- **Styling**: Tailwind CSS, Bootstrap, or Material-UI.
- **API Communication**: Axios or Fetch API.
- **Real-Time Updates**: WebSockets or libraries like Socket.IO.

### Pages and Components
1. **Home Page**:
   - Overview of the service.
   - Links to claim submission forms and status tracking.

2. **Claim Submission Pages**:
   - Separate pages for car and travel claims.
   - Forms with all required fields and file upload functionality.

3. **Claim Status Page**:
   - List of submitted claims with their statuses.
   - Detailed view for each claim.

4. **Admin Dashboard**:
   - List of claims requiring manual review.
   - Approve/reject functionality with comments.

5. **Notifications**:
   - Notification center for claim updates.

### Additional Considerations
- **Repository Coordination**: Ensure the frontend repository is configured to communicate with this backend.
- **Responsive Design**: Ensure the application is mobile-friendly.
- **Accessibility**: Follow WCAG guidelines to make the app accessible to all users.
- **Testing**: Write unit and integration tests for critical components.
- **Deployment**: Deploy the frontend using platforms like Vercel, Netlify, or AWS Amplify.

---

## Quick Start

### 1. Clone & Install
```bash
cd insurance-stp
pip install -r requirements.txt
```

### 2. Configure Environment
```bash
cp .env.example .env
# Edit .env with your keys:
# - ROBOFLOW_API_KEY + ROBOFLOW_MODEL_ID
# - SMTP credentials (Gmail App Password recommended)
# - TELEGRAM_BOT_TOKEN + TELEGRAM_REVIEWER_CHAT_ID
```

### 3. Build Policy Index (Run Once)
```bash
python scripts/build_policy_index.py
```
Add your policy PDFs to `policy_store/raw/` before running. Without PDFs, it auto-generates sample policy chunks so the system still works.

### 4. Run the Server
```bash
uvicorn app.main:app --reload --port 8000
```

### 5. Open API Docs
```
http://localhost:8000/docs
```

---

## API Endpoints

### 1. **Health Check**
- **Endpoint**: `GET /health`
- **Description**: Returns the health status of the service.
- **Response**:
  ```json
  {
    "status": "ok",
    "service": "Insurance STP API"
  }
  ```

---

### 2. **Car Claims**
#### Submit Car Claim
- **Endpoint**: `POST /car/submit`
- **Description**: Submits a car insurance claim.
- **Payload** (Form Data):
  - `claimant_name` (str): Name of the claimant.
  - `claimant_email` (str): Email of the claimant.
  - `claimant_telegram_id` (str, optional): Telegram ID of the claimant.
  - `policy_number` (str): Policy number.
  - `description` (str): Description of the claim.
  - `selected_damage` (str): Dropdown — exact YOLO class name.
  - `estimated_amount` (float): Estimated claim amount.
  - `evidence` (file): Evidence file (e.g., image).
- **Response**:
  ```json
  {
    "claim_id": "string",
    "status": "submitted",
    "message": "Car claim submitted successfully."
  }
  ```

---

### 3. **Travel Claims**
#### Submit Travel Claim
- **Endpoint**: `POST /travel/submit`
- **Description**: Submits a travel insurance claim.
- **Payload** (Form Data):
  - `claimant_name` (str): Name of the claimant.
  - `claimant_email` (str): Email of the claimant.
  - `claimant_telegram_id` (str, optional): Telegram ID of the claimant.
  - `policy_number` (str): Policy number.
  - `description` (str): Description of the claim.
  - `trip_origin` (str): Origin of the trip.
  - `trip_destination` (str): Destination of the trip.
  - `travel_date` (str): Date of travel.
  - `selected_category` (str): Dropdown — "Luggage Lost", "Flight Delay", "Flight Cancellation".
  - `estimated_amount` (float): Estimated claim amount.
  - `evidence` (file): Evidence file (e.g., image).
- **Response**:
  ```json
  {
    "claim_id": "string",
    "status": "submitted",
    "message": "Travel claim submitted successfully."
  }
  ```

---

### 4. **Manual Review**
#### Get Review Queue
- **Endpoint**: `GET /review/queue`
- **Description**: Fetches all claims awaiting manual review.
- **Response**:
  ```json
  [
    {
      "claim_id": "string",
      "claim_type": "car/travel",
      "claimant_name": "string",
      "claimant_email": "string",
      "policy_number": "string",
      "description": "string",
      "final_score": 0.0,
      "created_at": "string"
    }
  ]
  ```

#### Submit Review Decision
- **Endpoint**: `POST /review/{claim_id}/decision`
- **Description**: Submits a decision for a claim under manual review.
- **Payload**:
  ```json
  {
    "decision": "approve/reject"
  }
  ```
- **Response**:
  ```json
  {
    "claim_id": "string",
    "status": "approved/rejected",
    "message": "Review decision submitted successfully."
  }
  ```

---

## Project Structure

- **`app/`**: Contains the main application logic.
  - **`api/`**: API routes for health, car claims, travel claims, and manual review.
  - **`db/`**: Database models and CRUD operations.
  - **`services/`**: Notification and settlement services.
  - **`utils/`**: Utility functions (e.g., logging, file handling).

- **`ml_models/`**: Machine learning models for OCR and field parsing.

- **`policy_store/`**: Stores policy data (chunks, indexes, raw files).

- **`scripts/`**: Utility scripts for building policy indexes, seeding the database, and verifying the system.

---

This prompt provides the foundation for building a robust frontend application that complements the backend services. Let me know if you need further details or assistance!