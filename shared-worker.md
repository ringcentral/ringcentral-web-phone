# shared worker

## The goal

If there are multiple browser tabs, we would like all of them to use the same shared worker to do SIP signaling.

When a tab is having a call session, we would like all other tab to display the same call session.
Only that tab is establishing a WebRTC connection. All other tabs just privde GUI to display the call session.

User should be able to perform actions on any tab. For example, user can hang up the call on any tab, user can transfer the call on any tab.

All tabs should have GUI fully in sync.

## Kinds of sessions

We classify the sessions into two kinds:

1. real session. If a session is created or answered in current tab, it is a real session.
2. dummy session. If a session is created or answered in another tab, it is a dummy session.

By default, shared worker is not used at all, and all the sessions should be local and real.

If shared worker is enabled, we need to distinguish between real session and dummy session.
When a session becomes real, it needs to broadcast to all other tabs to tell them that their sessions are dummy.

## Kinds of actions

We classify the actions into four kinds:

1. can be done on any session, and you don't need to notify other tabs. Because SIP server will notify all tabs anyway.
   - decline
   - to voicemail
   - forward
   - reply
   - transfer
   - hang up
   - flip
   - park
2. can be done on any session, but you need to notify other tabs.
   - make an outbound call
   - answer inbound call
   - start/stop recording
3. can only be done on a real session, and you don't need to notify other tabs.

- send DTMF

4. can only be done on a real session, and you need to notify other tabs.

- mute/unmute
- hold/unhold
- warm transfer (depends on hold/unhold)
