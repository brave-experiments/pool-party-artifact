# Pool Party Demonstration

## Introduction

This code demonstrates pool party attacks as described in https://www.usenix.org/conference/usenixsecurity23/presentation/snyder.

Pool party attacks make use of a covert communication channel between two websites concurrently loaded in a web browser. One website sends a message to a second website by exploiting limited-but-unpartitioned resource pools.

In this proof of principle script, we demonstrate the passing of short messages using three different limited-but-unpartitioned resources pools: the WebSocket pool, the Web Worker pool, and the EventSource pool.

As described in the paper, different covert channels are usable in each browser. The available covert channels are:

* Server Sent-Events: Chrome, Edge
* WebSockets: Chrome, Edge, Firefox, Tor Browser
* Web Workers: Firefox

(At the time the research was being carried out, Brave was vulnerable to WebSockets and EventSource pool party attacks; Brave has since been patched to fix this vulnerability.)

In this demo, the same website (and code) is run in both websites. A top-level page loads an iframe under each top-level page. The iframe document in turn loads a script that runs the attack. 

## Files

Here's a description of the important files in this repository:

* `README.md`: This file, containing a description of the code.
* `LICENSE`: This software is licensed under the Mozilla Public License Version 2.0.
* `package.json`: The Node.js settings for this project.`
* `index.js`: The Express.js server code. An active server is required to accept EventSource and WebSocket connections, so that connecting browsers may measure how many of these connections can be made successfully before hitting a browser-imposed limit.
* `static/`: A directory containing static HTML and JS files
  * `index.html`: A simple landing page with instructions for opening two windows
  * `table.js`: A script for providing the correct links on the landing page (`index.html`).
  * `test.html`: The top-level page opened under each website for running the demo site.
  * `inner.html`: The iframe document where inner.js is embedded and where the results of the pool party message passing are displayed.
  * `inner.js`: The main script that performs the pool party demo. Includes code for sending data between websites.
  * `worker.js`: A script run by Web Workers that are created during the Web Worker pool party attack.

## Server

A live instance of the pool party demo is available at https://poolparty.brave.com/.

It's also possible to run your own instance.

Two hosts are necessary to demonstrate that messages are being sent across websites (first parties). The particular APIs used generally require a secure website, so it's necessary to either register two domains and set up TLS certificates, or you can set up local test domains (for example, using [mkcert](https://github.com/FiloSottile/mkcert).)

Once both domains are pointed to the same server, you can install dependencies and then run the Express.js instance using the following commands:

```shell
cd poolparty
npm install
node index.js
```

## Requirements

### Hardware dependencies

A multicore personal computer should be sufficient to run these tests. Our tests were run on a 2021 MacBook Pro M1 using macOS Ventura; some variation in performance or accuracy may be expected on other machines.

### Software dependencies

To run these tests, it is necessary to download the required
desktop web browsers. As of writing, these are available at:

* Brave: https://brave.com/download/
* Chrome: https://www.google.com/chrome/
* Edge: https://www.microsoft.com/en-us/edge
* Firefox: https://firefox.com
* Tor Browser: https://www.torproject.org/download/

## Testing

For each of the web browser / covert channel combinations
listed above, carry out the following verification steps.
Preparation Open the browser being subjected to testing
in a clean profile. Open two browser windows and position
them side-by-side on the screen.

1. In window 1, paste one of following threee URLs (de-
pending on the covert channel type):
  * https://poolparty.brave.com/test.html?mode=websocket
  * https://poolparty.brave.com/test.html?mode=sse
  * https://poolparty.brave.com/test.html?mode=worker

2. In window 2, quickly paste the corresponding URL from
the following three alternatives (again depending on the
covert channel type):

  * https://poolparty.bravesoftware.com/test.html?mode=websocket
  * https://poolparty.bravesoftware.com/test.html?mode=sse
  * https://poolparty.bravesoftware.com/test.html?mode=worker

3. After the pages have loaded, observe logged messages as they are sent by one window and received by the other.

4. Compare the sent and received messages (hexadecimal strings) that have been logged on the web pages at approximately the same time. To verify that messages are being successful sent, the evaluator can check whether they (usually) match. Matching (i.e., identical) strings indicate a message that has been successfully transmitted from one window to the other.

Each experiment consists of two web pages, viewed side by side in separate browser windows. For each experiment, the script will make approximately 100 communication attempts. In each attempt, the script in one window (chosen randomly) will attempt to send 35 bits to the other window using a pool party covert channel. The outcome of each attempt will be displayed in the page, where the message that was "sent" over the covert channel will be displayed as an 8-digit hexadecimal string in one window, and the "received" in the other window will be also be displayed as an 8-digit hexadecimal string. As sent and received strings are displayed in each web page accumulated in chronological order, with time stamps.

It is expected that these strings will largely be identical (match). There are two exceptions where mismatches may be seen. First, because the first page may load some seconds before the other page, a few rounds of messaging will be unfruitful for the first opened page. (This behavior mimics the experience of web pages in the wild, which will be likely opened by the user at different times.) Second, because of timing anomalies in the creation and destruction of resources in the resource pool, it does happen that a message may be corrupted, as described in the paper.

