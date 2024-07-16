# Verified News - Web3 Blockchain Dapp

**Verified News** is a Web3 decentralized application (dApp) that aims to restore trust in news articles. By leveraging blockchain technology and a community of professional journalists, we ensure that the news published on our platform is authentic, unbiased, and credible.

## General Idea

The workflow of Verified News is as follows:
1. **Journalist Registration**:
   - Professional journalists with experience, proven track records, integrity, and trustworthiness contact us through the application form.
   - Upon approval, they are added to the journalist list.

2. **Article Submission**:
   - Approved journalists can submit their articles/news on our platform.
   - These articles are stored on the blockchain but are not displayed on the platform until they are approved by other journalists.

3. **Article Approval**:
   - The number of approvals needed depends on the author and reviewer credibility scores.
   - The higher the credibility score, the fewer approvals are needed before an article goes public on our platform.

4. **Voting and Credibility**:
   - Once published, other journalists can vote positively or negatively on the article.
   - Votes affect the credibility scores of both the author and the reviewers.
   - This ensures that journalists strive to be authentic and honest to maintain a good credibility score, which translates to better fame, public recognition, and a bigger audience reach.
   - The system ensures integrity and prevents bias, as any attempt to publish fake news by a few journalists can be countered by the larger community of reviewers.
  
## Check out our Video overview here ---> [![Watch the video](https://github.com/KonstantinosLamprakis/articleChain/blob/main/images/Screenshot%202024-07-14%20at%2007.00.13.png)](https://www.youtube.com/watch?v=abc123)

## Technologies Used

### Frontend
- **Bootstrap**: Fast implementation and mobile-friendly approach.
- **Bootstrap Studio**: For efficient design and prototyping.
- **Vanilla JS**: Lightweight JavaScript for custom functionality.

### Backend
- **Node.js**: Provides many tools out of the box, including integration with Filecoin, Web3Auth, and compatibility with JavaScript on the frontend.

### Smart Contract
- **Solidity**: Deployed on both Sepolia and Polygon testnets.

### Partners and Services
- **Filecoin**: Used to store heavy files like images, PDFs, etc.
- **Polygon and Sepolia**: Used to store small sensitive information such as Filecoin CIDs, author addresses, etc.
- **Web3Auth**: Ensures transparency and data-friendly client-side authentication. Facilitates a smooth registration process for journalists and visitors.
- **Lighthouse**: Assisted in the development process.
- **Infura**: Supported our infrastructure needs.

## Project Structure

The project contains two main folders:
1. **Contract Deployment** (contract_deployment): Contains all the necessary code and scripts for deploying smart contracts.
2. **Server-Client App** (webserver): Contains the code for the server-side and client-side applications, facilitating the interaction between users and the blockchain.

## Getting Started

### Prerequisites
- Node.js v.18
- npm (Node Package Manager)

### Installation

1. **Clone the repository**:
   ```sh
   git clone https://github.com/your-username/verified-news.git
   cd verified-news && cd webserver
2. **Clone the repository**:
   ```sh
   npm install
   node server.js

