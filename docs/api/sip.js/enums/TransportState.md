[SIP.js](../README.md) / [Exports](../modules.md) / TransportState

# Enumeration: TransportState

[Transport](../interfaces/Transport.md) state.

**`remarks`**
The [Transport](../interfaces/Transport.md) behaves in a deterministic manner according to the following
Finite State Machine (FSM).
```txt
                   ______________________________
                  |    ____________              |
Transport         v   v            |             |
Constructed -> Disconnected -> Connecting -> Connected -> Disconnecting
                    ^            ^    |_____________________^  |  |
                    |            |_____________________________|  |
                    |_____________________________________________|
```

## Table of contents

### Enumeration members

- [Connecting](TransportState.md#connecting)
- [Connected](TransportState.md#connected)
- [Disconnecting](TransportState.md#disconnecting)
- [Disconnected](TransportState.md#disconnected)

## Enumeration members

### Connecting

• **Connecting** = `"Connecting"`

The `connect()` method was called.

#### Defined in

sip.js/lib/api/transport-state.d.ts:22

___

### Connected

• **Connected** = `"Connected"`

The `connect()` method resolved.

#### Defined in

sip.js/lib/api/transport-state.d.ts:26

___

### Disconnecting

• **Disconnecting** = `"Disconnecting"`

The `disconnect()` method was called.

#### Defined in

sip.js/lib/api/transport-state.d.ts:30

___

### Disconnected

• **Disconnected** = `"Disconnected"`

The `connect()` method was rejected, or
the `disconnect()` method completed, or
network connectivity was lost.

#### Defined in

sip.js/lib/api/transport-state.d.ts:36
