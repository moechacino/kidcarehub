# Project Postponed
## Team dibubarkan

---
# Link : [POSTMAN API Documentation](https://documenter.getpostman.com/view/24530478/2sA3s4kVr5)

# WebSocket Documentation
## Methods

### `connection(client: AuthenticatedSocket)`

This method handles incoming WebSocket connections and sets up event listeners for the connected client.

## Events

### `join`

**Description**: Allows the client to join a specific group chat room.

- **Parameters**:
  - `groupChatId` (string): The ID of the group chat the client wants to join.

**Usage**:

```javascript
client.on("join", async (groupChatId: string) => { ... });
```

**Error Handling**:

- If `groupChatId` is not a valid number, an error is emitted.
- If the group chat is not found, an error is emitted.
- If the client does not have access to the group chat, an error is emitted.
- If the chat session has expired, an error is emitted.

**Example**:

```javascript
client.emit("join", "12345");
```

### `chat`

**Description**: Allows the client to send a message to a specific group chat room.

- **Parameters**:
  - `groupChatId` (string): The ID of the group chat where the message will be sent.
  - `message` (string): The message content to be sent.

**Usage**:

```javascript
client.on("chat", async (groupChatId: string, message: string) => { ... });
```

**Error Handling**:

- If `groupChatId` is not a valid number, an error is emitted.
- If the group chat is not found, an error is emitted.
- If the client does not have access to the group chat, an error is emitted.
- If the chat session has expired, an error is emitted.

**Broadcasting**:

- The message is broadcast to all clients in the group chat room.

**Example**:

```javascript
client.emit("chat", "12345", "Hello, this is a test message!");
```

## Error Handling

Errors are caught and emitted back to the client using the `error` event.

```javascript
client.emit("error", { message: error.message });
```

## Example Workflow

1. **Join a Group Chat**: The client sends a `join` event with the `groupChatId` to join the corresponding chat room.
2. **Send a Message**: The client sends a `chat` event with the `groupChatId` and the message content to send a message to the chat room.

