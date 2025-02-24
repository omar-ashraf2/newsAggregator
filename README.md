# NexaNews - Modern News Aggregator

## Overview

NexaNews is a powerful and modern news aggregation app that seamlessly fetches and displays articles from multiple sources, including:

- **NewsAPI**
- **The Guardian API**
- **New York Times API**

It provides an intuitive and efficient news browsing experience with **advanced filtering**, **sorting**, and **search** capabilities to ensure users always receive the most relevant updates.

### **Hosted Demo:**

You can try the **live hosted version** here:  
<https://nexanews-black.vercel.app/>

---

## Features

- **Multi-Source News Aggregation** – Merges news from **NewsAPI**, **The Guardian**, and **New York Times**
- **Advanced Filtering & Sorting** – Filter by **category, source, date range, and sort order**
- **Keyword Search** – Search for specific topics or terms across all sources
- **Light/Dark Mode Support** – Toggle light and dark modes (including system theme preferences)
- **Optimized Pagination** – Efficient pagination with state persistence
- **State Management** – Uses **Redux Toolkit (RTK Query)** for data fetching and caching
- **Error Handling** – User-friendly toasts for API failures, rate limits, and network issues
- **Comprehensive Testing** – Unit and integration tests using **Vitest & React Testing Library**
- **Fully Containerized** – Dockerized for straightforward deployment
- **Fast & Lightweight** – Built with **Vite** for quick dev and optimized production builds

---

## Tech Stack

- **Frontend:** React, TypeScript, Vite
- **State Management:** Redux Toolkit (RTK Query)
- **UI Framework:** ShadCN UI, Tailwind CSS
- **Testing:** Vitest, React Testing Library
- **API Integration:** NewsAPI, The Guardian, NYT API
- **Error Handling:** Custom RTK Interceptor with Toast Notifications
- **Deployment:** Docker, Nginx

---

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

3. **Set up environment variables** (create a `.env` file)

   ```sh
   VITE_NEWSAPI_BASE_URL=https://newsapi.org/v2
   VITE_GUARDIAN_BASE_URL=https://content.guardianapis.com
   VITE_NYTIMES_BASE_URL=https://api.nytimes.com/svc/search/v2

   VITE_NEWSAPI_KEY=your_newsapi_key
   VITE_GUARDIAN_KEY=your_guardian_api_key
   VITE_NYTIMES_KEY=your_nytimes_api_key
   ```

   **Note:** If running locally **without** Docker, ensure you **uncomment** the environment variable imports in each API file (they're labeled “For Dev”) and **comment out** the “For Prod” lines that use `getEnv(...)`.

4. **Start the development server**
   ```sh
   npm run dev
   ```

---

## Usage

### Filters & Search

- **Search** by entering keywords.
- **Filter** by source, category, date range, and sort order.
- **Paginate** through results efficiently.

### Light/Dark Mode

- Toggle **light/dark mode** via the theme switch.
- Supports **system default** theme preference.

---

## Deployment

### 1. **Hosted**

View the live demo on Vercel at:  
<https://nexanews-black.vercel.app/>

### 2. **Docker Deployment**

You can run NexaNews using Docker with the **prebuilt image**:

#### **Pull & Run the Container**

1. **Pull from Docker Hub**
   ```sh
   docker pull etdodger1/nexanews:latest
   ```
2. **Run the container**
   ```sh
   docker run -d \
     --name nexanews \
     -p 80:80 \
     etdodger1/nexanews:latest
   ```
   Access it at <http://localhost>.

#### **Build & Run Manually**

Alternatively, build the image yourself:

1. **Build**
   ```sh
   docker build -t nexanews .
   ```
2. **Run**
   ```sh
   docker run -d --name nexanews -p 80:80 etdodger1/nexanews:latest
   ```
   Access it at <http://localhost:3000>.

---

## State Management

- **Redux Toolkit (RTK Query)** for API requests and caching.
- **Redux Persist** stores user filters & preferences across sessions.

---

## API Handling & Error Management

- **RTK Query Interceptor** for handling API errors, network failures, and partial success.
- **Toast notifications** for rate limits, offline states, and other issues.
- **Partial failure handling** ensures that a single failing source doesn’t crash the entire aggregator.

---

## Testing

- **Unit & Integration Tests** with **Vitest & React Testing Library**.
- **Mocked API Responses** provide consistent, reliable tests.

---

## API Limitations & Considerations

🚨 **Important Notes:**

- **Free-tier APIs** have rate limits.
- Some sources may **return partial data** if limits are reached.
- The app **tolerates partial failures** gracefully.

---

## Documentation

- **Docker Hub:** [NexaNews Docker Image](https://hub.docker.com/r/etdodger1/nexanews)
- **Live Demo:** [NexaNews on Vercel](https://nexanews-black.vercel.app/)
- **Local Development:** `npm run dev`
- **Project Repo:** [GitHub - omar-ashraf2/nexanews](https://github.com/omar-ashraf2/nexanews)
