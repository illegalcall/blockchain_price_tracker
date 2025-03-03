# Blockchain Price Tracker

A powerful and scalable blockchain price tracking service built with Nest.js that monitors cryptocurrency prices, provides customizable alerts, and offers swap rate calculations.

## Features

### 🕒 Automated Price Tracking
- Ethereum and Polygon price data collected every 5 minutes
- Historical data storage in a PostgreSQL database
- Clean and performant data model with MikroORM

### 📈 Price Alert System
- **Price Change Notifications**: Automatic email alerts when prices change by 3% or more compared to one hour ago
- **Custom Price Triggers**: Set personalized price alerts for specific blockchain assets and receive email notifications

### 🔄 Swap Rate Calculator
- Calculate ETH to BTC conversion rates in real-time
- Transparent fee calculations (0.03%)
- Returns both amount received and fee information in wei and dollar values

### 📊 Historical Data API
- RESTful endpoints for retrieving hourly price data (within 24 hours)
- Clean, well-documented API with Swagger integration

## Technical Stack

- **Backend**: Nest.js framework with TypeScript
- **Database**: PostgreSQL with MikroORM for database interactions
- **API Integration**: Moralis for blockchain data
- **Email Service**: MailerSend for reliable alert delivery
- **Documentation**: Swagger for comprehensive API documentation
- **Containerization**: Docker and Docker Compose for easy deployment
- **Testing**: Jest for unit and integration testing

## API Endpoints

The application provides the following API endpoints:

### Price Data
- `GET /prices/:tokenAddress` - Retrieve historical price data for a specific token

### Price Alerts
- `POST /alert` - Create a new price alert
- `GET /alert/email/:email` - Get all alerts for a specific email address
- `GET /alert/id/:id` - Get a specific alert by ID

### Swap Rates
- `GET /swap/:tokenAddress` - Calculate swap rates between tokens

## Running the Application

### Prerequisites
- Docker and Docker Compose

### Setup Steps

1. Clone the repository
```bash
git clone https://github.com/yourusername/blockchain-price-tracker.git
cd blockchain-price-tracker
```

2. Copy the environment example files
```bash
cp .env.example .env
cp .env.example.db .env.db
```

3. Configure environment variables in `.env` file:
```
PORT=5050
MORALIS_API_KEY='your_moralis_api_key'
MAILERSEND_API_KEY='your_mailersend_api_key'
NODEMAILER_EMAIL='your_email@example.com'
NODEMAILER_PASSWORD='your_email_password'
```

4. Configure database environment variables in `.env.db` file:
```
POSTGRES_USER=myuser
POSTGRES_PASSWORD=mypassword
POSTGRES_DB=mydatabase
```

5. Start the application with Docker Compose
```bash
docker compose up --build
```

6. Access the application
- API: http://localhost:5050
- Swagger Documentation: http://localhost:5050/api

## Architecture

The application follows a clean, modular architecture:

- **Cron Service**: Handles scheduled tasks like price data collection and price alert checks
- **Price Module**: Manages price data storage and retrieval
- **Alert Module**: Handles alert creation and notification
- **Swap Module**: Calculates exchange rates and fees
- **Moralis Service**: Interfaces with the Moralis API for real-time blockchain data

## Implementation Details

- **Automatic Price Tracking**: The application uses cron jobs to fetch and store cryptocurrency prices every 5 minutes
- **Price Alert System**: 
  - Automatic emails are sent when price changes exceed 3% in an hour
  - Users can set custom price alerts through the API
- **Data Storage**: All price data is stored in PostgreSQL with timestamps for historical tracking
- **Swagger Documentation**: All endpoints are fully documented with Swagger for easy testing and integration

## License

This project is licensed under the MIT License - see the LICENSE file for details.
