---
hide:
  - navigation
  - toc
title: RingCentral's Web Phone SDK - a javascript tool to aid in creating browser-based phones
---

# RingCentral WebPhone SDK

!!! info "Migrate to Web Phone SDK 2.0" This website is devoted to the latest
version of the RingCentral Web Phone SDK, version 2.x. While we will continue to
support 1.x, we will no longer be actively be maintaining it. **If you are still
using version 1.0, we recommend you migrate your application to the latest
version.**

The RingCentral WebPhone SDK is a toolset for use within the context of a web
browser. Developers use the SDK to build custom phone clients and CTIs from the
ground up. The WebPhone SDK utilizes a user's credentials obtained independently
through OAuth to place and receive phone calls.

Once a call is connected and a session established, the WebPhone SDK can be used
to manipulate that phone call in all the ways you would expect a device to be
able to, including:

- answering and hanging up
- muting and unmuting
- placing or removing someone from hold
- transferring or merging calls
- starting, stopping and pausing a recording
- and so forth

Furthermore, the WebPhone SDK can be combined with other SDKs to call the
RingCentral REST API in order to create more advanced applications that leverage
other data sources and APIs throughout the RingCentral ecosystem and beyond.

## Explore a live demo of the WebPhone SDK

<div class="grid cards" markdown>

- :material-application:{ .lg .middle } **Live demo**

  ---

  Access a live demo of the WebPhone SDK. You will need to register an app and
  obtain credentials first.

  [:octicons-arrow-right-24: Launch demo](https://ringcentral.github.io/web-phone-demo/)

- :material-github:{ .lg .middle } **Source code**

  ---

  Access, clone or fork the WebPhone SDK demo on Github to kick start the
  development on your custom CTI.

  [:octicons-arrow-right-24: Explore the source code](https://github.com/ringcentral/web-phone-demo)

</div>
