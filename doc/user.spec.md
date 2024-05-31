# USER API

## End Points

### 1. Create User

**Endpoint:** `POST /user/register`

**Description:** Create a new user

#### Request

- **Headers:**
  - `Content-Type: application/json`
- **Body**

```json
{
  "phoneNumber": "08123134707",
  "name": "aksa",
  "password": "rahasiabanget"
}
```

#### Response

- **Status**: `201`
- **Body**

```json
{
  "id": "1",
  "phoneNumber": "08123134707",
  "name": "aksa"
}
```

### 2. Login User

**Endpoint:** `POST /user/login`

**Description:** User do login

#### Request

- **Headers:**
  - `Content-Type: application/json`
- **Body**

```json
{
  "phoneNumber": "08123134707",
  "password": "rahasiabanget"
}
```

#### Response

- **Status**: `200`
- **Body**

```json
{
  "id": "1",
  "phoneNumber": "08123134707",
  "name": "aksa",
  "token": "jwt-token"
}
```

### 3. Logout User

**Endpoint:** `POST /user/logout`

**Description:** User do logout

#### Request

- **Headers:**
  - `Content-Type: application/json`
  - `Authorization: Bearer <token>`
- **request.user**

  ```json
  {
    "_id": 1,
    "name": "aksa",
    "phoneNumber":"08123134707,
  }
  ```

#### Response

- **Status**: `200`
- **Body**

```json
{
  "id": "1",
  "phoneNumber": "08123134707",
  "name": "aksa",
  "token": null
}
```
