# 📡 Streaming Bounded Context

The **Streaming bounded context** is responsible for delivering media content to clients.

While the **Media context** manages the lifecycle of audio assets, the Streaming context focuses on **playback and distribution**.

```
streaming/
└── playback/
```

---

# 🎧 Services

## ▶️ Playback

**Role**

The Playback service manages the process of delivering media streams to users.

It acts as the gateway between clients and the underlying media delivery infrastructure.

**Responsibilities**

* create and manage playback sessions
* authorize playback requests
* generate streaming URLs
* integrate with CDN or streaming infrastructure
* provide playback metadata to clients

---

# 🔄 Interaction with Other Contexts

The Streaming context interacts with other parts of the system.

### Media Context

The Streaming system depends on Media services for:

* track availability
* encoded media assets
* metadata required for playback

Typical interaction flow:

```
Client → Playback Service → Media Assets → Stream Delivery
```

---

# 🧭 Design Goals

The Streaming context focuses on:

### ⚡ High Availability

Playback must remain reliable and responsive.

---

### 🚀 Scalability

Streaming services must support **high concurrency** and large traffic spikes.

---

### 🔐 Secure Delivery

Playback authorization ensures that media is only delivered to authorized clients.

---

# 🛠 Development

To start the streaming services locally:

```bash
pnpm turbo run dev --filter=playback
```

Or run the full platform:

```bash
./bin/dev
```

---

# 🔗 Related Contexts

| Context      | Responsibility                   |
| ------------ | -------------------------------- |
| **Media**    | Media ingestion and processing   |
| **Identity** | User authentication and identity |

---

# 🎯 Summary

The Streaming bounded context focuses entirely on **delivering media to users efficiently and securely**, acting as the final stage of the platform's media pipeline.
