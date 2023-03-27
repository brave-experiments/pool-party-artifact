# Pool Party Demonstration

## Introduction

This code demonstrates pool party attacks as described in https://arxiv.org/abs/2112.06324.

Pool party attacks make use of a covert communication channel between two websites concurrently loaded in a web browser. One website sends a message to a second website by exploiting limited-but-unpartitioned resource pools.

In this proof of principle script, we demonstrate the passing of short messages using three different limited-but-unpartitioned resources pools: the WebSocket pool, the Web Worker pool, and the EventSource pool.

As described in the paper, different covert channels are usable in each browser. The available covert channels are:

* Server Sent-Events: Chrome, Edge (previously Brave)
* WebSockets: Chrome, Edge, Firefox, Tor Browser
* Web Workers: Firefox

In this demo, the same website (and code) is run in both websites. A top-level page loads an iframe under each top-level page. The iframe document in turn loads a script that runs the attack. 

## Files

Here's a description of the important files in this repository:

* `README.md`: This file, containing a description of the code.
* `package.json`: The Node.js settings for this project.`
* `index.js`: The Express.js server code. An active server is required to accept EventSource and WebSocket connections, so that connecting browsers may measure how many of these connections can be made successfully before hitting a browser-imposed limit.
* `static/`: A directory containing static HTML and JS files
  * `index.html`: A simple landing page with instructions for opening two windows
  * `table.js`: A script for providing the correct links on the landing page (`index.html`).
  * `test.html`: The top-level page opened under each website for running the demo site.
  * `inner.html`: The iframe document where inner.js is embedded and where the results of the pool party message passing are displayed.
  * `inner.js`: The main script that performs the pool party demo. Includes code for sending data between websites.

## Testing

A live instance of the pool party demo is available at https://poolparty.brave.com/.

To run the test, pick a covert channel (Web Workers, WebSockets, or Server-Sent Events) and open two windows side by side. Then look for matching 35-bit messages that are being sent between browsers. If the sent message from one window matches the received message in a second window, then the message has been sent successfully.

## Setup

It's also possible to run your own instance.

Two hosts are necessary to demonstrate that messages are being sent across websites (first parties). The particular APIs used generally require a secure website, so it's necessary to either register two domains and set up TLS certificates, or you can set up local test domains (for example, using [mkcert](https://github.com/FiloSottile/mkcert).)

Once both domains are pointed to the same server, you can install dependencies and then run the Express.js instance using the following commands:

```shell
cd poolparty
npm install
node index.js
```

Then you can proceed with manual testing as described above in "Testing".
