[SIP.js](../README.md) / [Exports](../modules.md) / PublisherState

# Enumeration: PublisherState

[Publisher](../classes/Publisher.md) state.

**`remarks`**
The [Publisher](../classes/Publisher.md) behaves in a deterministic manner according to the following
Finite State Machine (FSM).
```txt
                 __________________________________________
                |  __________________________              |
Publisher       | |                          v             v
Constructed -> Initial -> Published -> Unpublished -> Terminated
                             |   ^____________|             ^
                             |______________________________|
```

## Table of contents

### Enumeration members

- [Initial](PublisherState.md#initial)
- [Published](PublisherState.md#published)
- [Unpublished](PublisherState.md#unpublished)
- [Terminated](PublisherState.md#terminated)

## Enumeration members

### Initial

• **Initial** = `"Initial"`

#### Defined in

sip.js/lib/api/publisher-state.d.ts:17

___

### Published

• **Published** = `"Published"`

#### Defined in

sip.js/lib/api/publisher-state.d.ts:18

___

### Unpublished

• **Unpublished** = `"Unpublished"`

#### Defined in

sip.js/lib/api/publisher-state.d.ts:19

___

### Terminated

• **Terminated** = `"Terminated"`

#### Defined in

sip.js/lib/api/publisher-state.d.ts:20
