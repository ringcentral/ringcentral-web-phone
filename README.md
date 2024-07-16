# RingCentral Web Phone 2

This is a complete rewrite of the RingCentral Web Phone SDK.


## Notes

一个 callSession, 被添加到 store. 然后修改 callSession 的状态, 并不会出发 store 的更新, 因为我们修改的是 proxy 之前的 callSession.
