[SIP.js](../README.md) / [Exports](../modules.md) / RegistererState

# Enumeration: RegistererState

[Registerer](../classes/Registerer.md) state.

**`remarks`**
The [Registerer](../classes/Registerer.md) behaves in a deterministic manner according to the following
Finite State Machine (FSM).
```txt
                  __________________________________________
                 |  __________________________              |
Registerer       | |                          v             v
Constructed -> Initial -> Registered -> Unregistered -> Terminated
                             |   ^____________|             ^
                             |______________________________|
```

## Table of contents

### Enumeration members

- [Initial](RegistererState.md#initial)
- [Registered](RegistererState.md#registered)
- [Unregistered](RegistererState.md#unregistered)
- [Terminated](RegistererState.md#terminated)

## Enumeration members

### Initial

• **Initial** = `"Initial"`

#### Defined in

sip.js/lib/api/registerer-state.d.ts:17

___

### Registered

• **Registered** = `"Registered"`

#### Defined in

sip.js/lib/api/registerer-state.d.ts:18

___

### Unregistered

• **Unregistered** = `"Unregistered"`

#### Defined in

sip.js/lib/api/registerer-state.d.ts:19

___

### Terminated

• **Terminated** = `"Terminated"`

#### Defined in

sip.js/lib/api/registerer-state.d.ts:20
