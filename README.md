# NexaNews - Modern News Aggregator

## Overview

NexaNews is a powerful and modern news aggregation app that seamlessly fetches and displays articles from multiple sources, including:

- **NewsAPI**
- **The Guardian API**
- **New York Times API**

The application offers an intuitive and efficient news browsing experience with advanced filtering, sorting, and search capabilities, ensuring users receive the most relevant news updates.

## Features

✅ **Multi-Source News Aggregation** - Fetches and merges news from **NewsAPI, The Guardian, and The New York Times**.

✅ **Advanced Filtering & Sorting** - Users can filter articles by **category, source, date range, and sort order**.

✅ **Keyword Search** - Search for specific topics or terms across all sources.

✅ **Light/Dark Mode Support** - Fully supports **dark mode and system theme preferences**.

✅ **Optimized Pagination** - Efficient **pagination with state persistence**.

✅ **State Management** - Uses **Redux Toolkit (RTK Query) for data fetching, caching, and state persistence**.

✅ **Error Handling** - Provides user-friendly error messages and toasts for **API failures, rate limits, and connectivity issues**.

✅ **Comprehensive Testing** - Includes **unit and integration tests with Vitest & React Testing Library**.

✅ **Fully Containerized** - **Dockerized application** for easy deployment.

✅ **Fast & Lightweight** - Uses **Vite** for a fast development experience and optimized builds.

## Tech Stack

- **Frontend:** React, TypeScript, Vite
- **State Management:** Redux Toolkit (RTK Query)
- **UI Framework:** ShadCN UI, Tailwind CSS
- **Testing:** Vitest, React Testing Library
- **API Integration:** NewsAPI, The Guardian API, NYT API
- **Error Handling:** Custom RTK Interceptor with Toast Notifications
- **Deployment:** Docker, Nginx

## Installation & Setup

### Prerequisites

- **Node.js** (>= 18)
- **Docker** (for containerized deployment)

### Steps

1. **Clone the repository**

   ```sh
   git clone https://github.com/omar-ashraf2/nexanews.git
   cd nexanews
   ```

2. **Install dependencies**

   ```sh
   npm install
   ```

3. **Set up environment variables** (Create a `.env` file)

   ```sh
   VITE_NEWSAPI_BASE_URL=https://newsapi.org/v2
   VITE_GUARDIAN_BASE_URL=https://content.guardianapis.com
   VITE_NYTIMES_BASE_URL=https://api.nytimes.com/svc/search/v2

   VITE_NEWSAPI_KEY=your_newsapi_key
   VITE_GUARDIAN_KEY=your_guardian_api_key
   VITE_NYTIMES_KEY=your_nytimes_api_key
   ```

   **Note:** If running locally without Docker, ensure you **uncomment the environment variable imports** in each API file to use `.env` variables.

   You can find the comments (For Dev) and it will look like the below:

   ```js
   /* For Dev (Uncomment to use in dev environment and comment out in prod) */
   // const NYTIMES_BASE_URL = import.meta.env.VITE_NYTIMES_BASE_URL;
   // const NYTIMES_KEY = import.meta.env.VITE_NYTIMES_KEY;

   /* For Prod */
   const NYTIMES_BASE_URL = getEnv("VITE_NYTIMES_BASE_URL");
   const NYTIMES_KEY = getEnv("VITE_NYTIMES_KEY");
   ```

4. **Start the development server**

   ```sh
   npm run dev
   ```

## Usage

### Filters & Search

- **Search for articles** by entering a keyword.
- **Filter by source, category, date range, and sort order**.
- **Navigate between pages** using pagination controls.

### Light/Dark Mode

- Click the **theme toggle button** to switch between **light and dark mode**.

## Deployment

### Docker Deployment

You can run NexaNews using Docker with the prebuilt image from **Docker Hub**:

#### Pull & Run the Container

1. **Pull the image from Docker Hub**
   ```sh
   docker pull etdodger1/nexanews:latest
   ```
2. **Run the container**

   ```sh
   docker run -d --name nexanews -p 80:80 etdodger1/nexanews:latest
   ```

   - The application will be available at: **[http://localhost](http://localhost)**

#### Build & Run Manually

Alternatively, you can build the image yourself:

1. **Build the Docker image**
   ```sh
   docker build -t nexanews .
   ```
2. **Run the container**

   ```sh
   docker run -d -p 3000:80 --name nexanews nexanews
   ```

   - The application will be available at: **[http://localhost:3000](http://localhost:3000)**

## State Management

- Uses **Redux Toolkit (RTK Query)** to handle **API requests, caching, and state persistence**.
- **Redux Persist** ensures **filters & user preferences** persist across sessions.

## API Handling & Error Management

- **RTK Query Interceptor** handles **API errors and network failures**.
- **Toast notifications** inform users about **rate limits, network issues, and API failures**.
- **Partial Failure Handling** ensures **one failing API does not crash the entire app**.

## Testing

- **Unit & Integration tests** with **Vitest & React Testing Library**.
- **Mock API responses** for **reliable test cases**.

## API Limitations & Considerations

🚨 **Important Notes:**

- The app relies on **free-tier APIs**, which have **rate limits**.
- Some APIs may **return partial results** due to **rate limits or missing data**.
- If one API fails, the app **will still work using available sources**.

## Documentation

For further details on the app, refer to the **repository's Docker documentation** and **project documentation files**.

---

🐳 **Docker Hub:** [NexaNews Docker Image](https://hub.docker.com/repository/docker/etdodger1/nexanews/general)

🌐 **Live Application (After Running the Container):** [http://localhost](http://localhost) or [http://localhost:3000](http://localhost:3000) (If using manual build)
