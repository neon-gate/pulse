# 👥 Populus — Identity Directory Service

Populus is the **user identity directory** for the platform.

It manages the **core user profile data** that represents a person inside the system.

Unlike the authentication service, Populus is **not responsible for login or token management**.  
Its responsibility is to maintain the **canonical user identity records** used across services.

---

# Responsibilities

Populus manages:

- user profiles
- identity records
- profile updates
- user lookup
- internal user identifiers

---

# Domain Concepts

Core entities include:

User  
Profile  
UserId

These represent the **platform identity layer** used by other services.

---

# Role in Architecture
```bash
Clients
↓
Authentication Service
↓
Populus (Identity Directory)
```
Authentication validates credentials, while 
**Populus stores the identity records**.

---

# Example Use Cases

- retrieve user profile
- update display name
- resolve internal user id
- lookup user by email